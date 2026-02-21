const userInput = document.getElementById("guess");
const scoreSpan = document.getElementById("score");
const secret = document.getElementById("secret");
const fullscreenDiv = document.getElementById("fullscreen-div");
const minNumSpan = document.getElementById("min");
const maxNumSpan = document.getElementById("max");

const lsScore = localStorage.getItem("gtn-score");
const lsMin = localStorage.getItem("gtn-min");
const lsMax = localStorage.getItem("gtn-max");

const apiUrl = "https://api-fun.szabee.me";

let randomNumber;
let lPressCount = 0;
let resetTimeout;
let score = 0;
let minNum = 1;
let maxNum = 100;

function updateURL() {
    const params = new URLSearchParams();
    params.set("min", minNum);
    params.set("max", maxNum);
    window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${params.toString()}`
    );
    startGame(); // Update the secret number
}

function startGame() {
    randomNumber = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    secret.innerHTML = randomNumber;
    document.getElementById("result").innerText = "Make a guess!";
    document.getElementById("guess").value = "";
    console.log("game started");
}

function checkGuess() {
    const userGuess = parseInt(document.getElementById("guess").value);
    const resultElement = document.getElementById("result");

    if (isNaN(userGuess) || userGuess < minNum || userGuess > maxNum) {
        resultElement.innerText = `Please enter a valid number between ${minNum} and ${maxNum}.`;
    } else if (userGuess === randomNumber) {
        resultElement.innerText =
            "Congratulations! You guessed the number! - Number was: " +
            randomNumber;
        addScore();
        startGame(); // Restart the game after a correct guess
    } else if (userGuess < randomNumber) {
        resultElement.innerText = "Too low! Try again.";
    } else {
        resultElement.innerText = "Too high! Try again.";
    }
}

async function loadFromDb(googleId) {
    const res = await fetch(
        `${apiUrl}/load/guess-the-number?google_id=${googleId}`
    );
    const json = await res.json();

    if (json.data) {
        const data = json.data;
        if (data.score || data.min || data.max) {
            score = data.score;
            minNum = parseInt(data.min);
            maxNum = parseInt(data.max);
            // Set these back into game
            console.log("Loaded:", data);
        } else {
            if (lsScore) {
                document.getElementById("score").innerHTML = lsScore;
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
        }
        minNumSpan.value = minNum;
        maxNumSpan.value = maxNum;
        scoreSpan.innerText = lsScore;
    } else {
        console.log("No saved data yet!");
    }
}

function saveToDb(googleId, score, min, max) {
    fetch(`${apiUrl}/save/guess-the-number`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            google_id: googleId,
            data: {
                score,
                min,
                max,
            },
        }),
    }).then((res) => console.log("Saved Guess The Number progress!" + res));
}

function addScore() {
    score++;
    localStorage.setItem("gtn-score", String(score));
    document.getElementById("score").innerHTML = score;
    console.log("score added");
    saveToDb(localStorage.getItem("google_id"), score, minNum, maxNum);
}

function updateMinMax(type) {
    if (type === "min") {
        minNum = parseInt(document.getElementById("min").value);
        localStorage.setItem("gtn-min", minNum);
    } else if (type === "max") {
        maxNum = parseInt(document.getElementById("max").value);
        localStorage.setItem("gtn-max", maxNum);
    }
    updateURL();
    saveToDb(localStorage.getItem("google_id"), score, minNum, maxNum);
    startGame();
}

function notShowFullScreen() {
    fullscreenDiv.style.display = "none"; // Div megjelenítése
}

function applyURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has("max")) {
        maxNum = parseInt(params.get("max"));
        maxNumSpan.value = maxNum;
    }
    if (params.has("min")) {
        minNum = parseInt(params.get("min"));
        minNumSpan.value = minNum;
    }
}

function init() {
    if (localStorage.getItem("google_id")) {
        loadFromDb(localStorage.getItem("google_id"));
    } else {
        if (lsScore) {
            document.getElementById("score").innerHTML = lsScore;
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
    }

    startGame();
}

document.addEventListener("keydown", (event) => {
    if (event.key === "l" || event.key === "L") {
        lPressCount++;

        if (resetTimeout) {
            clearTimeout(resetTimeout);
        }

        if (lPressCount === 5) {
            fullscreenDiv.style.display = "flex";
            lPressCount = 0;
        }

        resetTimeout = setTimeout(() => {
            lPressCount = 0;
        }, 2000);
    }
});

userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        checkGuess();
    }
});

window.onload = init();

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && fullscreenDiv.style.display === "flex") {
        notShowFullScreen();
    }
});

fullscreenDiv.addEventListener("click", (event) => {
    if (event.target === fullscreenDiv) {
        notShowFullScreen();
    }
});
