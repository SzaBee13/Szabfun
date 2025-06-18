const lsWins = localStorage.getItem('eg-wins');
const lsLoses = localStorage.getItem('eg-loses');
const winsElement = document.getElementById('wins');
const losesElement = document.getElementById('loses');
const container = document.getElementById('container');
const doorOpen = new Audio('./assets/open-door.mp3');
const tryOpenDoor = new Audio('./assets/try-open-door.mp3');
const safeOpen = new Audio('./assets/safe-open.mp3');
const gunShoot = new Audio('./assets/gun-shoot.mp3');

const apiUrl = "https://szb.pagekite.me"

let loses = 0;
let wins = 0;
let inv = {};

async function loadFromDb(googleId) {
    const res = await fetch(`${apiUrl}/load/escape-game?google_id=${googleId}`);
    const json = await res.json();
    
    if (json.data) {
        const data = json.data;
        if (data.loses || data.wins) {
            if (data.wins) {
                wins = parseInt(data.wins);
            }
            if (data.loses) {
                loses = parseInt(data.loses);
            }
            // Set these back into game
            console.log("Loaded:", data);
        } else {
            if (lsWins) {
                wins = parseInt(lsWins);
            }
            if (lsLoses) {
                loses = parseInt(lsLoses);
            }
        }

        winsElement.innerText = wins;
        losesElement.innerText = loses;
    } else {
        console.log("No saved data yet!");
    }
}


function saveToDb(googleId, wins, loses) {
    fetch(`${apiUrl}/save/escape-game`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            google_id: googleId,
            data: {
                wins,
                loses
            }
        })
    }).then(res => console.log("Saved Escape Game progress!" + res));
}

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

function getInv(t) {
    const invSound = new Audio('./assets/inv.mp3');

    invSound.play();
    let invStr = '';
    if (Object.keys(inv).length === 0) {
        invStr = 'Empty';
    } else {
        for (let key in inv) {
            invStr += key + ', ';
        }
    }

    if (t === "get") {
        return invStr;
    } else if (t === "display") {
        container.innerHTML = `
        <h1>Inventory: ${invStr}</h1>
        <button id="newRoom">Back</button>
        `;
        document.getElementById('newRoom').onclick = newRoom;
    }
    console.log(invStr);
    
}

async function win() {
    const congratsYouEscaped = new Audio('./assets/win/c-u-es.mp3');
    const youHaveWon = new Audio('./assets/win/w-and-l.mp3');

    wins++;
    localStorage.setItem('eg-wins', wins);
    if (localStorage.getItem("google_id")) {
        saveToDb(localStorage.getItem("google_id"), wins, loses)
    }
    congratsYouEscaped.play();
    container.innerHTML = `
    <h1 class="type">Congratulations! You escaped!</h1>
    `;
    await sleep(2000);

    youHaveWon.play();
    container.innerHTML = `
    <h1>Congratulations! You escaped!</h1>
    <h1 class="type">You have won ${wins} times and lost ${loses} times.</h1>
    `;
    await sleep(3000);

    container.innerHTML = `
    <h1>Congratulations! You escaped!</h1>
    <h1>You have won ${wins} times and lost ${loses} times.</h1>
    <h1 class="type">Inventory: ${getInv("get")}</h1>
    <div class="buttons">
        <button id="newRoom">Play Again</button>
        <button id="back"><a href="../index.html" style="text-decoration: none; color: #fff;">Back</a></button>
    </div>
    `;
    document.getElementById('newRoom').onclick = newRoom;
}

async function lose() {
    const youLost = new Audio('./assets/lose/u-lost.mp3');
    const youHaveWon = new Audio('./assets/lose/w-and-l.mp3');

    loses++;
    localStorage.setItem('eg-loses', loses);
    if (localStorage.getItem("google_id")) {
        saveToDb(localStorage.getItem("google_id"), wins, loses)
    }
    youLost.play();
    container.innerHTML = `
    <h1 class="type">You lost!</h1>
    `;
    await sleep(2000);

    youHaveWon.play();
    container.innerHTML = `
    <h1>You lost!</h1>
    <h1 class="type">You have won ${wins} times and lost ${loses} times.</h1>
    `;
    await sleep(3000);

    container.innerHTML = `
    <h1>You lost!</h1>
    <h1>You have won ${wins} times and lost ${loses} times.</h1>
    <h1 class="type">Inventory: ${getInv("get")}</h1>
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

function addItem(key, value) {
    inv[key] = value;
}

function randint(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function room1() {
    const youAreInRoom1 = new Audio('./assets/room1/u-are-in-r-1.mp3');
    const darkness = new Audio('./assets/room1/t-is-dark-in.mp3');
    const leaveOrSearch = new Audio('./assets/room1/l-r-or-s-for-l.mp3');
    const turnOnLight = new Audio('./assets/room1/t-on-light-and-s-key.mp3');
    const takeKey = new Audio('./assets/room1/u-t-key.mp3');

    container.innerHTML = ``;
    doorOpen.play();
    await sleep(1000);
    youAreInRoom1.play();
    container.innerHTML = `
    <h1 class="type">You are in room 1</h1>
    `;
    await sleep(2000)

    darkness.play();
    container.innerHTML = `
    <h1>You are in room 1</h1>
    <h1 class="type">There is darkness in the room.</h1>
    `;
    await sleep(2000)

    leaveOrSearch.play();
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
        turnOnLight.play();
        container.innerHTML = `
        <h1 class="type">You turn on the light and see a key on the table.</h1>
        `;
        await sleep(3000);

        takeKey.play();
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
    const youAreInRoom2 = new Audio('./assets/room2/u-are-in-r-2.mp3');
    const tableAndBody = new Audio('./assets/room2/t-and-d-b.mp3');
    const leaveOrSearch = new Audio('./assets/room2/l-r-or-s-b.mp3');
    const findNote = new Audio('./assets/room2/y-f-n-in-p.mp3');
    const codeIs = new Audio('./assets/room2/t-c-is.mp3');
    const takeNote = new Audio('./assets/room2/y-t-n.mp3');

    container.innerHTML = ``;
    doorOpen.play();
    await sleep(1000); 
    youAreInRoom2.play();
    container.innerHTML = `
    <h1 class="type">You are in room 2</h1>
    `;
    await sleep(2000)

    tableAndBody.play();
    container.innerHTML = `
    <h1>You are in room 2</h1>
    <h1 class="type">There is a table and a dead body on the chair.</h1>
    `;
    await sleep(3000)

    leaveOrSearch.play();
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

        findNote.play();
        container.innerHTML = `
        <h1 class="type">You find a note in the pocket of the dead body.</h1>
        `;
        await sleep(3000);

        codeIs.play();
        container.innerHTML = `
        <h1>You find a note in the pocket of the dead body.</h1>
        <h1 class="type">It says 'The code is ${code}'.</h1>
        `;
        await sleep(2000);

        takeNote.play();
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
    const youAreInRoom3 = new Audio('./assets/room3/y-are-in-r-3.mp3');
    const thereIsSafe = new Audio('./assets/room3/t-is-a-s.mp3');
    const youRemember = new Audio('./assets/room3/u-r-the-n-r2.mp3');
    const tryOpenSafe = new Audio('./assets/room3/u-t-to-o.mp3');
    const theSafeOpen = new Audio('./assets/room3/t-s-o.mp3');
    const takeOrLeave = new Audio('./assets/room3/t-or-l.mp3');
    const takeTheGun = new Audio('./assets/room3/u-t-the-g.mp3');
    const dontHaveCode = new Audio('./assets/room3/u-d-h-a-c.mp3');

    container.innerHTML = ``;
    doorOpen.play();
    await sleep(1000);

    youAreInRoom3.play();
    container.innerHTML = `
    <h1 class="type">You are in room 3</h1>
    `;
    await sleep(2000);

    thereIsSafe.play();
    container.innerHTML = `
    <h1>You are in room 3</h1>
    <h1 class="type">There is a safe in the room.</h1>
    `;
    await sleep(2000);

    if ("note" in inv) {
        youRemember.play();
        container.innerHTML = `
        <h1 class="type">You remember the note you found in room 2.</h1>
        `;
        await sleep(2000);

        tryOpenSafe.play();
        container.innerHTML = `
        <h1>You remember the note you found in room 2.</h1>
        <h1 class="type">You try to open the safe with the code ${inv["note"]}.</h1>
        `;
        safeOpen.play();
        await sleep(3000);

        theSafeOpen.play();
        container.innerHTML = `
        <h1>You remember the note you found in room 2.</h1>
        <h1>You try to open the safe with the code ${inv["note"]}.</h1>
        <h1 class="type">The safe opens and you find a gun.</h1>
        `;
        await sleep(2000);

        takeOrLeave.play();
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
            takeTheGun.play();
            container.innerHTML = `
            <h1 class="type">You take the gun. It might be useful. (Gun added to inventory)</h1>
            <button id="leave">Leave</button>
            `;

            addItem('gun', 'gun');
            document.getElementById('leave').onclick = newRoom;
        };
    } else {
        dontHaveCode.play();
        container.innerHTML = `
        <h1 class="type">You don't have the code to open the safe. Try to find it.</h1>
        <button id="leave">Leave</button>
        `;

        document.getElementById('leave').onclick = newRoom;
    }
}

async function room4() {
    const youAreInRoom4 = new Audio('./assets/room4/u-are-in-r-4.mp3');
    const thereIsLion = new Audio('./assets/room4/t-is-a-l.mp3');
    const leaveOrFight = new Audio('./assets/room4/the-l-a-in-5-s.mp3');
    const rememberGun = new Audio('./assets/room4/u-r-the-g-y-f-in-r-3.mp3');
    const shootLion = new Audio('./assets/room4/u-t-the-g-and-s.mp3');
    const theLionIdDead = new Audio('./assets/room4/the-l-is-d.mp3');
    const rememberFood = new Audio('./assets/room4/u-r-the-f-y-f-in-r-5.mp3');
    const throwFood = new Audio('./assets/room4/u-g-the-f-and-t-it-t-the-l.mp3');
    const theLionIsEating = new Audio('./assets/room4/the-l-is-e.mp3');
    const tryToFight = new Audio('./assets/room4/t-to-f.mp3');

    container.innerHTML = ``;
    doorOpen.play();
    await sleep(1000);

    youAreInRoom4.play();
    container.innerHTML = `
    <h1 class="type">You are in room 4</h1>
    `;
    await sleep(2000);

    thereIsLion.play();
    container.innerHTML = `
    <h1>You are in room 4</h1>
    <h1 class="type">There is a lion in the room.</h1>
    `;
    await sleep(2000);

    let time = 5;
    leaveOrFight.play();
    container.innerHTML = `
    <h1>You are in room 4</h1>
    <h1>There is a lion in the room.</h1>
    <h1 class="type">The lion is see you and attack in 5s. What will you do? leave or fight?</h1>
    `;
    await sleep(4000);

    if ("gun" in inv) {
        rememberGun.play();
        container.innerHTML = `
        <h1 class="type">You remember the gun you found in room 3.</h1>
        `;
        await sleep(2000);
        
        shootLion.play();
        container.innerHTML = `
        <h1>You remember the gun you found in room 3.</h1>
        <h1 class="type">You take the gun and shoot the lion.</h1>
        `;
        gunShoot.play();
        await sleep(2000);

        theLionIdDead.play();
        container.innerHTML = `
        <h1>You remember the gun you found in room 3.</h1>
        <h1>You take the gun and shoot the lion.</h1>
        <h1 class="type">The lion is dead.</h1>
        <button id="leave">Leave</button>
        `;

        document.getElementById('leave').onclick = newRoom;
    } else if ("food" in inv) {
        rememberFood.play();
        container.innerHTML = `
        <h1 class="type">You remember the food you found in room 5.</h1>
        `;
        await sleep(2000);

        throwFood.play();
        container.innerHTML = `
        <h1>You remember the food you found in room 5.</h1>
        <h1 class="type">You grab the food and throw it to the lion.</h1>
        `;
        await sleep(2000);

        theLionIsEating.play();
        container.innerHTML = `
        <h1>You remember the food you found in room 5.</h1>
        <h1>You grab the food and throw it to the lion.</h1>
        <h1 class="type">The lion is eating the food. (You are safe now)</h1>
        <button id="leave">Leave</button>
        `;

        document.getElementById('leave').onclick = newRoom;
    } else {
        let gi;
        for (let i = time; i > 0; i--) {
            gi = i;
            container.innerHTML = `
            <h1>You are in room 4</h1>
            <h1>There is a lion in the room.</h1>
            <h1>The lion is see you and attack in ${i}s. What will you do? Leave or fight?</h1>
            <div class="buttons">
                <button id="leave">Leave</button>
                <button id="fight">Fight</button>
            </div>
            `;
            document.getElementById('leave').onclick = () => { newRoom(); i = 9999; };
            document.getElementById('fight').onclick = async function() {
                tryToFight.play();
                container.innerHTML = `
                <h1 class="type">You jump on the lion and try to fight.</h1>
                `;
                await sleep(2000);
                
                container.innerHTML = `
                <h1>You jump on the lion and try to fight.</h1>
                <h1 class="type">...</h1>
                `;
            };
            await sleep(1000);
        }
        if (gi !== 9999) {
            lose();
        }
    }
}

async function room5() {
    const youRemember = new Audio('./assets/room5/u-r-the-k-u-f-in-r-1.mp3');
    const youUseTheKey = new Audio('./assets/room5/u-use-the-k.mp3');
    const theDoorIsOpen = new Audio('./assets/room5/the-d-is-o.mp3');
    const youAreInRoom5 = new Audio('./assets/room5/u-are-in-r-5.mp3');
    const thereIsLotOf = new Audio('./assets/room5/t-is-a-l-of-f-and-a-k-to-f.mp3');
    const youJustHaveTo = new Audio('./assets/room5/u-j-h-to-f.mp3');
    const youTake = new Audio('./assets/room5/u-take.mp3');
    const youHaveToFound = new Audio('./assets/room5/u-n-a-k.mp3');

    container.innerHTML = ``;
    tryOpenDoor.play();
    await sleep(7000);

    if ("key" in inv) {
        youRemember.play();
        container.innerHTML = `
        <h1 class="type">You remember the key you found in room 1.</h1>
        `;
        await sleep(2000);

        youUseTheKey.play();
        container.innerHTML = `
        <h1>You remember the key you found in room 1.</h1>
        <h1 class="type">You use the key to open the door.</h1>
        `;
        doorOpen.play();
        await sleep(2000);

        theDoorIsOpen.play();
        container.innerHTML = `
        <h1>You remember the key you found in room 1.</h1>
        <h1>You use the key to open the door.</h1>
        <h1 class="type">The door is open and you go inside.</h1>
        `;
        await sleep(2000);

        youAreInRoom5.play();
        container.innerHTML = `
        <h1 class="type">You are in room 5.</h1>
        `;
        await sleep(2000);

        thereIsLotOf.play();
        container.innerHTML = `
        <h1>You are in room 5.</h1>
        <h1 class="type">There is a lot of food in the room and the key to freedom.</h1>
        `;
        await sleep(3000);

        youJustHaveTo.play();
        container.innerHTML = `
        <h1>You are in room 5.</h1>
        <h1>There is a lot of food in the room and the key to freedom.</h1>
        <h1 class="type">You just have to found the room for the freedom.</h1>
        `;
        await sleep(3000);

        youTake.play();
        container.innerHTML = `
        <h1>You are in room 5.</h1>
        <h1>There is a lot of food in the room and the key to freedom.</h1>
        <h1>You just have to found the room for the freedom.</h1>
        <h1 class="type">You take the key and the food. (Key and food added to inventory)</h1>
        <button id="leave">Leave</button>
        `;

        addItem("key-free", "free");
        addItem("food", "food");
        document.getElementById('leave').onclick = newRoom;
    } else {
        youHaveToFound.play();
        container.innerHTML = `
        <h1 class="type">You need a key to open the door. Try to find it.</h1>
        <button id="leave">Leave</button>
        `;
        document.getElementById('leave').onclick = newRoom;
    }
}

async function room6() {
    const youRemember = new Audio('./assets/room6/u-r-the-k-u-f-in-r-5.mp3');
    const youUseTheKey = new Audio('./assets/room6/u-use-the-k.mp3');
    const theDoorIsOpen = new Audio('./assets/room6/the-d-is-o.mp3');
    const youHaveToFound = new Audio('./assets/room6/u-n-a-k.mp3');

    container.innerHTML = ``;
    tryOpenDoor.play();
    await sleep(7000);

    if ("key-free" in inv) {
        youRemember.play();
        container.innerHTML = `
        <h1 class="type">You remember the key you found in room 5.</h1>
        `;
        await sleep(2000);

        youUseTheKey.play();
        container.innerHTML = `
        <h1>You remember the key you found in room 5.</h1>
        <h1 class="type">You use the key to open the door.</h1>
        `;
        doorOpen.play();
        await sleep(2000);

        theDoorIsOpen.play();
        container.innerHTML = `
        <h1>You remember the key you found in room 5.</h1>
        <h1>You use the key to open the door.</h1>
        <h1 class="type">The door is open and you go inside.</h1>
        `;
        await sleep(2000);

        win();
    } else {
        youHaveToFound.play();
        container.innerHTML = `
        <h1 class="type">You need a key to open the door. Try to find it.</h1>
        <button id="leave">Leave</button>
        `;
        document.getElementById('leave').onclick = newRoom;
    }
}

async function room7() {
    const youAreInRoom7 = new Audio('./assets/room7/u-are-in-r-7.mp3');
    const thereIsTable = new Audio('./assets/room7/t-is-a-t.mp3');
    const youSeeNote = new Audio('./assets/room7/u-s-a-n-on-the-t.mp3');
    const itSays = new Audio('./assets/room7/it-says.mp3');

    container.innerHTML = ``;
    doorOpen.play();
    await sleep(1000);

    youAreInRoom7.play();
    container.innerHTML = `
    <h1 class="type">You are in room 7.</h1>
    `;
    await sleep(2000);

    thereIsTable.play();
    container.innerHTML = `
    <h1>You are in room 7</h1>
    <h1 class="type">There is a table in the room.</h1>
    `;
    await sleep(2000);

    youSeeNote.play();
    container.innerHTML = `
    <h1>You are in room 7</h1>
    <h1>There is a table in the room.</h1>
    <h1 class="type">You see a note on the table.</h1>
    `;
    await sleep(2000);

    itSays.play();
    container.innerHTML = `
    <h1>You are in room 7</h1>
    <h1>There is a table in the room.</h1>
    <h1>You see a note on the table.</h1>
    <h1 class="type">It says 'If you want to escape, Go to room 6 and use the key, that you found somewhere else'.</h1>
    <button id="leave">Leave</button>
    `;
    document.getElementById('leave').onclick = newRoom;
}

async function room8() {
    const youAreInRoom8 = new Audio('./assets/room8/u-are-in-r-8.mp3');
    const thereIsAlcoholic = new Audio('./assets/room8/t-is-a-a-p.mp3');
    const heIsGoingToAttack = new Audio('./assets/room8/h-is-g-to-a-u.mp3');
    const youHaveToFight = new Audio('./assets/room8/u-h-to-f-h.mp3');
    const youRemember = new Audio('./assets/room8/u-r-the-g-y-f-in-r-3.mp3');
    const youTakeTheGun = new Audio('./assets/room8/u-t-the-g-and-s-h.mp3');
    const heIsDead = new Audio('./assets/room8/h-is-d.mp3');
    const youDontHaveAnything = new Audio('./assets/room8/u-d-h-a-to-f-h.mp3');

    container.innerHTML = ``;
    doorOpen.play();
    await sleep(1000);

    youAreInRoom8.play();
    container.innerHTML = `
    <h1 class="type">You are in room 8.</h1>
    `;
    await sleep(2000);

    thereIsAlcoholic.play();
    container.innerHTML = `
    <h1>You are in room 8</h1>
    <h1 class="type">There is a alcoholic person in the room.</h1>
    `;
    await sleep(2000);

    heIsGoingToAttack.play();
    container.innerHTML = `
    <h1>You are in room 8</h1>
    <h1>There is a alcoholic person in the room.</h1>
    <h1 class="type">He is going to attack you.</h1>
    `;
    await sleep(2000);

    youHaveToFight.play();
    container.innerHTML = `
    <h1>You are in room 8</h1>
    <h1>There is a alcoholic person in the room.</h1>
    <h1>He is going to attack you.</h1>
    <h1 class="type">You have to fight him.</h1>
    `;
    await sleep(2000);

    if ("gun" in inv) {
        youRemember.play();
        container.innerHTML = `
        <h1 class="type">You remember the gun you found in room 3.</h1>
        `;
        await sleep(2000);

        youTakeTheGun.play();
        container.innerHTML = `
        <h1>You remember the gun you found in room 3.</h1>
        <h1 class="type">You take the gun and shoot.</h1>
        `;
        gunShoot.play();
        await sleep(2000);

        heIsDead.play();
        container.innerHTML = `
        <h1>You remember the gun you found in room 3.</h1>
        <h1>You take the gun and shoot him.</h1>
        <h1 class="type">The alcoholic person is dead.</h1>
        <button id="leave">Leave</button>
        `;
        document.getElementById('leave').onclick = newRoom;
    } else {
        youDontHaveAnything.play();
        container.innerHTML = `
        <h1 class="type">You don't have anything to fight him.</h1>
        `;
        lose();
    }
}

function newRoom() {
    const pleaseChoose = new Audio('./assets/pls-cho-r-1-8.mp3');

    pleaseChoose.play();
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
    document.getElementById('getInv').onclick = () => { getInv("display"); };
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
    if (localStorage.getItem("google_id")) {
        loadFromDb(localStorage.getItem("google_id"))
    } else {
        if (lsWins) {
            wins = parseInt(lsWins);
            winsElement.innerText = wins;
        }
        if (lsLoses) {
            loses = parseInt(lsLoses);
            losesElement.innerText = loses;
        }
    }
}

window.onload = init;