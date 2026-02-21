const cookieButton = document.getElementById("cookie");
const cookieSpan = document.getElementById("cookies");
const lsCookies = localStorage.getItem("cookies");
const lsUpgrades = localStorage.getItem("upgrades");
const lsLastTime = localStorage.getItem("lastTime");
const eventDiv = document.getElementById("event");
const eventAudio = new Audio("./assets/event.mp3");

const grandmaOwnedSpan = document.getElementById("grandma-owned");
const buyGrandmaBtn = document.getElementById("buy-grandma");

const macroOwnedSpan = document.getElementById("macro-owned");
const buyMacroBtn = document.getElementById("buy-macro");

const employeeOwnedSpan = document.getElementById("employee-owned");
const buyEmployeeBtn = document.getElementById("buy-employee");

const girlfriendOwnedSpan = document.getElementById("girlfriend-owned");
const buyGirlfriendBtn = document.getElementById("buy-girlfriend");

const putinOwnedSpan = document.getElementById("putin-owned");
const buyPutinBtn = document.getElementById("buy-putin");

const timeMachineSpan = document.getElementById("time-machine-owned");
const buyTimeMachineBtn = document.getElementById("buy-time-machine");

// const socketUrl = "http://localhost:3000";
const socketUrl = "https://api-fun.szabee.me";

const socket = io("https://olddell.wampus-enigmatic.ts.net", {
    path: "/szabfun/chaos-clicker/socket.io",
});
let lagActive = false;
let greatGrandmaTimeout = null;

let greatGrandmaActive = false;
let lagTimeout = null;

let shakingHandsActive = false;
let shakingHandsTimeout = null;
let shakeInterval = null;

let cookies = 0;
let timeMultiplier = 1;
let clickMultiplier = 1;

let lastTime;

let upgrades = {
    grandma: 0,
    macro: 0,
    employee: 0,
    girlfriend: 0,
    putin: 0,
    time_machine: 0,
};

async function loadFromDb(googleId) {
    const res = await fetch(
        `${socketUrl}/load/chaos-clicker?google_id=${googleId}`
    );
    const json = await res.json();

    if (json.data) {
        const data = json.data;
        if (data.cookies) {
            cookies = data.cookies;
            upgrades = data.upgrades;
            lastTime = data.lastTime;
            // Set these back into game
            console.log("Loaded:", data);
        } else {
            if (lsCookies) {
                cookies = parseInt(lsCookies);
                cookieSpan.innerText = cookies;
            }
            if (lsLastTime) {
                lastTime = lsLastTime;
                loadUpgrades();
            }
            saveToDb(localStorage.getItem("google_id"), cookies, upgrades, lastTime);
        }

        updateMultipliers();
        grantOfflineProgress();
        updateUpgradeUI();

    } else {
        console.log("No saved data yet!");
    }
}

function saveToDb(googleId, cookies, upgrades, lastTime) {
    fetch(`${socketUrl}/save/chaos-clicker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            google_id: googleId,
            data: {
                cookies,
                upgrades,
                lastTime,
            },
        }),
    }).then((res) => console.log("Saved Chaos Clicker progress!" + res));
}

function saveUpgrades() {
    localStorage.setItem("upgrades", JSON.stringify(upgrades));
    if (localStorage.getItem("google_id")) {
        saveToDb(
            localStorage.getItem("google_id"),
            cookies,
            upgrades,
            lastTime
        );
    }
}

function loadUpgrades() {
    if (lsUpgrades) {
        upgrades = JSON.parse(lsUpgrades);
    }
    // Ensure both upgrades are always present and numbers
    upgrades.grandma = Number(upgrades.grandma) || 0;
    upgrades.macro = Number(upgrades.macro) || 0;
    upgrades.employee = Number(upgrades.employee) || 0;
    upgrades.girlfriend = Number(upgrades.girlfriend) || 0;
    upgrades.putin = Number(upgrades.putin) || 0;
    upgrades.time_machine = Number(upgrades.time_machine) || 0;
}

async function loadChaosClicker(googleId) {
    const res = await fetch(
        `http://localhost:3000/load/chaos-clicker?google_id=${googleId}`
    );
    const json = await res.json();

    if (json.data) {
        const { cookies, upgrades } = json.data;
        // Set these back into game
        console.log("Loaded:", cookies, upgrades);
    } else {
        console.log("No saved data yet!");
    }
}

// Patch multiplier logic for great-grandma event
function updateMultipliers() {
    if (upgrades.grandma != 0) {
        timeMultiplier += 2 * upgrades.grandma;
    }

    if (upgrades.macro != 0) {
        clickMultiplier += upgrades.macro;
    }

    if (upgrades.employee != 0) {
        timeMultiplier = 10 * upgrades.employee;
    }

    if (upgrades.girlfriend != 0) {
        clickMultiplier += 25 * upgrades.girlfriend;
        timeMultiplier += 25 * upgrades.girlfriend;
    }

    if (upgrades.putin != 0) {
        clickMultiplier += 100 * upgrades.putin;
    }

    if (upgrades.time_machine != 0) {
        timeMultiplier += 150 * upgrades.time_machine;
    }

    if (greatGrandmaActive) {
        timeMultiplier *= 2;
    }
    // Mouse Macro: clickMultiplier = 1 + macro count
    clickMultiplier = 1 + upgrades.macro;
    if (shakingHandsActive) {
        clickMultiplier *= 0.5;
    }
}

function updateUpgradeUI() {
    grandmaOwnedSpan.innerText = upgrades.grandma;
    buyGrandmaBtn.innerText = `Buy (${getUpgradeCost("grandma")} chaoses)`;
    buyGrandmaBtn.disabled = cookies < getUpgradeCost("grandma");

    macroOwnedSpan.innerText = upgrades.macro;
    buyMacroBtn.innerText = `Buy (${getUpgradeCost("macro")} chaoses)`;
    buyMacroBtn.disabled = cookies < getUpgradeCost("macro");

    employeeOwnedSpan.innerText = upgrades.employee;
    buyEmployeeBtn.innerText = `Buy (${getUpgradeCost("employee")} chaoses)`;
    buyEmployeeBtn.disabled = cookies < getUpgradeCost("employee");

    girlfriendOwnedSpan.innerText = upgrades.girlfriend;
    buyGirlfriendBtn.innerText = `Buy (${getUpgradeCost(
        "girlfriend"
    )} chaoses)`;
    buyGirlfriendBtn.disabled = cookies < getUpgradeCost("girlfriend");

    putinOwnedSpan.innerText = upgrades.putin;
    buyPutinBtn.innerText = `Buy (${getUpgradeCost("putin")} chaoses)`;
    buyPutinBtn.disabled = cookies < getUpgradeCost("putin");

    timeMachineSpan.innerText = upgrades.time_machine;
    buyTimeMachineBtn.innerText = `Buy ${getUpgradeCost(
        "time-machine"
    )} chaoses`;
    buyTimeMachineBtn.disabled = cookies < getUpgradeCost("time-machine");
}

function getUpgradeCost(item) {
    if (item == "grandma") {
        return 100 + (upgrades.grandma || 0) * 50;
    }
    if (item == "macro") {
        return 50 + (upgrades.macro || 0) * 25;
    }
    if (item == "employee") {
        return 500 + (upgrades.employee || 0) * 250;
    }
    if (item == "girlfriend") {
        return 2500 + (upgrades.girlfriend || 0) * 1250;
    }
    if (item == "putin") {
        return 10000 + (upgrades.putin || 0) * 5000;
    }
    if (item == "time-machine") {
        return 25000 + (upgrades.time_machine || 0) * 12500;
    }
    return 0;
}

// Update UI after cookies change
function setCookies(val) {
    cookies = val;
    cookieSpan.innerText = cookies;
    localStorage.setItem("cookies", cookies);
    updateUpgradeUI();
}

// Patch addCookie/removeCookie/timeCookie to use setCookies
function addCookie(multiplier) {
    setCookies(cookies + 1 * multiplier);
    localStorage.setItem("lastTime", Date.now());
}

function removeCookie(amount) {
    setCookies(cookies - amount);
    localStorage.setItem("lastTime", Date.now());
}

function timeCookie(multiplier) {
    if (!lagActive) {
        setCookies(cookies + 1 * multiplier);
    }
    localStorage.setItem("lastTime", Date.now());
}

function addUpgrade(upgrade) {
    if (upgrade == "grandma") {
        upgrades.grandma += 1;
    } else if (upgrade == "macro") {
        upgrades.macro += 1;
    } else if (upgrade == "employee") {
        upgrades.employee += 1;
    } else if (upgrade == "girlfriend") {
        upgrades.girlfriend += 1;
    } else if (upgrade == "putin") {
        upgrades.putin += 1;
    } else if (upgrade == "time-machine") {
        upgrades.time_machine += 1;
    }

    saveUpgrades();
    updateMultipliers();
}

function grantOfflineProgress() {
    if (lastTime) {
        const now = Date.now();
        const secondsPassed = Math.floor((now - lastTime) / 1000);
        if (secondsPassed > 0) {
            const offlineCookies = secondsPassed * timeMultiplier;
            cookies += offlineCookies;
            cookieSpan.innerText = cookies;
            localStorage.setItem("cookies", cookies);
        }
    }
    localStorage.setItem("lastTime", Date.now());
    saveToDb(
        localStorage.getItem("google_id"),
        cookies,
        upgrades,
        lastTime
    );
}

// Show notification
function showEventNotification(title, desc, durationMs = 8000) {
    let remaining = Math.ceil(durationMs / 1000);
    eventDiv.innerHTML = `<strong>${title}</strong><br>${desc}<br><span id="event-timer">${remaining}</span>s`;
    eventDiv.style.display = "block";
    const timerSpan = document.getElementById("event-timer");
    const interval = setInterval(() => {
        remaining--;
        if (timerSpan) timerSpan.innerText = remaining;
        if (remaining <= 0) {
            clearInterval(interval);
            eventDiv.style.display = "none";
        }
    }, 1000);
}

function shakeScreen(duration = 600) {
    const intensity = 3.5; // reduced max px for less intense shake
    let start = null;
    function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        if (elapsed < duration) {
            // Random X and Y between -intensity and +intensity (float)
            const x = (Math.random() - 0.5) * 2 * intensity;
            const y = (Math.random() - 0.5) * 2 * intensity;
            document.body.style.transform = `translate(${x.toFixed(
                2
            )}px, ${y.toFixed(2)}px)`;
            requestAnimationFrame(step);
        } else {
            document.body.style.transform = "";
        }
    }
    requestAnimationFrame(step);
}

function animateBuy(cardId) {
    const card = document.getElementById(cardId);
    if (!card) return;
    card.classList.remove("buy-animate"); // reset if already animating
    // Force reflow to restart animation
    void card.offsetWidth;
    card.classList.add("buy-animate");
}

function buyUpgrade(upgrade) {
    const cost = getUpgradeCost(upgrade);
    if (cookies >= cost) {
        removeCookie(cost);
        addUpgrade(upgrade);
        updateUpgradeUI();
        animateBuy(upgrade);
    }
}

function init() {
    if (localStorage.getItem("google_id")) {
        loadFromDb(localStorage.getItem("google_id"));
    } else {
        if (lsCookies) {
            cookies = parseInt(lsCookies);
            cookieSpan.innerText = cookies;
        }
        if (lsLastTime) {
            lastTime = lsLastTime;
            loadUpgrades();
            updateMultipliers();
            grantOfflineProgress();
            updateUpgradeUI();
        }
    }
}

init();

setInterval(function () {
    timeCookie(timeMultiplier);
}, 1000);

document.getElementById("back-button").addEventListener("click", () => {
    saveToDb(
        localStorage.getItem("google_id"),
        cookies,
        upgrades,
        lastTime
    );
    window.location.href = "../index.html";
});

cookieButton.addEventListener("click", function () {
    if (lagActive) {
        removeCookie(clickMultiplier);
    } else {
        addCookie(clickMultiplier);
    }
});

buyGrandmaBtn.addEventListener("click", function () {
    buyUpgrade("grandma");
});

buyMacroBtn.addEventListener("click", function () {
    buyUpgrade("macro");
});

buyEmployeeBtn.addEventListener("click", function () {
    buyUpgrade("employee");
});

buyGirlfriendBtn.addEventListener("click", function () {
    buyUpgrade("girlfriend");
});

buyPutinBtn.addEventListener("click", function () {
    buyUpgrade("putin");
});

buyTimeMachineBtn.addEventListener("click", function () {
    buyUpgrade("time-machine");
});

socket.on("chaos-event", (event) => {
    eventAudio.currentTime = 0;
    eventAudio.play();

    if (event.type === "lag") {
        showEventNotification(event.name, event.description, 30000);
        lagActive = true;
        if (lagTimeout) clearTimeout(lagTimeout);
        lagTimeout = setTimeout(() => {
            lagActive = false;
        }, 30000); // 30 seconds
    }
    if (event.type === "great-grandma") {
        showEventNotification(event.name, event.description, 60000);
        greatGrandmaActive = true;
        updateMultipliers();
        if (greatGrandmaTimeout) clearTimeout(greatGrandmaTimeout);
        greatGrandmaTimeout = setTimeout(() => {
            greatGrandmaActive = false;
            updateMultipliers();
        }, 60000); // 60 seconds
    }
    if (event.type === "shaking-hands") {
        showEventNotification(event.name, event.description, 60000);
        shakingHandsActive = true;
        updateMultipliers();

        // Start shaking less frequently
        shakeScreen();
        if (shakeInterval) clearInterval(shakeInterval);
        shakeInterval = setInterval(() => {
            if (shakingHandsActive) shakeScreen();
        }, 3500); // shake every 3.5 seconds

        if (shakingHandsTimeout) clearTimeout(shakingHandsTimeout);
        shakingHandsTimeout = setTimeout(() => {
            shakingHandsActive = false;
            updateMultipliers();
            if (shakeInterval) {
                clearInterval(shakeInterval);
                shakeInterval = null;
            }
        }, 60000); // 60 seconds
    }
});
