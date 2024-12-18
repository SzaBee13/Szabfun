const select = document.getElementById("select");
const typeSel = document.getElementById("type");
const resultDiv = document.getElementById("result")

const huWord = ["nigger", "buzi", "fasz", "fasszopó", "kurva anyád", "bazdmeg"]
const enWord = ["nigger", "gay", "dick", "fuck", "fucking", "bitch", "ur mother"]

let lang = "en";
let type = "w";

function setLang() {
    const value = select.value;

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

function genWord() {
    resultDiv.innerHTML = ""
    if (type == "w") {
        console.log("type: word")

        if (lang == "hu") {
            console.log("lang: hu")
            resultDiv.innerHTML = `<strong>${huWord[Math.floor(Math.random() * huWord.length)]}</strong>`
        } else if (lang == "en") {
            console.log("lang: en")
            resultDiv.innerHTML = `<strong>${enWord[Math.floor(Math.random() * huWord.length)]}</strong>`
        }
    } else {
        resultDiv.innerHTML = `<strong>Coming...</strong>`
    }
}