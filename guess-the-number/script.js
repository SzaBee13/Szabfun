const userInput = document.getElementById("guess")
const scoreSpan = document.getElementById("score")
const lsScore = localStorage.getItem("gtn-score")
const secret = document.getElementById("secret")
const fullscreenDiv = document.getElementById('fullscreen-div');
let randomNumber;

function startGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    secret.innerHTML = randomNumber
    console.log("game started")
}

let score = 0

function checkGuess() {
    const userGuess = parseInt(userInput.value);
    const resultElement = document.getElementById("result");

    if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
        resultElement.innerText = "Please enter a valid number between 1 and 100.";
        return;
    }

    if (userGuess === randomNumber) {
        resultElement.innerText = "Congratulations! You guessed the number!";
        addScore()
    } else if (userGuess < randomNumber) {
        resultElement.innerText = "Too low! Try again.";
    } else {
        resultElement.innerText = "Too high! Try again.";
    }
}

function addScore() {
    score++;
    localStorage.setItem("gtn-score", String(score));
    scoreSpan.innerHTML = score
    console.log("score added")
}

function notShowFullScreen() {
    fullscreenDiv.style.display = 'none'; // Div megjelenítése
}

let lPressCount = 0;
let resetTimeout;

document.addEventListener('keydown', (event) => {
    if (event.key === 'l' || event.key === 'L') {
        lPressCount++;
        
        if (resetTimeout) {
            clearTimeout(resetTimeout);
        }


        if (lPressCount === 5) {
            fullscreenDiv.style.display = 'flex'; // Div megjelenítése
            lPressCount = 0;
        }


        resetTimeout = setTimeout(() => {
            lPressCount = 0;
        }, 2000);
    }
});

function init() {
    if (lsScore) {
        scoreSpan.innerHTML = lsScore
        score = parseInt(lsScore)
    } else {
        score = 0
        localStorage.setItem("gtn-score", "0")
    }
    console.log("init is runned")
    startGame()
}

init()