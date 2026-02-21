let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

const targetTimeInput = document.getElementById("targetTime");
const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resultDiv = document.getElementById("result");
const resultTarget = document.getElementById("resultTarget");
const resultTime = document.getElementById("resultTime");
const resultAccuracy = document.getElementById("resultAccuracy");
const gamesPlayedSpan = document.getElementById("gamesPlayed");
const bestAccuracySpan = document.getElementById("bestAccuracy");
const avgAccuracySpan = document.getElementById("avgAccuracy");

const socketUrl = "https://api-fun.szabee.me/szabfun";

function loadStats() {
  const stats = JSON.parse(
    localStorage.getItem("timerStats") ||
      '{"games": 0, "bestAccuracy": null, "totalAccuracy": 0}'
  );
  return stats;
}

async function loadFromDb(googleId) {
  try {
    const res = await fetch(
      `${socketUrl}/timer-challenge/load/timer-challenge?google_id=${googleId}`
    );
    const json = await res.json();

    if (json.data) {
      const data = json.data;
      localStorage.setItem("timerStats", JSON.stringify(data));
      console.log("Loaded from DB:", data);
    } else {
      const stats = loadStats();
      saveToDb(googleId, stats);
    }
    updateStatsDisplay();
  } catch (error) {
    console.error("Error loading from DB:", error);
  }
}

function saveToDb(googleId, stats) {
  if (!googleId) return;
  
  fetch(`${socketUrl}/timer-challenge/save/timer-challenge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      google_id: googleId,
      data: stats,
    }),
  }).then((res) => console.log("Saved Timer Challenge progress!"));
}

function saveStats(accuracy) {
  const stats = loadStats();
  stats.games += 1;
  stats.totalAccuracy += accuracy;

  if (stats.bestAccuracy === null || accuracy > stats.bestAccuracy) {
    stats.bestAccuracy = accuracy;
  }

  localStorage.setItem("timerStats", JSON.stringify(stats));
  
  if (localStorage.getItem("google_id")) {
    saveToDb(localStorage.getItem("google_id"), stats);
  }
  
  updateStatsDisplay();
}

function updateStatsDisplay() {
  const stats = loadStats();
  gamesPlayedSpan.textContent = stats.games;
  bestAccuracySpan.textContent =
    stats.bestAccuracy !== null ? stats.bestAccuracy.toFixed(2) + "%" : "-";
  avgAccuracySpan.textContent =
    stats.games > 0
      ? (stats.totalAccuracy / stats.games).toFixed(2) + "%"
      : "-";
}

function updateDisplay() {
  const seconds = (elapsedTime / 1000).toFixed(2);
  timerDisplay.textContent = seconds;
}

function startTimer() {
  if (isRunning) return;

  isRunning = true;
  startTime = Date.now();
  elapsedTime = 0;
  resultDiv.classList.remove("show");

  startBtn.disabled = true;
  stopBtn.disabled = false;
  targetTimeInput.disabled = true;

  timer = setInterval(() => {
    elapsedTime = Date.now() - startTime;
    updateDisplay();
  }, 10);
}

function stopTimer() {
  if (!isRunning) return;

  clearInterval(timer);
  isRunning = false;

  const targetTime = parseFloat(targetTimeInput.value);
  const actualTime = elapsedTime / 1000;
  const difference = Math.abs(targetTime - actualTime);
  const accuracy = Math.max(0, 100 - (difference / targetTime) * 100);

  resultTarget.textContent = targetTime;
  resultTime.textContent = actualTime.toFixed(2);
  resultAccuracy.textContent = accuracy.toFixed(2) + "%";
  resultDiv.classList.add("show");

  saveStats(accuracy);

  startBtn.disabled = false;
  stopBtn.disabled = true;
  targetTimeInput.disabled = false;
}

function init() {
  if (localStorage.getItem("google_id")) {
    loadFromDb(localStorage.getItem("google_id"));
  } else {
    updateStatsDisplay();
  }
}

startBtn.addEventListener("click", startTimer);
stopBtn.addEventListener("click", stopTimer);

init();