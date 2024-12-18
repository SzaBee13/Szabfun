const langSel = document.getElementById("select");
const typeSel = document.getElementById("type");
const lvlSel = document.getElementById("lvl");
const resultDiv = document.getElementById("result");

const huWord1 = ["bazdmeg", "pöcs", "fing", "farok", "segg", "bunkó"];
const huWord2 = ["buzi", "feka", "náci", "dagadék", "kurva", "seggfej"];
const huWord3 = ["fasz", "fasszopó", "kurva anyád", "szopógép", "szex", "dug", "basz", "kúrás"];
const enWord1 = ["jerk", "butt", "idiot", "fucking", "fuck", "penis"];
const enWord2 = ["gay", "asshole", "bitch", "nigger", "lump", "black", "nazi"];
const enWord3 = ["dick", "dickhead", "pussy", "sucking", "sex", "curing"];

const huSentence1 = [
    "Bazdmeg te kis pöcs!",
    "Mikor mutatod meg a farkadat?",
    "Ki fingott?",
    "Te bunkó pöcs!",
    "Seggfej aki mondja.",
    "Mivan ráléptél a farkadra"
]
const huSentence2 = [
    "Te buzi seggfej.",
    "Mivan várod Hitlert te náci!?",
    "Nézd ott egy kibaszot feka!",
    "Te kurva dagadék.",
    "A te anyád egy kurva!"
]
const huSentence3 = [
    "Te fasszopó, nincs kit szopj?",
    "Kurva anyáddal kurtam este!",
    "Mivan, nincs kedved szexelni? Te vagy a nő én a férfi.",
    "Szopogép most már nem csak szop, mér dug is!"
]
const enSentence1 = [
    "Fuck you little dick!",
    "When are you going to show your dick?",
    "Who farted?",
    "You jerk!",
    "An asshole who says.",
    "Why did you step on your tail"
]
const enSentence2 = [
    "You gay ass.",
    "What are you waiting for Hitler, you Nazi!?",
    "Look at that fucking nigger!",
    "You fucking lump.",
    "Your mother is a whore!"
]
const enSentence3 = [
    "You cocksucker, don't you have someone to suck?",
    "I fucked your mother in the evening!",
    "What, you don't feel like having sex? You're the woman and I'm the man.",
    "The suction machine no longer just sucks, it also sucks!"
]

let result = []
let lang = "en";
let type = "w";
let lvl = 1;

function setLang() {
    const value = langSel.value;

    if (value === "hu") {
        lang = "hu";
    } else if (value === "en") {
        lang = "en";
    }
}

function setType() {
    const value = typeSel.value;

    if (value  === "w") {
        type = "w";
    } else if (value == "s") {
        type = "s";
    }
}

function setLvl() {
    const value = lvlSel.value;
    if (value == "1") {
        lvl = 1;
    } else if (value == "2") {
        lvl = 2;
    } else if (value == "3") {
        lvl = 3;
    }

    if (value == "1") {
        lvl = 1;
    } else if (value == "2") {
        lvl = 2;
    } else if (value == "3") {
        lvl = 3;
    }
}

function lvlListGen(lang, type) {
    if (type == "w") {
        if (lang == "en") {
            if (lvl == 1) {
                result = enWord1
            } else if (lvl == 2) {
                result = enWord2
            } else if (lvl == 3) {
                result = enWord3
            }
        } else if (lang == "hu") {
            if (lvl == 1) {
                result = huWord1
            } else if (lvl == 2) {
                result = huWord2
            } else if (lvl == 3) {
                result = huWord3
            }
        }
    } else if (type == "s") {
        if (lang == "en") {
            if (lvl == 1) {
                result = enSentence1
            } else if (lvl == 2) {
                result = enSentence2
            } else if (lvl == 3) {
                result = enSentence3
            }
        } else if (lang == "hu") {
            if (lvl == 1) {
                result = huSentence1
            } else if (lvl == 2) {
                result = huSentence2
            } else if (lvl == 3) {
                result = huSentence3
            }
        }
    }
}

function randomItemListGen(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function genWord() {
    resultDiv.innerHTML = ""
    lvlListGen(lang, type)
    resultDiv.innerHTML = `<strong>${randomItemListGen(result)}</strong>`
}