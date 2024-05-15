"use strict";

const schepen = [
    { naam: "vliegdekschip", lengte: 5, kleur: "groen", afbeelding: "boot_groen.png", actief: true },
    { naam: "slagschip", lengte: 4, kleur: "rood", afbeelding: "boot_rood.png", actief: true },
    { naam: "onderzeeer", lengte: 3, kleur: "geel", afbeelding: "boot_geel.png", actief: true },
    { naam: "torpedo", lengte: 3, kleur: "oranje", afbeelding: "boot_oranje.png", actief: true },
    { naam: "patrouille", lengte: 2, kleur: "blauw", afbeelding: "boot_blauw.png", actief: true }
];
let schepenInfo = [];
const foutMelding = document.getElementById("msg");
const inputSchepen = document.getElementById("schepen");
const inputRij = document.getElementById("rij");
const inputKolom = document.getElementById("kolom");

verwerkLocalSchepen();
maakFormulier();



function maakFormulier() {
    maakSelectSchepen();
    maakSelectRij();
    maakSelectKolom();
    activeerButtons();
}

function maakSelectSchepen() {
    // Select options Schepen: [lengte* Naam]
    inputSchepen.replaceChildren();  // leeg maken
    const optionKies = document.createElement("option");
    optionKies.setAttribute("value", "");
    inputSchepen.appendChild(optionKies).append("--- Kies een schip ---");
    for (const schip of schepen) {
        if (schip.actief === true) {
            const option = document.createElement("option");
            option.setAttribute("value", schepen.indexOf(schip));
            inputSchepen.appendChild(option).append(`${schip.lengte}* ${schip.naam}`);
            console.log("select schip toegevoegd: ", schip);
        }
    }
}

function maakSelectRij() {
    // Select options Rij: 1-10
    for (let index = 1; index <= 10; index++) {
        const option = document.createElement("option");
        option.setAttribute("value", index)
        inputRij.appendChild(option).append(index);
    }
}

function maakSelectKolom() {
    // Select options Kolom: A-J
    for (let index = 1; index <= 10; index++) {
        const option = document.createElement("option");
        option.setAttribute("value", index);
        inputKolom.appendChild(option).append(String.fromCodePoint(index + 64));
    }
}

function activeerButtons() {
    // Button: schip plaatsen
    document.getElementById("plaatsschip").addEventListener('click', () => {
        if (isGevalideerd(inputSchepen.value)) {
            foutMelding.hidden = true;
            const schip = inputSchepen.value;
            const rijIndex = inputRij.value - 1;  // start index met 0
            const kolomIndex = inputKolom.value - 1;
            const richting = document.querySelector('input[name="richting"]:checked').value;
            console.log("plaats schip", schip);
            console.log("rijIndex", rijIndex);
            console.log("kolomIndex", kolomIndex);
            console.log("richting", richting);
            if (testSchip(schip, rijIndex, kolomIndex, richting)) {
                plaatsSchip(schip, rijIndex, kolomIndex, richting);
                verwijderInSelect(schip);
                voegtoeAanLocalstorage(schip, rijIndex, kolomIndex, richting);
            }
        }
    });
    // Button: opnieuw beginnen
    document.getElementById("nieuwspel").addEventListener('click', () => {
        localStorage.clear();
        location.reload(); // will reload the page; no need to remove all the ships in the page
    });
}

function isGevalideerd(indexSchip) {
    // Validatie van formulier, return true/false
    if (indexSchip === "") {
        toonFout("Gelieve een schip te kiezen.")
        return false;
    }
    return true;
}

function toonFout(melding) {
    foutMelding.innerText = melding;
    foutMelding.hidden = false;
}

function testSchip(indexSchip, startX, startY, richting) {
    // Test of de plaatsen vrij zijn (= geen beeld), en of het over de rand gaat
    for (let item = 0; item < schepen[indexSchip].lengte; item++) {
        if (richting === "horizontaal") {
            if (startY + item > 9) {
                toonFout("Dat gaat over de rand. Probeer opnieuw.");
                return false;
            } // no need for else, since there is a return
            if (document.getElementById(`${startX}${startY + item}`).hasChildNodes()) {
                toonFout("Onvoldoende ruimte horizontaal.")
                return false;
            }
        } else if (richting === "verticaal") {
            if (startX + item > 9) {
                toonFout("Dat gaat over de rand. Probeer opnieuw.");
                return false;
            }
            if (document.getElementById(`${startX + item}${startY}`).hasChildNodes()) {
                toonFout("Onvoldoende ruimte vertikaal.")
                return false;
            }
        }
    }
    return true;
}

function plaatsSchip(indexSchip, startX, startY, richting) {
    // Plaats het hele schip
    for (let item = 0; item < schepen[indexSchip].lengte; item++) {
        if (richting === "horizontaal") {
            plaatsImg(indexSchip, startX, startY + item);
        } else if (richting === "verticaal") {
            plaatsImg(indexSchip, startX + item, startY);
        }
    }
    // Zet schip op niet actief
    schepen[indexSchip].actief = false;
}

function plaatsImg(indexSchip, x, y) {
    // Plaats één img
    const img = document.createElement("img");
    img.src = `img/${schepen[indexSchip].afbeelding}`;
    document.getElementById(`${x}${y}`).append(img);
}

function verwijderInSelect(indexSchip) {
    document.querySelector(`#schepen option[value="${indexSchip}"]`).remove();
}

function verwerkLocalSchepen() {
    const schepenLocalString = localStorage.getItem("schepenLocalInfo");
    console.log("schepen localstorage string:", schepenLocalString);
    schepenInfo = (schepenLocalString !== null) ? JSON.parse(schepenLocalString) : [];
    for (const schip of schepenInfo) {
        plaatsSchip(schip.indexSchip, schip.startX, schip.startY, schip.richting);
    }
}

function voegtoeAanLocalstorage(indexSchip, startX, startY, richting) {
    // LocalStorage save
    schepenInfo.push({ indexSchip: indexSchip, startX: startX, startY: startY, richting: richting });
    localStorage.setItem("schepenLocalInfo", JSON.stringify(schepenInfo));
    console.log("toegevoegd aan local storage", schepenInfo);
}