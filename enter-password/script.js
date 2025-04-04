let attempts = 0;

function checkPassword() {
    const input = document.getElementById("passwordInput");
    const message = document.getElementById("message");
    const container = document.getElementById("container");
    const gameContainer = document.getElementById("game-container");
    attempts++;

    if (attempts === 1 && input.value === "password") {
        message.classList.add("red");
        message.innerHTML = "Password is incorrect.";
    } else if (attempts === 2 && input.value === "incorrect") {
        message.classList.add("red");
        message.innerHTML = "Try again.";
    } else if (attempts === 3 && input.value === "again") {
        message.classList.add("red");
        message.innerHTML = "Please try again later.";
    } else if (attempts === 4 && input.value === "again later") {
        container.style.backgroundImage = "url('./assets/bruh.jpg')";
        container.style.backgroundSize = "cover";
        gameContainer.style.display = "none";
    } else {
        attempts--;
        message.innerHTML = "Meme game, just DO NOT use your BRAIN!";
    }

    input.value = "";
    input.focus();
}

document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        checkPassword();
    }
});