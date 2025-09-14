const chat = document.getElementById("messages");
const input = document.getElementById("input");
const fullScreenDiv = document.getElementById("fullscreen");
const nicknameInput = document.getElementById("nickname");
const usernameInput = document.getElementById("username");
const answerDiv = document.getElementById("anwser");
const lsUsername = localStorage.getItem("username");
const lsNickname = localStorage.getItem("nickname");
const lsRecentMessages = localStorage.getItem("recentMessages");

const apiUrl = "https://inf-programmers-paris-tigers.trycloudflare.com"

// const socket = new WebSocket("http://192.168.126.1:3100");
const socket = new WebSocket("https://chat-szabfun.onrender.com");

let username;
let nickname;

let recentMessages = {
    // format: {
    //     "username": { messages: [], lastActive: Date.now() }
    // }
};

socket.onmessage = event => {
    const data = JSON.parse(event.data);
    console.log(`new: ${data.username} ${data.text}`)

    if (data.type === "message") {
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("message");

        // Update recent messages for the user
        if (!recentMessages[data.username]) {
            recentMessages[data.username] = { messages: [], lastActive: Date.now() };
        } 

        recentMessages[data.username].messages.push(data.text);
        recentMessages[data.username].lastActive = Date.now();
        localStorage.setItem("recentMessages", JSON.stringify(recentMessages));
        console.log(recentMessages);

        const authorSpan = document.createElement("span");
        authorSpan.classList.add("author");
        authorSpan.innerHTML = `<a href="./user.html?username=${data.username}&nickname=${data.nickname}">${data.nickname}</a>: `; // Only display the nickname

        const textSpan = document.createElement("span");
        textSpan.textContent = data.text;
        textSpan.classList.add("messageContent");

        messageDiv.appendChild(authorSpan);
        messageDiv.appendChild(textSpan);
        chat.appendChild(messageDiv);
    }
    if (data.type === "onlineCount") {
        document.getElementById("online").innerHTML = data.count;

    }
    if (data.type === "register") {
        if (data.success) {
            localStorage.setItem("username", username);
            localStorage.setItem("nickname", nickname);
            saveToDb(username, nickname, localStorage.getItem("google_id"));
            fullScreenDiv.style.display = "none";
        } else {
            answerDiv.textContent = data.message;
        }
    }
};

const sendMessage = () => {
    const message = input.value;
    if (!message) return;

    socket.send(JSON.stringify({ type: "message", username, nickname, text: message }));
    input.value = "";
};

const registerUser = () => {
    username = usernameInput.value;
    nickname = nicknameInput.value;

    const usernamePattern = /^[a-z0-9_-]+$/;

    if (!username) {
        answerDiv.textContent = "Username cannot be empty";
        return;
    }

    if (!usernamePattern.test(username)) {
        answerDiv.textContent = "Username can only contain lowercase letters, numbers, '-', and '_'";
        return;
    }

    socket.send(JSON.stringify({ type: "register", username, nickname }));
};

input.addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && event.shiftKey) {
        console.log('Shift + Enter pressed');
    } else if (event.key === 'Enter') {
        sendMessage();
    }
});

usernameInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        registerUser();
    }
});

async function loadFromDb(googleId) {
    const res = await fetch(`${apiUrl}/load/chat?google_id=${googleId}`);
    const json = await res.json();
    
    if (json.data) {
        const data = json.data;
        if (data.username) {
            username = data.username;
            nickname = data.nickname;
            fullScreenDiv.style.display = "none";
            // Set these back into game
            console.log("Loaded:", data);
        } else if (lsUsername) {
            username = lsUsername;
            nickname = lsNickname;
            fullScreenDiv.style.display = "none";
        } else {
            fullScreenDiv.style.display = "flex";
        }
    } else {
        console.log("No saved data yet!");
    }
}


function saveToDb(username, nickname, googleId) {
    fetch(`${apiUrl}/save/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            google_id: googleId,
            data: {
                username,
                nickname
            }
        })
    }).then(res => console.log("Saved Chat progress!" + res));
}

const init = () => {
    if (localStorage.getItem("google_id")) {
        loadFromDb(localStorage.getItem("google_id"))
    } else if (lsUsername) {
        fullScreenDiv.style.display = "none";
        username = lsUsername;
        nickname = lsNickname;
    } else {
        fullScreenDiv.style.display = "flex";
    }

    if (lsRecentMessages) {
        recentMessages = JSON.parse(lsRecentMessages);
        console.log("Recent messages loaded:", recentMessages);
    }
};

init();