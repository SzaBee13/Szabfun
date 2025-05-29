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

function updateURL() {
    const params = new URLSearchParams();
    params.set('min', minNum);
    params.set('max', maxNum);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    startGame() // Update the secret number
}

function startGame() {
    randomNumber = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    secret.innerHTML = randomNumber
    document.getElementById('result').innerText = 'Make a guess!';
    document.getElementById('guess').value = '';
    console.log("game started")
}

function checkGuess() {
    const userGuess = parseInt(document.getElementById('guess').value);
    const resultElement = document.getElementById("result");

    if (isNaN(userGuess) || userGuess < minNum || userGuess > maxNum) {
        resultElement.innerText = `Please enter a valid number between ${minNum} and ${maxNum}.`;
    } else if (userGuess === randomNumber) {
        resultElement.innerText = "Congratulations! You guessed the number! - Number was: " + randomNumber;
        addScore();
        startGame(); // Restart the game after a correct guess
    } else if (userGuess < randomNumber) {
        resultElement.innerText = "Too low! Try again.";
    } else {
        resultElement.innerText = "Too high! Try again.";
    }
}

function addScore() {
    score++;
    localStorage.setItem("gtn-score", String(score));
    document.getElementById('score').innerHTML = score;
    console.log("score added");
}

function updateMinMax(type) {
    if (type === 'min') {
        minNum = parseInt(document.getElementById('min').value);
    } else if (type === 'max') {
        maxNum = parseInt(document.getElementById('max').value);
    }
    updateURL();
    startGame();
}

function notShowFullScreen() {
    fullscreenDiv.style.display = 'none'; // Div megjelenítése
}

function applyURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('max')) {
        maxNum = parseInt(params.get('max'));
        maxNumSpan.value = maxNum;
    }
    if (params.has('min')) {
        minNum = parseInt(params.get('min'));
        minNumSpan.value = minNum;
    }
}

function init() {
    if (lsScore) {
        document.getElementById('score').innerHTML = lsScore;
        score = parseInt(lsScore);
    } else {
        score = 0;
        localStorage.setItem("gtn-score", "0");
    }

    if (lsMax) {
        maxNum = parseInt(lsMax);
        maxNumSpan.value = maxNum;
    } else {
        maxNum = 100;
        localStorage.setItem("gtn-max", String(maxNum));
        maxNumSpan.value = maxNum;
    }

    if (lsMin) {
        minNum = parseInt(lsMin);
        minNumSpan.value = minNum;
    } else {
        minNum = 1;
        localStorage.setItem("gtn-min", String(minNum));
        minNumSpan.value = minNum;
    }

    applyURLParams();
    updateURL();
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

userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        checkGuess();
    }
});

window.onload = init()

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && fullscreenDiv.style.display === 'flex') {
        notShowFullScreen();
    }
});

fullscreenDiv.addEventListener('click', (event) => {
    if (event.target === fullscreenDiv) {
        notShowFullScreen();
    }
});