import "./reset.css";
import "./style.css";
import "remixicon/fonts/remixicon.css"

// Assets
import titleFont from "./assets/LinLibertineCapitalsB.woff2";
import subtitleFont from "./assets/Montserrat-SemiBold.woff2";
import backgroundLogo from "./assets/falcon.svg";

import * as canvas from "./canvas.js";

const WIDTH = 1920;
const HEIGHT = 1080;

// Set date picker to Friday
document.getElementById("date").value = getFriday().toISOString().split("T")[0];

function getOptions() {
    return {
        date: document.getElementById("date").value,
        fontSize: document.getElementById("font-size").value,
        visibility: document.getElementById("visibility").value,
        subtitleText: document.getElementById("subtitle-text").value,
    }
}

function drawLongShadow(ctx, input, offsetX, offsetY, depth) {
    for (let i = 0; i < input.length; i++) {
        let text = input[i];
        ctx.font = text.font;
        extrudeText(ctx, text.string, text.x + offsetX, text.y + offsetY, depth);
    }
}

function background() {
    const bg = ctx.createConicGradient(0, w * 0.5, h * 0.5);
    bg.addColorStop(0, "rgb(122, 24, 24)");
    bg.addColorStop(0.1, "rgb(178, 35, 35)");
    bg.addColorStop(0.2, "rgb(122, 24, 24)");
    bg.addColorStop(0.3, "rgb(178, 35, 35)");
    bg.addColorStop(0.4, "rgb(122, 24, 24)");
    bg.addColorStop(0.5, "rgb(178, 35, 35)");
    bg.addColorStop(0.6, "rgb(122, 24, 24)");
    bg.addColorStop(0.7, "rgb(178, 35, 35)");
    bg.addColorStop(0.8, "rgb(122, 24, 24)");
    bg.addColorStop(0.9, "rgb(178, 35, 35)");
    bg.addColorStop(1, "rgb(122, 24, 24)");
    return bg;
}

function extrudeText(ctx, string, x, y, depth) {
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

function downloadImage() {
    let link = document.createElement("a");
    link.download = `thumbnail-${datePicker.value}.png`;
    link.href = output.toDataURL();
    link.click();
}