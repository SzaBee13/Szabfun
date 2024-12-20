const userInput = document.getElementById("guess")
const scoreSpan = document.getElementById("score")
const secret = document.getElementById("secret")
const fullscreenDiv = document.getElementById('fullscreen-div');
const minNumSpan = document.getElementById("min")
const maxNumSpan = document.getElementById("max")

const lsScore = localStorage.getItem("gtn-score")
const lsMin = localStorage.getItem("gtn-min")
const lsMax = localStorage.getItem("gtn-max")

let randomNumber;
let lPressCount = 0;
let resetTimeout;
let score = 0;
let minNum = 1;
let maxNum = 100;

function startGame() {
    randomNumber = Math.floor(Math.random() * maxNum) + minNum;
    secret.innerHTML = randomNumber
    console.log("game started")
}

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

function updateMinMax(sel) {
    if (sel == 'min') {
        const value = minNumSpan.value
        minNum = parseInt(value)
        localStorage.setItem("gtn-min", String(value))
    } else if (sel == 'max') {
        const value = maxNumSpan.value
        maxNum = parseInt(value)
        localStorage.setItem("gtn-max", String(value))
    }
}

function notShowFullScreen() {
    fullscreenDiv.style.display = 'none'; // Div megjelenítése
}

function init() {
    if (lsScore) {
        scoreSpan.innerHTML = lsScore;
        score = parseInt(lsScore);
    } else {
        score = 0;
        localStorage.setItem("gtn-score", "0");
    }

    if (lsMax) {
        maxNumSpan.value = parseInt(lsMax);
        maxNum = parseInt(lsMax);
    } else {
        maxNum = 100;
        localStorage.setItem("gtn-max", String(maxNum));
        maxNumSpan.innerHTML = String(maxNum);
    }

    if (lsMin) {
        minNumSpan.value = parseInt(lsMin);
        minNum = parseInt(lsMin);
    } else {
        minNum = 1;
        localStorage.setItem("gtn-min", String(minNum));
        minNumSpan.innerHTML = String(minNum)
    }

    startGame();
}

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

init()