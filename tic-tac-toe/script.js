const boardElement = document.getElementById("board");
const winnerElement = document.getElementById("winner");
const modeButton = document.getElementById("modeButton");
const difficultyButton = document.getElementById("difficultyButton");

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let aiMode = true;
let hardMode = false;

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

function createBoard() {
    boardElement.innerHTML = "";
    board.forEach((cell, index) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");
        cellElement.dataset.index = index;
        cellElement.textContent = cell;
        cellElement.addEventListener("click", handleCellClick);
        boardElement.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    const cellIndex = event.target.dataset.index;

    if (board[cellIndex] !== "" || !gameActive) {
        return;
    }

    board[cellIndex] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add("taken");

    if (checkWinner()) {
        winnerElement.textContent = `${currentPlayer} wins!`;
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

    if (checkWinner()) {
        winnerElement.textContent = `O wins!`;
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
    modeButton.textContent = aiMode
        ? "Switch to Player Mode"
        : "Switch to AI Mode";
    resetGame();
}

function toggleDifficulty() {
    hardMode = !hardMode;
    difficultyButton.textContent = hardMode
        ? "Switch to Easy Mode"
        : "Switch to Hard Mode";
    difficultyButton.style.backgroundColor = hardMode
        ? "red"
        : "green";
    difficultyButton.style.color = "#fff"
    difficultyButton.style.borderColor = "#000"
    resetGame();
}

createBoard();
difficultyButton.textContent = hardMode
    ? "Switch to Easy Mode"
    : "Switch to Hard Mode";
difficultyButton.style.backgroundColor = hardMode
    ? "red"
    : "green";
difficultyButton.style.color = "#fff"
difficultyButton.style.borderColor = "#000"