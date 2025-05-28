const boardElement = document.getElementById("board");
const winnerElement = document.getElementById("winner");
const modeButton = document.getElementById("modeButton");
const difficultyButton = document.getElementById("difficultyButton");
const lsHardMode = localStorage.getItem("hardMode")
const lsAiMode = localStorage.getItem("aiMode")

const apiUrl = "https://szb.pagekite.me/tic-tac-toe"; // Update this to your API URL if needed

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

function joinQueue() {
    aiMode = false;
    multiplayerMode = true;
    resetGame();

    socket = io("https://szb.pagekite.me", {
        path: "/tic-tac-toe/socket.io"
    });

    socket.on("startGame", (data) => {
        multiplayerSymbol = data.symbol;
        room = data.room;
        myTurn = (multiplayerSymbol === "X");
        winnerElement.textContent = myTurn ? "Your turn!" : "Opponent's turn...";
        board = ["", "", "", "", "", "", "", "", ""];
        createBoard();
    });

    socket.on("updateBoard", (updatedBoard) => {
        board = updatedBoard;
        createBoard();
        myTurn = true;
        winnerElement.textContent = "Your turn!";
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
    params.set('aiMode', aiMode);
    params.set('hardMode', hardMode);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
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
        if (checkWinner()) {
            winnerElement.innerHTML = `<span class="${multiplayerSymbol.toLowerCase()}"><strong>${multiplayerSymbol}</strong></span> wins!`;
            gameActive = false;
            // Send winner to server
            socket.emit("gameOver", { room, winner: multiplayerSymbol });
            return;
        }
    } else {
        board[cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add("taken", `${currentPlayer.toLowerCase()}-cell`);

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
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    let moveIndex = randomIndex

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

function checkWinner() {
    return winningCombinations.some((combination) => {
        return combination.every((index) => board[index] === currentPlayer);
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
        : "Switch to AI Mode"
    resetGame();
    updateURL();
}

function toggleDifficulty() {
    hardMode = !hardMode;
    localStorage.setItem("hardMode", String(hardMode))
    difficultyButton.textContent = hardMode
        ? "Switch to Easy Mode"
        : "Switch to Hard Mode";
    difficultyButton.style.backgroundColor = hardMode
        ? "red"
        : "green";
    difficultyButton.style.color = "#fff"
    difficultyButton.style.borderColor = "#000"
    resetGame();
    updateURL();
}

function localStorageGet() {
    //AIMODE
    if (lsAiMode == "true") {
        aiMode = true
    } else {
        aiMode = false
    }
    modeButton.textContent = aiMode
        ? "Switch to Player Mode"
        : "Switch to AI Mode"
    
    //HARDMODE
    if (lsHardMode == "true") {
        hardMode = true
    } else {
        hardMode = false
    }
    difficultyButton.textContent = hardMode
        ? "Switch to Easy Mode"
        : "Switch to Hard Mode";
    difficultyButton.style.backgroundColor = hardMode
        ? "red"
        : "green";
    difficultyButton.style.color = "#fff"
    difficultyButton.style.borderColor = "#000"
}

function applyURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('aiMode')) {
        aiMode = params.get('aiMode');
        modeButton.value = aiMode;
    }
    if (params.has('hardMode')) {
        hardMode = params.get('hardMode');
        difficultyButton.value = hardMode;
    }
}

function init() {
    localStorageGet();
    applyURLParams();
    updateURL();
    createBoard();
}

document.addEventListener("DOMContentLoaded", init())