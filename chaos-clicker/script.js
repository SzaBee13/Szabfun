const cookieButton = document.getElementById("cookie");
const cookieSpan = document.getElementById("cookies");
const lsCookies = localStorage.getItem("cookies");
const lsUpgrades = localStorage.getItem("upgrades");
const lsLastTime = localStorage.getItem("lastTime");
const eventDiv = document.getElementById("event");
const eventAudio = new Audio("./assets/event.mp3");

const grandmaOwnedSpan = document.getElementById("grandma-wifi-owned");
const buyGrandmaBtn = document.getElementById("buy-grandma-wifi");

const macroOwnedSpan = document.getElementById("macro-owned");
const buyMacroBtn = document.getElementById("buy-macro");

const employeeOwnedSpan = document.getElementById("employee-owned");
const buyEmployeeBtn = document.getElementById("buy-employee");

const girlfriendOwnedSpan = document.getElementById("girlfriend-owned");
const buyGirlfriendBtn = document.getElementById("buy-girlfriend");

// const socketUrl = "http://localhost:3000";
const socketUrl = "https://szb.pagekite.me"

const socket = io(socketUrl, {
    path: "/chaos-clicker/socket.io",
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

let upgrades = {
    grandma: 0,
    macro: 0,
    employee: 0,
    girlfriend: 0
};

function saveUpgrades() {
    localStorage.setItem("upgrades", JSON.stringify(upgrades));
}

function loadUpgrades() {
    if (lsUpgrades) {
        upgrades = JSON.parse(lsUpgrades);
    }
    // Ensure both upgrades are always present and numbers
    upgrades.grandma = Number(upgrades.grandma) || 0;
    upgrades.macro = Number(upgrades.macro) || 0;
    upgrades.employee = Number(upgrades.employee) || 0;
    upgrades.girlfriend = Number(upgrades.employee) || 0;
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
    buyGrandmaBtn.innerText = `Buy (${getUpgradeCost("grandma")} cookies)`;
    buyGrandmaBtn.disabled = cookies < getUpgradeCost("grandma");

    macroOwnedSpan.innerText = upgrades.macro;
    buyMacroBtn.innerText = `Buy (${getUpgradeCost("macro")} cookies)`;
    buyMacroBtn.disabled = cookies < getUpgradeCost("macro");

    employeeOwnedSpan.innerText = upgrades.employee;
    buyEmployeeBtn.innerText = `Buy (${getUpgradeCost("employee")} cookies)`;
    buyEmployeeBtn.disabled = cookies < getUpgradeCost("employee");

    girlfriendOwnedSpan.innerText = upgrades.girlfriend;
    buyGirlfriendBtn.innerText = `Buy (${getUpgradeCost("girlfriend")} cookies)`;
    buyGirlfriendBtn.disabled = cookies < getUpgradeCost("girlfriend");
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
    }

    saveUpgrades();
    updateMultipliers();
}

function grantOfflineProgress() {
    if (lsLastTime) {
        const lastTime = parseInt(lsLastTime);
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

function init() {
    if (lsCookies) {
        cookies = parseInt(lsCookies);
        cookieSpan.innerText = cookies;
    }
    loadUpgrades();
    updateMultipliers();
    grantOfflineProgress();
    updateUpgradeUI();
}

init();

setInterval(function () {
    timeCookie(timeMultiplier);
}, 1000);

cookieButton.addEventListener("click", function () {
    if (lagActive) {
        removeCookie(clickMultiplier);
    } else {
        addCookie(clickMultiplier);
    }
});

buyGrandmaBtn.addEventListener("click", function () {
    const cost = getUpgradeCost("grandma");
    if (cookies >= cost) {
        removeCookie(cost);
        addUpgrade("grandma");
        updateUpgradeUI();
        animateBuy("grandma-wifi");
    }
});

buyMacroBtn.addEventListener("click", function () {
    const cost = getUpgradeCost("macro");
    if (cookies >= cost) {
        removeCookie(cost);
        addUpgrade("macro");
        updateUpgradeUI();
        animateBuy("macro");
    }
});

buyEmployeeBtn.addEventListener("click", function () {
    const cost = getUpgradeCost("employee");
    if (cookies >= cost) {
        removeCookie(cost);
        addUpgrade("employee");
        updateUpgradeUI();
        animateBuy("employee");
    }
});

buyGirlfriendBtn.addEventListener("click", function () {
    const cost = getUpgradeCost("girlfriend");
    if (cookies >= cost) {
        removeCookie(cost);
        addUpgrade("girlfriend");
        updateUpgradeUI();
        animateBuy("girlfriend");
    }
})

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

// Save last time on page unload
window.addEventListener("beforeunload", function () {
    localStorage.setItem("lastTime", Date.now());
});
