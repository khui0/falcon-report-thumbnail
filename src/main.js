import "./reset.css";
import "./style.css";
import "remixicon/fonts/remixicon.css"

// Assets
import linuxLibertine from "./assets/LinLibertineCapitalsB.woff2";
import montserrat from "./assets/Montserrat-SemiBold.woff2";
import falcon from "./assets/falcon.svg";

import * as canvas from "./canvas.js";

const WIDTH = 1920;
const HEIGHT = 1080;

// Load assets
let ready = false;

const fontFaces = [
    new FontFace("Linux Libertine", "url(./assets/LinLibertineCapitalsB.woff2)").load(),
    new FontFace("Montserrat", `url(${montserrat})`).load(),
]
Promise.all(fontFaces).then(font => {
    for (let i = 0; i < font.length; i++) {
        document.fonts.add(font[i]);
    }
    ready = true;
    update();
});

const backgroundLogo = loadImage(falcon);

// Create the canvas
const thumbnail = new canvas.Offscreen(document.getElementById("preview"), WIDTH, HEIGHT);

// Set date picker to Friday
const dateInput = document.getElementById("date");
dateInput.value = getFriday().toISOString().split("T")[0];

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
            updateTimeout = setTimeout(update, 1000);
        }
    });
});

update();

function update() {
    const options = getOptions();

    // Draw background
    thumbnail.ctx.fillStyle = (() => {
        const gradient = thumbnail.ctx.createConicGradient(0, WIDTH * 0.5, HEIGHT * 0.5);
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
        return gradient;
    })();
    thumbnail.ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw background logo
    const size = HEIGHT * 1.5;
    const x = (WIDTH - size) / 2;
    const y = (HEIGHT - size) / 2;
    thumbnail.ctx.globalAlpha = 0.2;
    // thumbnail.ctx.drawImage(backgroundLogo, x, y, size, size);
    thumbnail.ctx.globalAlpha = 1;

    thumbnail.ctx.fillStyle = "black";
    thumbnail.ctx.font = `100px ""`;
    thumbnail.ctx.fillText("test", 100, 100);

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

function longShadow(ctx, string, x, y, depth) {
    let startX = x + depth;
    let startY = y + depth;
    for (let i = 1; i < depth; i++) {
        if (i == 1) {
            ctx.shadowColor = "rgba(0, 0, 10, 0.5)";
            ctx.shadowBlur = 50;
            ctx.shadowOffsetX = 30;
            ctx.shadowOffsetY = 30;
        }
        ctx.fillStyle = "rgb(30, 30, 30)";
        ctx.fillText(string, startX - i, startY - i);
        ctx.shadowColor = "transparent";
    }
    ctx.fillStyle = "white";
    ctx.fillText(string, x, y);
}

function dateToString(date) {
    return new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
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

document.getElementById("download").addEventListener("click", e => {
    let link = document.createElement("a");
    link.download = `thumbnail-${dateInput.value}.png`;
    link.href = thumbnail.canvas.toDataURL();
    link.click();
});