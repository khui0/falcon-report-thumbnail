const output = document.getElementById("output");
const w = 1920;
const h = 1080;

output.setAttribute("width", w);
output.setAttribute("height", h);

output.offscreen = document.createElement("canvas");
output.offscreen.width = output.width;
output.offscreen.height = output.height;

const ctx = output.offscreen.getContext("2d");

const textSize = document.getElementById("text-size");
const visibility = document.getElementById("visibility");
const subtitle = document.getElementById("subtitle");
const datePicker = document.getElementById("date");

const backgroundLogo = new Image();
backgroundLogo.src = "assets/falcon.svg";

const fontFaces = [
    new FontFace("Title", "url(assets/LinLibertine_aBS.ttf)").load(),
    new FontFace("Subtitle", "url(assets/Montserrat-SemiBold.ttf)").load()
]

// Load fonts
Promise.all(fontFaces).then(values => {
    for (let i = 0; i < values.length; i++) {
        document.fonts.add(values[i]);
    }
    update();
});

// Set date picker to Friday
var today = new Date();
var friday = today.getDate() - today.getDay() + 5;
datePicker.valueAsDate = new Date(today.setDate(friday));

document.querySelectorAll("input, select").forEach(item => {
    item.addEventListener("input", update);
});

document.getElementById("download").addEventListener("click", downloadImage);

function update() {
    // Draw background
    ctx.fillStyle = background();
    ctx.fillRect(0, 0, w, h);

    // Draw background logo
    let size = h * 1.5;
    let x = (w - size) / 2;
    let y = (h - size) / 2;
    ctx.globalAlpha = 0.2;
    ctx.drawImage(backgroundLogo, x, y, size, size);
    ctx.globalAlpha = 1;

    // Set text formatting
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";

    // Draw title
    ctx.font = `${(h / 8)}px Title`;
    ctx.extrudedText("THE", w * 0.17, h * 0.23, h / 30);
    ctx.font = `${(h / 3)}px Title`;
    ctx.extrudedText("Falcon", w * 0.6, h * 0.25, h / 30);
    ctx.font = `${(h / 2.5)}px Title`;
    ctx.extrudedText("Report", w * 0.5, h * 0.5, h / 30);

    // Draw subtitle
    ctx.font = `600 ${(h / textSize.value)}px Subtitle`;
    switch (visibility.value) {
        case "0":
            ctx.extrudedText(dateToString(datePicker.value + "T00:00:00"), w * 0.5, h * 0.8, h / 30);
            break;
        case "1":
            ctx.extrudedText(subtitle.value, w * 0.5, h * 0.8, h / 30);
            break;
        case "2":
            ctx.extrudedText(subtitle.value, w * 0.5, h * 0.73, h / 30);
            ctx.extrudedText(dateToString(datePicker.value + "T00:00:00"), w * 0.5, h * 0.87, h / 30);
            break;
    }

    // Draw offscreen canvas to onscreen canvas
    output.getContext("2d").drawImage(output.offscreen, 0, 0);
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

function dateToString(date) {
    return new Date(date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function downloadImage() {
    let link = document.createElement("a");
    link.download = `thumbnail-${datePicker.value}.png`;
    link.href = output.toDataURL();
    link.click();
}

CanvasRenderingContext2D.prototype.extrudedText = function (string, x, y, depth) {
    let startX = x + depth;
    let startY = y + depth;
    for (let i = 1; i < depth; i++) {
        if (i == 1) {
            this.shadowColor = "rgba(0, 0, 10, 0.5)";
            this.shadowBlur = 50;
            this.shadowOffsetX = 30;
            this.shadowOffsetY = 30;
        }
        this.fillStyle = "rgb(30, 30, 30)";
        this.fillText(string, startX - i, startY - i);
        this.shadowColor = "transparent";
    }
    this.fillStyle = "white";
    this.fillText(string, x, y);
}