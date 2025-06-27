const boardElement = document.getElementById("board");
const winnerElement = document.getElementById("winner");
const modeButton = document.getElementById("modeButton");
const difficultyButton = document.getElementById("difficultyButton");
const partyCodeDiv = document.getElementById("partyCode");
const lsHardMode = localStorage.getItem("hardMode");
const lsAiMode = localStorage.getItem("aiMode");
const partyCodeInput = document.getElementById("partyCodeInput");
const joinPartyButton = document.getElementById("joinPartyButton");

const socketUrl = "https://szabfun-backend.onrender.com";
// const socketUrl = "http://localhost:3000";

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let aiMode = true;
let hardMode = false;
let socket;
let room;
let multiplayerMode = false;
let multiplayerSymbol;
let myTurn = false;

const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

async function loadFromDb(googleId) {
    const res = await fetch(
        `${socketUrl}/load/tic-tac-toe?google_id=${googleId}`
    );
    const json = await res.json();

    if (json.data) {
        const data = json.data;
        if (data.hard || data.ai) {
            hardMode = data.hard;
            aiMode = data.ai;
            // Set these back into game
            console.log("Loaded:", data);
        } else if (lsWins || lsHardMode) {
            //AIMODE
            if (lsAiMode == "true") {
                aiMode = true;
            } else {
                aiMode = false;
            }
            modeButton.textContent = aiMode
                ? "Switch to Player Mode"
                : "Switch to AI Mode";

            //HARDMODE
            if (lsHardMode == "true") {
                hardMode = true;
            } else {
                hardMode = false;
            }
        }
        applyURLParams();
        updateURL();
        createBoard();
    } else {
        console.log("No saved data yet!");
    }
}

function saveToDb(googleId, hard, ai) {
    fetch(`${socketUrl}/save/tic-tac-toe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            google_id: googleId,
            data: {
                hard,
                ai,
            },
        }),
    }).then((res) => console.log("Saved Tic Tac Toe progress!" + res));
}

function joinQueueWithCode(code) {
    aiMode = false;
    multiplayerMode = true;
    resetGame();

    socket = io(socketUrl, {
        path: "/tic-tac-toe/socket.io",
    });
    winnerElement.textContent = "Joining party...";

    socket.emit("joinRoom", code);

    socket.on("startGame", (data) => {
        partyCodeDiv.innerHTML = ``;
        multiplayerSymbol = data.symbol;
        room = data.room;
        myTurn = multiplayerSymbol === "X"; // <-- Always X starts!
        winnerElement.textContent = myTurn
            ? "Your turn!"
            : "Opponent's turn...";
        board = ["", "", "", "", "", "", "", "", ""];
        createBoard();
    });

    socket.on("updateBoard", (updatedBoard) => {
        board = updatedBoard;
        createBoard();

        // Count X and O
        const xCount = board.filter((cell) => cell === "X").length;
        const oCount = board.filter((cell) => cell === "O").length;

        if (multiplayerSymbol === "X") {
            myTurn = xCount === oCount; // X's turn if equal
        } else {
            myTurn = xCount > oCount; // O's turn if more X than O
        }

        winnerElement.textContent = myTurn
            ? "Your turn!"
            : "Opponent's turn...";
    });

    socket.on("gameOver", ({ winner }) => {
        gameActive = false;
        if (winner) {
            winnerElement.innerHTML = `<span class="${winner.toLowerCase()}"><strong>${winner}</strong></span> wins!`;
        } else {
            winnerElement.textContent = "It's a draw!";
        }
    });

    // ...other socket event handlers...
}

function generateRoomCode() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
}

function joinQueue() {
    aiMode = false;
    multiplayerMode = true;
    resetGame();

    if (!room) {
        room = generateRoomCode();
    }

    socket = io(socketUrl, {
        path: "/tic-tac-toe/socket.io",
    });
    winnerElement.textContent = "Waiting for opponent...";

    const shareUrl = `${window.location.origin}${
        window.location.pathname
    }?s=${encodeURIComponent(room)}`;
    partyCodeDiv.innerHTML = `
                <strong>Party Code:</strong> <span id="partyCodeValue">${room}</span>
                <button id="copyPartyCode">Copy Code</button>
                <br>
                <strong>Share Link:</strong> <a href="${shareUrl}" target="_blank">${shareUrl}</a>
                <button id="copyShareLink">Copy Link</button>
            `;
    document.getElementById("copyPartyCode").onclick = () => {
        navigator.clipboard.writeText(room);
    };
    document.getElementById("copyShareLink").onclick = () => {
        navigator.clipboard.writeText(shareUrl);
    };

    socket.on("waitingForOpponent", ({ room }) => {
        winnerElement.textContent = "Waiting for opponent to join...";
    });

    socket.on("startGame", (data) => {
        partyCodeDiv.innerHTML = ``;
        multiplayerSymbol = data.symbol;
        room = data.room;
        myTurn = multiplayerSymbol === "X"; // <-- Add this line!
        winnerElement.textContent = myTurn
            ? "Your turn!"
            : "Opponent's turn...";
        board = ["", "", "", "", "", "", "", "", ""];
        createBoard();
    });

    socket.on("updateBoard", (updatedBoard) => {
        board = updatedBoard;
        createBoard();

        // Count X and O
        const xCount = board.filter((cell) => cell === "X").length;
        const oCount = board.filter((cell) => cell === "O").length;

        if (multiplayerSymbol === "X") {
            myTurn = xCount === oCount; // X's turn if equal
        } else {
            myTurn = xCount > oCount; // O's turn if more X than O
        }

        winnerElement.textContent = myTurn
            ? "Your turn!"
            : "Opponent's turn...";
    });

    socket.on("gameOver", ({ winner }) => {
        gameActive = false;
        if (winner) {
            winnerElement.innerHTML = `<span class="${winner.toLowerCase()}"><strong>${winner}</strong></span> wins!`;
        } else {
            winnerElement.textContent = "It's a draw!";
        }
    });
}

function updateURL() {
    const params = new URLSearchParams();
    params.set("aiMode", aiMode);
    params.set("hardMode", hardMode);
    window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`
    );
}

function createBoard() {
    boardElement.innerHTML = "";
    board.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.dataset.index = index;
        cellElement.textContent = cell;
        if (cell === "X") cellElement.classList.add("taken", "x-cell");
        if (cell === "O") cellElement.classList.add("taken", "o-cell");
        cellElement.addEventListener("click", handleCellClick);
        boardElement.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    const cellIndex = event.target.dataset.index;

    if (board[cellIndex] !== "" || !gameActive) return;

    if (multiplayerMode) {
        if (!myTurn) return;
        board[cellIndex] = multiplayerSymbol;
        myTurn = false;
        winnerElement.textContent = "Opponent's turn...";
        socket.emit("move", { room, board });
        createBoard();

        // Check for winner after move
        if (checkWinner(multiplayerSymbol)) {
            winnerElement.innerHTML = `<span class="${multiplayerSymbol.toLowerCase()}"><strong>${multiplayerSymbol}</strong></span> wins!`;
            gameActive = false;
            socket.emit("gameOver", { room, winner: multiplayerSymbol });
            return;
        }
        // ...draw check if needed...
    } else {
        board[cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add(
            "taken",
            `${currentPlayer.toLowerCase()}-cell`
        );

        if (checkWinner()) {
            winnerElement.innerHTML = `<span class="${currentPlayer.toLowerCase()}"><strong>${currentPlayer}</strong></span> wins!`;
            gameActive = false;
            return;
        }

        if (board.every((cell) => cell !== "")) {
            winnerElement.textContent = "It's a draw!";
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === "X" ? "O" : "X";

        if (aiMode && currentPlayer === "O" && gameActive) {
            hardMode ? aiMoveHard() : aiMoveEasy();
        }
    }
}

function aiMoveEasy() {
    const emptyCells = board
        .map((cell, index) => (cell === "" ? index : null))
        .filter((index) => index !== null);
    const randomIndex =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
    let moveIndex = randomIndex;

    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] === "O" && board[b] === "O" && board[c] === "") {
            moveIndex = c;
        }
        if (board[a] === "O" && board[c] === "O" && board[b] === "") {
            moveIndex = b;
        }
        if (board[b] === "O" && board[c] === "O" && board[a] === "") {
            moveIndex = a;
        }
    }
    makeMove(moveIndex);
}

function aiMoveHard() {
    // Check if AI can win
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] === "O" && board[b] === "O" && board[c] === "") {
            return makeMove(c);
        }
        if (board[a] === "O" && board[c] === "O" && board[b] === "") {
            return makeMove(b);
        }
        if (board[b] === "O" && board[c] === "O" && board[a] === "") {
            return makeMove(a);
        }
    }

    // Block player's winning move
    for (let combo of winningCombinations) {
        const [a, b, c] = combo;
        if (board[a] === "X" && board[b] === "X" && board[c] === "") {
            return makeMove(c);
        }
        if (board[a] === "X" && board[c] === "X" && board[b] === "") {
            return makeMove(b);
        }
        if (board[b] === "X" && board[c] === "X" && board[a] === "") {
            return makeMove(a);
        }
    }

    // Take center if available
    if (board[4] === "") {
        return makeMove(4);
    }

    // Take a random empty corner if available
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter((index) => board[index] === "");
    if (emptyCorners.length > 0) {
        const randomCorner =
            emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
        return makeMove(randomCorner);
    }

    // Take a random empty cell
    aiMoveEasy();
}

function makeMove(index) {
    board[index] = "O";
    const cellElement = boardElement.children[index];
    cellElement.textContent = "O";
    cellElement.classList.add("taken");
    cellElement.classList.add(`${currentPlayer.toLowerCase()}-cell`);

    if (checkWinner()) {
        winnerElement.innerHTML = `<span class="${currentPlayer.toLowerCase()}"><strong>${currentPlayer}</strong></span> wins!`;
        gameActive = false;
        return;
    }

    if (board.every((cell) => cell !== "")) {
        winnerElement.textContent = "It's a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = "X";
}

function checkWinner(symbol = currentPlayer) {
    return winningCombinations.some((combination) => {
        return combination.every((index) => board[index] === symbol);
    });
}

function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    gameActive = true;
    winnerElement.textContent = "";
    createBoard();
    if (aiMode && currentPlayer === "O") {
        hardMode ? aiMoveHard() : aiMoveEasy();
    }
}

function toggleMode() {
    aiMode = !aiMode;
    localStorage.setItem("aiMode", String(aiMode));
    modeButton.textContent = aiMode
        ? "Switch to Player Mode"
        : "Switch to AI Mode";
    resetGame();
    saveToDb(localStorage.getItem("google_id"), hardMode, aiMode);
    updateURL();
}

function toggleDifficulty() {
    hardMode = !hardMode;
    localStorage.setItem("hardMode", String(hardMode));
    difficultyButton.textContent = hardMode
        ? "Switch to Easy Mode"
        : "Switch to Hard Mode";
    difficultyButton.style.backgroundColor = hardMode ? "red" : "green";
    difficultyButton.style.color = "#fff";
    difficultyButton.style.borderColor = "#000";
    resetGame();
    saveToDb(localStorage.getItem("google_id"), hardMode, aiMode);
    updateURL();
}

function localStorageGet() {
    if (localStorage.getItem("google_id")) {
        loadFromDb(localStorage.getItem("google_id"));
    } else {
        //AIMODE
        if (lsAiMode == "true") {
            aiMode = true;
        } else {
            aiMode = false;
        }
        modeButton.textContent = aiMode
            ? "Switch to Player Mode"
            : "Switch to AI Mode";

        //HARDMODE
        if (lsHardMode == "true") {
            hardMode = true;
        } else {
            hardMode = false;
        }

        applyURLParams();
        updateURL();
        createBoard();
    }
    difficultyButton.textContent = hardMode
        ? "Switch to Easy Mode"
        : "Switch to Hard Mode";
    difficultyButton.style.backgroundColor = hardMode ? "red" : "green";
    difficultyButton.style.color = "#fff";
    difficultyButton.style.borderColor = "#000";
}

function applyURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("aiMode")) {
        aiMode = params.get("aiMode");
        modeButton.value = aiMode;
    }
    if (params.has("hardMode")) {
        hardMode = params.get("hardMode");
        difficultyButton.value = hardMode;
    }
    if (params.has("s")) {
        const code = params.get("s");
        if (code) {
            joinQueueWithCode(code); // Only this, and only once!
        }
    }
}

function init() {
    resetGame();
    localStorageGet();
}

document.addEventListener("DOMContentLoaded", init);
