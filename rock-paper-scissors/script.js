(() => {
  const canvas = document.getElementById('c');
  const ctx = canvas.getContext('2d', { alpha: false });
  const W = canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
  const H = canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
  canvas.style.width = canvas.clientWidth + 'px';
  canvas.style.height = canvas.clientHeight + 'px';
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

  // UI elements
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const resetBtn = document.getElementById('resetBtn');
  const speedRange = document.getElementById('speedRange');
  const statTime = document.getElementById('statTime');
  const statColl = document.getElementById('statColl');
  const statFps = document.getElementById('statFps');
  const infoTime = document.getElementById('infoTime');
  const infoCollisions = document.getElementById('infoCollisions');
  const countRock = document.getElementById('countRock');
  const countPaper = document.getElementById('countPaper');
  const countScissors = document.getElementById('countScissors');
  const beadCount = document.getElementById('beadCount');
  const inputR = document.getElementById('inputR');
  const inputP = document.getElementById('inputP');
  const inputS = document.getElementById('inputS');
  const elasticCheckbox = document.getElementById('elastic');
  const showVelCheckbox = document.getElementById('showVel');

  // --- LocalStorage helpers ---
  function saveSettings() {
    localStorage.setItem('rps_speed', speedRange.value);
    localStorage.setItem('rps_elastic', elasticCheckbox.checked ? '1' : '0');
    localStorage.setItem('rps_showVel', showVelCheckbox.checked ? '1' : '0');
  }
  function loadSettings() {
    if (localStorage.getItem('rps_speed')) speedRange.value = localStorage.getItem('rps_speed');
    if (localStorage.getItem('rps_elastic')) elasticCheckbox.checked = localStorage.getItem('rps_elastic') === '1';
    if (localStorage.getItem('rps_showVel')) showVelCheckbox.checked = localStorage.getItem('rps_showVel') === '1';
  }

  // --- Server sync helpers (optional, for logged-in users) ---
  // Example usage: loadSettingsFromDb(googleId), saveSettingsToDb(googleId)
  const apiUrl = window.apiUrl || ''; // set this globally if needed
  async function loadSettingsFromDb(googleId) {
    const res = await fetch(`${apiUrl}/load/rock-paper-scissors?google_id=${googleId}`);
    const json = await res.json();
    if (json.data) {
      if (json.data.speed) speedRange.value = json.data.speed;
      if (json.data.elastic !== undefined) elasticCheckbox.checked = !!json.data.elastic;
      if (json.data.showVel !== undefined) showVelCheckbox.checked = !!json.data.showVel;
      saveSettings(); // update localStorage
      speedMultiplier = parseFloat(speedRange.value);
    }
  }
  function saveSettingsToDb(googleId) {
    fetch(`${apiUrl}/save/rock-paper-scissors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        google_id: googleId,
        data: {
          speed: speedRange.value,
          elastic: elasticCheckbox.checked,
          showVel: showVelCheckbox.checked
        }
      })
    }).then(res => console.log("Saved RPS settings!", res));
  }

  // Simulation state
  let beads = [];
  let lastTs = 0;
  let running = false;
  let collisionCount = 0;
  let elapsed = 0;
  let frameCount = 0;
  let fpsTimer = 0;
  let fps = 0;
  let speedMultiplier;

  // Types
  const TYPES = {
    ROCK: 'rock',
    PAPER: 'paper',
    SCISSORS: 'scissors'
  };
  const TYPE_ORDER = [TYPES.ROCK, TYPES.PAPER, TYPES.SCISSORS];
  const EMOJI = {
    [TYPES.ROCK]: '🪨',
    [TYPES.PAPER]: '📄',
    [TYPES.SCISSORS]: '✂️'
  };
  const COLORS = {
    [TYPES.ROCK]: '#cbd5e1',
    [TYPES.PAPER]: '#86efac',
    [TYPES.SCISSORS]: '#fda4af'
  };

  // Helpers: who wins? returns winner type or null if tie
  function winner(a, b) {
    if (a === b) return null;
    if (a === TYPES.ROCK && b === TYPES.SCISSORS) return a;
    if (a === TYPES.SCISSORS && b === TYPES.PAPER) return a;
    if (a === TYPES.PAPER && b === TYPES.ROCK) return a;
    // otherwise b wins
    return b;
  }

  // Bead class
  class Bead {
    constructor(x,y,vx,vy,type){
      this.x = x; this.y = y; this.vx = vx; this.vy = vy;
      this.r = 10 + Math.random()*6; // radius
      this.type = type;
      this.id = Math.random().toString(36).slice(2,9);
      // jitter so not aligned
      this.angle = Math.random()*Math.PI*2;
    }
    draw(ctx){
      // circle
      ctx.beginPath();
      ctx.fillStyle = COLORS[this.type] || '#fff';
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 1;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fill();
      ctx.stroke();

      // emoji center
      ctx.font = (this.r*1.4|0) + 'px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#071320';
      ctx.fillText(EMOJI[this.type], this.x + 0.5, this.y + 0.5);

      if (showVelCheckbox.checked) {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + this.vx*4, this.y + this.vy*4);
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
    step(dt){
      this.x += this.vx * dt * speedMultiplier;
      this.y += this.vy * dt * speedMultiplier;
      // bounds bounce
      if (this.x - this.r < 4) { this.x = this.r + 4; this.vx = Math.abs(this.vx); }
      if (this.x + this.r > canvas.clientWidth - 4) { this.x = canvas.clientWidth - 4 - this.r; this.vx = -Math.abs(this.vx); }
      if (this.y - this.r < 4) { this.y = this.r + 4; this.vy = Math.abs(this.vy); }
      if (this.y + this.r > canvas.clientHeight - 4) { this.y = canvas.clientHeight - 4 - this.r; this.vy = -Math.abs(this.vy); }
    }
  }

  // Initialize beads based on inputs
  function seedFromInputs() {
    const r = Math.max(0, Math.min(400, parseInt(inputR.value) || 0));
    const p = Math.max(0, Math.min(400, parseInt(inputP.value) || 0));
    const s = Math.max(0, Math.min(400, parseInt(inputS.value) || 0));
    init(r,p,s);
  }

  function init(countR=30, countP=30, countS=30) {
    beads = [];
    collisionCount = 0;
    elapsed = 0;
    frameCount = 0;
    fps = 0;
    // spawn function avoids immediate overlapping too much
    function spawnMany(type, n) {
      for(let i=0;i<n;i++){
        let tries = 0;
        let x,y;
        do {
          x = 20 + Math.random()*(canvas.clientWidth - 40);
          y = 20 + Math.random()*(canvas.clientHeight - 40);
          tries++;
          // don't try hard to avoid overlap — small crowd allowed
        } while (tries < 20 && beads.some(b => (b.x-x)**2 + (b.y-y)**2 < (b.r+14)**2));
        const angle = Math.random()*Math.PI*2;
        const speed = 40 + Math.random()*130;
        const vx = Math.cos(angle)*speed;
        const vy = Math.sin(angle)*speed;
        const bead = new Bead(x,y,vx,vy,type);
        // slight radius differences for variety
        bead.r = 8 + Math.random()*8;
        beads.push(bead);
      }
    }

    spawnMany(TYPES.ROCK, countR);
    spawnMany(TYPES.PAPER, countP);
    spawnMany(TYPES.SCISSORS, countS);

    updateLeader();
    updateUI();
  }

  // collision detection & resolution (simple)
  function handleCollisions(dt) {
    // naive O(n^2)
    const n = beads.length;
    for (let i = 0; i < n; i++) {
      const a = beads[i];
      for (let j = i + 1; j < n; j++) {
        const b = beads[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist2 = dx*dx + dy*dy;
        const minD = a.r + b.r;
        if (dist2 <= minD*minD) {
          // collision happened
          collisionCount++;
          resolveCollision(a,b);
        }
      }
    }
  }

  function resolveCollision(a,b) {
    const win = winner(a.type, b.type);
    if (win === null) {
      // tie: just bounce
      if (elasticCheckbox.checked) elasticBounce(a,b);
      else simpleBounce(a,b);
      return;
    }
    // determine loser and convert it into winner's type
    let loser = (win === a.type) ? b : a;
    let victor = (win === a.type) ? a : b;

    // convert loser
    loser.type = win;

    // adjust appearance: small radius shift
    loser.r = 8 + Math.random()*8;

    // respond physically: bounce or reflect
    if (elasticCheckbox.checked) elasticBounce(a,b);
    else simpleBounce(a,b);
    updateLeader();
  }

  // basic elastic collision (2D, equal mass)
  function elasticBounce(a,b){
    // from https://stackoverflow.com/a/345863
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx*dx + dy*dy) || 0.0001;
    // normal
    const nx = dx / dist, ny = dy / dist;
    // relative velocity
    const rvx = b.vx - a.vx;
    const rvy = b.vy - a.vy;
    const relVelAlongNormal = rvx*nx + rvy*ny;
    if (relVelAlongNormal > 0) {
      // they're moving apart, tiny separation
    } else {
      const impulse = -2 * relVelAlongNormal / 2; // equal mass
      a.vx -= impulse * nx;
      a.vy -= impulse * ny;
      b.vx += impulse * nx;
      b.vy += impulse * ny;
    }
    // separate slightly to avoid sticking
    const overlap = (a.r + b.r) - dist;
    if (overlap > 0) {
      const sep = overlap/2 + 0.1;
      a.x -= nx * sep;
      a.y -= ny * sep;
      b.x += nx * sep;
      b.y += ny * sep;
    }
    // small friction
    a.vx *= 0.995;
    a.vy *= 0.995;
    b.vx *= 0.995;
    b.vy *= 0.995;
  }

  function simpleBounce(a,b){
    // swap velocities (cheap)
    const tx = a.vx; const ty = a.vy;
    a.vx = b.vx * 0.9; a.vy = b.vy * 0.9;
    b.vx = tx * 0.9; b.vy = ty * 0.9;
  }

  // update leaderboard counts
  function updateLeader(){
    const counts = { rock:0, paper:0, scissors:0 };
    for (const b of beads) counts[b.type]++;
    countRock.textContent = counts.rock;
    countPaper.textContent = counts.paper;
    countScissors.textContent = counts.scissors;
    beadCount.textContent = 'Total: ' + beads.length;

    // Check for win condition
    const nonZeroTypes = Object.entries(counts).filter(([type, count]) => count > 0);
    if (nonZeroTypes.length === 1 && beads.length > 0) {
      // Only one type left
      running = false;
      const winnerType = nonZeroTypes[0][0];
      // Show winner message (replace this with your preferred UI)
      setTimeout(() => {
        showToast(`🏆 ${winnerType.charAt(0).toUpperCase() + winnerType.slice(1)} wins! 🏆`, "success");
      }, 100);
      pauseBtn.textContent = 'Pause';
      pauseBtn.classList.add('secondary');
      startBtn.textContent = 'Start';
      startBtn.disabled = false;
    }
  }

  // main loop
  function loop(ts) {
    if (!lastTs) lastTs = ts;
    const delta = (ts - lastTs) / 1000; // seconds
    lastTs = ts;
    if (running) {
      elapsed += delta;
      // step beads
      for (const b of beads) b.step(delta);
      // collisions
      handleCollisions(delta);
    }

    // draw
    draw();

    // stat updates
    frameCount++;
    fpsTimer += delta;
    if (fpsTimer >= 0.5) {
      fps = Math.round(frameCount / fpsTimer);
      frameCount = 0; fpsTimer = 0;
    }
    statFps.textContent = fps;
    statTime.textContent = Math.round(elapsed) + ' s';
    statColl.textContent = collisionCount;
    infoTime.textContent = 'Time: ' + Math.round(elapsed) + 's';
    infoCollisions.textContent = 'Collisions: ' + collisionCount;

    requestAnimationFrame(loop);
  }

  function draw() {
    // clear
    ctx.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);
    // background subtle
    const grd = ctx.createLinearGradient(0,0,0,canvas.clientHeight);
    grd.addColorStop(0,'#071428'); grd.addColorStop(1,'#082033');
    ctx.fillStyle = grd;
    ctx.fillRect(0,0,canvas.clientWidth,canvas.clientHeight);

    // draw beads
    for (const b of beads) b.draw(ctx);
  }

  // UI handlers
  startBtn.addEventListener('click', () => { running = true; lastTs = 0; });
  pauseBtn.addEventListener('click', () => { running = !running; pauseBtn.textContent = running ? 'Pause' : 'Resume'; pauseBtn.classList.toggle('secondary'); });
  resetBtn.addEventListener('click', () => {
    seedFromInputs();
    running = false;
    lastTs = 0;
    collisionCount = 0;
    elapsed = 0;
    pauseBtn.textContent = 'Pause';
    pauseBtn.classList.add('secondary');
  });

  speedRange.addEventListener('input', (e) => { 
    speedMultiplier = parseFloat(e.target.value); 
    saveSettings();
    // If logged in, also save to server:
    // if (window.googleId) saveSettingsToDb(window.googleId);
  });
  elasticCheckbox.addEventListener('change', () => {
    saveSettings();
    // if (window.googleId) saveSettingsToDb(window.googleId);
  });
  showVelCheckbox.addEventListener('change', () => {
    saveSettings();
    // if (window.googleId) saveSettingsToDb(window.googleId);
  });
  inputR.addEventListener('change', () => {});
  inputP.addEventListener('change', () => {});
  inputS.addEventListener('change', () => {});

  // helper to update UI counts live (also called on init)
  function updateUI(){ updateLeader(); statColl.textContent = collisionCount; statTime.textContent = '0 s'; statFps.textContent = '--'; }

  // --- Load settings on startup ---
  loadSettings();
  speedMultiplier = parseFloat(speedRange.value);

  // Optionally, if logged in, load from server:
  // if (window.googleId) loadSettingsFromDb(window.googleId);

  // init and start animation
  seedFromInputs();
  requestAnimationFrame(loop);

  // Start button also toggles text for clarity
  startBtn.addEventListener('click', () => { startBtn.textContent = 'Running'; startBtn.disabled = true; });
  resetBtn.addEventListener('click', () => { startBtn.textContent = 'Start'; startBtn.disabled = false; });

  // keyboard: space to pause
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      running = !running;
      pauseBtn.textContent = running ? 'Pause' : 'Resume';
      pauseBtn.classList.toggle('secondary');
    }
  });

  // resize handling (keeps canvas scale)
  window.addEventListener('resize', () => {
    canvas.width = canvas.clientWidth * (window.devicePixelRatio || 1);
    canvas.height = canvas.clientHeight * (window.devicePixelRatio || 1);
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  });
})();