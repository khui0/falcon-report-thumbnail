import "./reset.css";
import "./style.css";
import "./fonts.css";
import "remixicon/fonts/remixicon.css"

import * as canvas from "./canvas.js";

// Assets
import falcon from "./assets/falcon.svg";
import logo from "./assets/falcon-report-logo-v2-with-padding-01.svg?raw";

const WIDTH = 1920;
const HEIGHT = 1080;

const SHADOW_COLOR = "hsl(0, 0%, 12%)";

// Load assets
let ready = false;

let backgroundLogo;
let logoWhite;
let logoGray;

const promises = [
    document.fonts.ready,
    loadImage(falcon).then(img => {
        backgroundLogo = img;
    }),
    loadImage(setSVGStyle(logo, {
        fill: "white"
    })).then(img => {
        logoWhite = img;
    }),
    loadImage(setSVGStyle(logo, {
        fill: SHADOW_COLOR
    })).then(img => {
        logoGray = img;
    }),
]

Promise.all(promises).then(() => {
    ready = true;
    update();
});

// Create the canvas
const thumbnail = new canvas.Offscreen(document.getElementById("preview"), WIDTH, HEIGHT);
const ctx = thumbnail.ctx;

// Set date picker to Friday
const dateInput = document.getElementById("date");
dateInput.value = dateToISO(getFriday());

// Call update 1 second after the last input
let updateTimeout;
[
    document.getElementById("date"),
    document.getElementById("font-size"),
    document.getElementById("visibility"),
    document.getElementById("subtitle-text"),
].forEach(item => {
    item.addEventListener("input", e => {
        clearTimeout(updateTimeout);
        if (ready) {
            updateTimeout = setTimeout(update, 500);
        }
    });
});

function update() {
    const options = getOptions();

    // Draw background
    (() => {
        const gradient = ctx.createConicGradient(0, WIDTH * 0.5, HEIGHT * 0.5);
        gradient.addColorStop(0, "rgb(122, 24, 24)");
        gradient.addColorStop(0.1, "rgb(178, 35, 35)");
        gradient.addColorStop(0.2, "rgb(122, 24, 24)");
        gradient.addColorStop(0.3, "rgb(178, 35, 35)");
        gradient.addColorStop(0.4, "rgb(122, 24, 24)");
        gradient.addColorStop(0.5, "rgb(178, 35, 35)");
        gradient.addColorStop(0.6, "rgb(122, 24, 24)");
        gradient.addColorStop(0.7, "rgb(178, 35, 35)");
        gradient.addColorStop(0.8, "rgb(122, 24, 24)");
        gradient.addColorStop(0.9, "rgb(178, 35, 35)");
        gradient.addColorStop(1, "rgb(122, 24, 24)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
    })();

    // Draw background logo
    (() => {
        const size = HEIGHT * 1.5;
        const x = (WIDTH - size) / 2;
        const y = (HEIGHT - size) / 2;
        ctx.globalAlpha = 0.2;
        ctx.drawImage(backgroundLogo, x, y, size, size);
        ctx.globalAlpha = 1;
    })();

    // Draw Falcon Report Logo
    (() => {
        thumbnail.ctx
        const w = WIDTH * 1;
        const h = logoWhite.height * w / logoWhite.width;
        const x = WIDTH * 0.5 - (w / 2);
        const y = HEIGHT * 0.375 - (h / 2);
        longShadow(HEIGHT / 30, () => {
            ctx.drawImage(logoGray, x, y, w, h);
        });
        ctx.drawImage(logoWhite, x, y, w, h);
    })();

    // Draw subtitle
    (() => {
        const date = dateToString(options.date + "T00:00:00");
        const subtitle = options.subtitleText;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `600 ${(HEIGHT / options.fontSize)}px "Montserrat"`;
        switch (options.visibility) {
            case "date": {
                const x = WIDTH * 0.5;
                const y = HEIGHT * 0.8;
                longShadow(HEIGHT / 30, () => {
                    ctx.fillStyle = SHADOW_COLOR;
                    ctx.fillText(date, x, y);
                });
                ctx.fillStyle = "white";
                ctx.fillText(date, x, y);
                break;
            }
            case "subtitle": {
                const x = WIDTH * 0.5;
                const y = HEIGHT * 0.8;
                longShadow(HEIGHT / 30, () => {
                    ctx.fillStyle = SHADOW_COLOR;
                    ctx.fillText(subtitle, x, y);
                });
                ctx.fillStyle = "white";
                ctx.fillText(subtitle, x, y);
                break;
            }
            case "both": {
                const x = WIDTH * 0.5;
                longShadow(HEIGHT / 30, () => {
                    ctx.fillStyle = SHADOW_COLOR;
                    ctx.fillText(subtitle, x, HEIGHT * 0.73);
                    ctx.fillText(date, x, HEIGHT * 0.87);
                });
                ctx.fillStyle = "white";
                ctx.fillText(subtitle, x, HEIGHT * 0.73);
                ctx.fillText(date, x, HEIGHT * 0.87);
                break;
            }
        }
    })();

    thumbnail.draw();
}

function getOptions() {
    return {
        date: document.getElementById("date").value,
        fontSize: document.getElementById("font-size").value,
        visibility: document.getElementById("visibility").value,
        subtitleText: document.getElementById("subtitle-text").value,
    }
}

function longShadow(depth, callback) {
    ctx.save();
    ctx.translate(depth, depth);
    for (let i = 1; i < depth; i++) {
        if (i == 1) {
            ctx.shadowColor = "rgba(0, 0, 10, 0.5)";
            ctx.shadowBlur = 50;
            ctx.shadowOffsetX = 30;
            ctx.shadowOffsetY = 30;
        }
        else {
            ctx.shadowColor = "transparent";
        }
        ctx.translate(-1, -1);
        callback();
    }
    ctx.restore();
}

function dateToString(date) {
    return new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function dateToISO(date) {
    let year = date.getFullYear()
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function getFriday() {
    const today = new Date();
    return new Date(today.setDate(today.getDate() - today.getDay() + 5));
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
}

function setSVGStyle(svg, styles) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");
    Object.assign(doc.querySelector("svg").style, styles);

    const xml = new XMLSerializer().serializeToString(doc);
    return "data:image/svg+xml;base64," + btoa(xml);
}

document.getElementById("download").addEventListener("click", e => {
    let link = document.createElement("a");
    link.download = `thumbnail-${dateInput.value}.png`;
    link.href = thumbnail.canvas.toDataURL();
    link.click();
});