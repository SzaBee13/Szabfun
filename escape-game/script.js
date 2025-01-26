const lsWins = localStorage.getItem('wins');
const lsLoses = localStorage.getItem('loses');
const winsElement = document.getElementById('eg-wins');
const losesElement = document.getElementById('eg-loses');
const container = document.getElementById('container');
const doorOpen = new Audio('./assets/open-door.mp3');
const tryOpenDoor = new Audio('./assets/try-open-door.mp3');
const safeOpen = new Audio('./assets/safe-open.mp3');
const gunShoot = new Audio('./assets/gun-shoot.mp3');

let loses = 0;
let wins = 0;
let inv = {};
//game start

function start() {
    document.body.classList.add('black-background');
    document.getElementById('back').style.color = '#0056b3';
    document.getElementById("startButton").style.display = "none";

    // Request fullscreen
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari and Opera
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
    }

    inv = {};
    newRoom();
}

async function win() {
    wins++;
    localStorage.setItem('eg-wins', wins);
    container.innerHTML = `
    <h1 class="type">You escaped!</h1>
    `;
    await sleep(2000);

    container.innerHTML = `
    <h1>You escaped!</h1>
    <h1 class="type">You have won ${wins} times and lost ${loses} times.</h1>
    <div class="buttons">
        <button id="newRoom">Play Again</button>
        <button id="back"><a href="../index.html" style="text-decoration: none; color: #fff;">Back</a></button>
    </div>
    `;
    document.getElementById('newRoom').onclick = newRoom;
}

async function lose() {
    loses++;
    localStorage.setItem('eg-loses', loses);
    container.innerHTML = `
    <h1 class="type">You lost!</h1>
    `;
    await sleep(2000);

    container.innerHTML = `
    <h1>You lost!</h1>
    <h1 class="type">You have won ${wins} times and lost ${loses} times.</h1>
    <div class="buttons">
        <button id="newRoom">Play Again</button>
        <button id="back"><a href="../index.html" style="text-decoration: none; color: #fff;">Back</a></button>
    </div>
    `;
    document.getElementById('newRoom').onclick = newRoom;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getInv() {
    let invStr = '';
    if (Object.keys(inv).length === 0) {
        invStr = 'Empty';
    } else {
        for (let key in inv) {
            invStr += key + ', ';
        }
    }
    container.innerHTML = `
    <h1>Inventory: ${invStr}</h1>
    <button id="newRoom">Back</button>
    `;
    document.getElementById('newRoom').onclick = newRoom;

    console.log(invStr);
    
}

function addItem(key, value) {
    inv[key] = value;
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function room1() {
    container.innerHTML = ``;
    doorOpen.play();
    await sleep(1000);
    container.innerHTML = `
    <h1 class="type">You are in room 1</h1>
    `;
    await sleep(2000)

    container.innerHTML = `
    <h1>You are in room 1</h1>
    <h1 class="type">There is darkness in the room.</h1>
    `;
    await sleep(2000)

    container.innerHTML = `
    <h1>You are in room 1</h1>
    <h1>There is darkness in the room.</h1>
    <h1 class="type">Leave room or search for light switch?</h1>
    <div class="buttons">
        <button id="leave">Leave</button>
        <button id="search">Search</button>
    </div>
    `;

    document.getElementById('leave').onclick = newRoom;
    document.getElementById('search').onclick = async function() {
        container.innerHTML = `
        <h1 class="type">You turn on the light and see a key on the table.</h1>
        `;
        await sleep(3000);

        container.innerHTML = `
        <h1>You turn on the light and see a key on the table.</h1>
        <h1 class="type">You take the key. It might be useful. (Key added to inventory)</h1>
        <button id="leave">Leave</button>
        `;
        addItem('key', 'r5');
        document.getElementById('leave').onclick = newRoom;
    }
}

async function room2() {
container.innerHTML = ``;
    doorOpen.play();
    await sleep(1000); 
    container.innerHTML = `
    <h1 class="type">You are in room 2</h1>
    `;
    await sleep(2000)

    container.innerHTML = `
    <h1>You are in room 2</h1>
    <h1 class="type">There is a table and a dead body on the chair.</h1>
    `;
    await sleep(3000)

    container.innerHTML = `
    <h1>You are in room 2</h1>
    <h1>There is a table and a dead body on the chair.</h1>
    <h1 class="type">Leave room or search the body?</h1>
    <div class="buttons">
        <button id="leave">Leave</button>
        <button id="search">Search</button>
    </div>
    `

    document.getElementById('leave').onclick = newRoom;
    document.getElementById('search').onclick = async function() {
        const code = randint(1000, 9999);
        container.innerHTML = `
        <h1 class="type">You find a note in the pocket of the dead body.</h1>
        `;
        await sleep(3000);

        container.innerHTML = `
        <h1>You find a note in the pocket of the dead body.</h1>
        <h1 class="type">It says 'The code is ${code}'.</h1>
        `;
        await sleep(2000);

        container.innerHTML = `
        <h1>You find a note in the pocket of the dead body.</h1>
        <h1>It says 'The code is ${code}'.</h1>
        <h1 class="type">You take the note. What is that mean? (Note added to inventory)</h1>
        <button id="leave">Leave</button>
        `;
        addItem('note', code);
        document.getElementById('leave').onclick = newRoom;
    }
}

async function room3() {
    container.innerHTML = ``;
    doorOpen.play();
    await sleep(1000);

    container.innerHTML = `
    <h1 class="type">You are in room 3</h1>
    `;
    await sleep(2000);

    container.innerHTML = `
    <h1>You are in room 3</h1>
    <h1 class="type">There is a safe in the room.</h1>
    `;
    await sleep(2000);

    if ("note" in inv) {
        container.innerHTML = `
        <h1 class="type">You remember the note you found in room 2.</h1>
        `;
        await sleep(2000);

        container.innerHTML = `
        <h1>You remember the note you found in room 2.</h1>
        <h1 class="type">You try to open the safe with the code ${inv["note"]}.</h1>
        `;
        safeOpen.play();
        await sleep(3000);

        container.innerHTML = `
        <h1>You remember the note you found in room 2.</h1>
        <h1>You try to open the safe with the code ${inv["note"]}.</h1>
        <h1 class="type">The safe opens and you find a gun.</h1>
        `;
        await sleep(2000);

        container.innerHTML = `
        <h1>You remember the note you found in room 2.</h1>
        <h1>You try to open the safe with the code ${inv["note"]}.</h1>
        <h1>The safe opens and you find a gun.</h1>
        <h1 class="type">Take the gun or leave it?</h1>
        <div class="buttons">
            <button id="take">Take</button>
            <button id="leave">Leave</button>
        `;

        document.getElementById('leave').onclick = newRoom;
        document.getElementById('take').onclick = async function() {
            container.innerHTML = `
            <h1 class="type">You take the gun. It might be useful. (Gun added to inventory)</h1>
            <button id="leave">Leave</button>
            `;

            addItem('gun', 'gun');
            document.getElementById('leave').onclick = newRoom;
        };
    } else {
        container.innerHTML = `
        <h1 class="type">You don't have the code to open the safe. Try to find it.</h1>
        <button id="leave">Leave</button>
        `;

        document.getElementById('leave').onclick = newRoom;
    }
}

async function room4() {
    
}

async function room5() {}
async function room6() {}
async function room7() {}
async function room8() {}

function newRoom() {
    container.innerHTML = `
    <h1 class="type">Please Choose a room from 1 to 8</h1>
    <div class="buttons">
        <button id="room1">Room 1</button>
        <button id="room2">Room 2</button>
        <button id="room3">Room 3</button>
        <button id="room4">Room 4</button>
        <button id="room5">Room 5</button>
        <button id="room6">Room 6</button>
        <button id="room7">Room 7</button>
        <button id="room8">Room 8</button>
        <button id="getInv">Inventory</button>
    </div>
    `;
    document.getElementById('getInv').onclick = getInv;
    document.getElementById('room1').onclick = room1;
    document.getElementById('room2').onclick = room2;
    document.getElementById('room3').onclick = room3;
    document.getElementById('room4').onclick = room4;
    document.getElementById('room5').onclick = room5;
    document.getElementById('room6').onclick = room6;
    document.getElementById('room7').onclick = room7;
    document.getElementById('room8').onclick = room8;
}


function init() {
    if (lsWins) {
        wins = parseInt(lsWins);
        winsElement.innerText = wins;
    }
    if (lsLoses) {
        loses = parseInt(lsLoses);
        losesElement.innerText = loses;
    }
}