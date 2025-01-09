const langSel = document.getElementById("lang");
const typeSel = document.getElementById("type");
const lvlSel = document.getElementById("lvl");
const resultDiv = document.getElementById("result");

let api = {};

async function loadJSON(file) {
    const response = await fetch(`./${file}.json`);
    api = await response.json();
}
  
let huWord1;
let huWord2;
let huWord3;
let enWord1;
let enWord2;
let enWord3;

let huSentence1;
let huSentence2;
let huSentence3;
let enSentence1;
let enSentence2;
let enSentence3;

(async () => {
    await loadJSON("api");

    huWord1 = api.hu.lvl1.word;
    huWord2 = api.hu.lvl2.word;
    huWord3 = api.hu.lvl3.word;
    enWord1 = api.en.lvl1.word;
    enWord2 = api.en.lvl2.word;
    enWord3 = api.en.lvl3.word;

    huSentence1 = api.hu.lvl1.sentence;
    huSentence2 = api.hu.lvl2.sentence;
    huSentence3 = api.hu.lvl3.sentence;
    enSentence1 = api.en.lvl1.sentence;
    enSentence2 = api.en.lvl2.sentence;
    enSentence3 = api.en.lvl3.sentence;
})();


let result = []
let lang = "en";
let type = "w";
let lvl = 1;

function updateURL() {
    const params = new URLSearchParams();
    params.set('lang', lang);
    params.set('type', type);
    params.set('lvl', lvl);
    window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
}

function setLang() {
    const value = langSel.value;
    saveSelectedValue(value, "lang")

    lang = value
    updateURL();
}

function setType() {
    const value = typeSel.value;
    saveSelectedValue(value, "type")

    if (value  === "w") {
        type = "w";
    } else if (value == "s") {
        type = "s";
    }
    updateURL();
}

function setLvl() {
    const value = lvlSel.value;
    saveSelectedValue(value, "lvl")

    if (value == "1") {
        lvl = 1;
    } else if (value == "2") {
        lvl = 2;
    } else if (value == "3") {
        lvl = 3;
    }
    updateURL();
}

function lvlListGen(lang, type, lvl) {
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
    lvlListGen(lang, type, lvl)
    resultDiv.innerHTML = `<strong>${randomItemListGen(result)}</strong>`
}

// Mentés a localStorage-ba
function saveSelectedValue(value, type) {
    localStorage.setItem(type, value);
}

// Betöltés a localStorage-ból
function loadSelectedValue(item) {
    const select = document.getElementById(item);
    const savedValue = localStorage.getItem(item);
    if (savedValue) {
        select.value = savedValue;
    }
    if (item == "lvl") {
        lvl = savedValue
    } else if (item == "type") {
        type = savedValue
    }
    else if (item == "lang") {
        lang = savedValue
    }
}

function applyURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('lang')) {
        lang = params.get('lang');
        langSel.value = lang;
    }
    if (params.has('type')) {
        type = params.get('type');
        typeSel.value = type;
    }
    if (params.has('lvl')) {
        lvl = parseInt(params.get('lvl'), 10);
        lvlSel.value = lvl;
    }
}

function inti() {
    //loadSelectedValue
    loadSelectedValue("lvl")
    loadSelectedValue("type")
    loadSelectedValue("lang")
    applyURLParams()
    updateURL()
}

window.onload = inti()