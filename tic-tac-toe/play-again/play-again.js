const socket = io('https://szabfun.vercel.app'); // Cseréld le a saját szerver URL-edre
const boardElement = document.getElementById('board');
const winnerElement = document.getElementById('winner');
const currentPlayerElement = document.getElementById('currentPlayer');
let board = Array(9).fill('');
let currentPlayer = 'X';
let gameActive = true;
let gameId;

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

    if (gameId) {
        socket.emit('makeMove', { gameId, index: cellIndex });
    } else {
        board[cellIndex] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add("taken");
        event.target.classList.add(`${currentPlayer.toLowerCase()}-cell`);

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
        currentPlayerElement.textContent = `Current Player: ${currentPlayer}`;
    }
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    return winningCombinations.some((combination) => {
        return combination.every((index) => board[index] === currentPlayer);
    });
}

function resetGame() {
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameActive = true;
    winnerElement.textContent = "";
    createBoard();
    currentPlayerElement.textContent = `Current Player: ${currentPlayer}`;
}

function createGame() {
    gameId = Math.floor(100000 + Math.random() * 900000).toString();
    socket.emit('createGame', gameId);
}

function joinGame() {
    gameId = document.getElementById('gameId').value;
    socket.emit('joinGame', gameId);
}

socket.on('gameCreated', (id) => {
    gameId = id;
    alert(`Game created with ID: ${gameId}`);
});

socket.on('gameJoined', (id) => {
    gameId = id;
    alert(`Joined game with ID: ${gameId}`);
    resetGame();
});

socket.on('moveMade', ({ board: newBoard, currentPlayer: newCurrentPlayer }) => {
    board = newBoard;
    currentPlayer = newCurrentPlayer;
    createBoard();
    currentPlayerElement.textContent = `Current Player: ${currentPlayer}`;
});

socket.on('gameEnded', (message) => {
    alert(message);
    resetGame();
});

document.addEventListener("DOMContentLoaded", () => {
    createBoard();
    currentPlayerElement.textContent = `Current Player: ${currentPlayer}`;
});