const image = document.getElementById("thumbnail");
const ctx = image.getContext("2d");
const w = 1920;
const h = 1080;

const textOptions = document.getElementById("text-options");
const subtitle = document.getElementById("subtitle");
const datePicker = document.getElementById("date");

const primaryFont = new FontFace("LinLibertine", "url(assets/LinLibertine_aBS.ttf)");
const secondaryFont = new FontFace("Montserrat", "url(assets/Montserrat-Medium.ttf)");

const backgroundLogo = new Image();
backgroundLogo.src = "assets/falcon.svg";

// Event listeners
textOptions.addEventListener("input", () => {
    update();
});

subtitle.addEventListener("input", () => {
    update();
});

datePicker.addEventListener("input", () => {
    update();
});

document.getElementById("download").addEventListener("click", e => {
    downloadImage();
});

// Set the image dimensions
image.setAttribute("width", w);
image.setAttribute("height", h);

// Set date picker to this week's friday
var today = new Date();
var friday = today.getDate() - today.getDay() + 5;
datePicker.value = new Date(today.setDate(friday)).toISOString().split("T")[0];

// Load fonts
primaryFont.load().then(font => {
    document.fonts.add(font);
    update();
});

secondaryFont.load().then(font => {
    document.fonts.add(font);
    update();
});

function update() {
    // Draw background
    const gradient = ctx.createConicGradient(0, w * 0.5, h * 0.5);
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
    ctx.fillRect(0, 0, w, h);

    // Draw background logo
    let logoSize = h * 1.5;
    let x = (w - logoSize) / 2;
    let y = (h - logoSize) / 2;
    ctx.globalAlpha = 0.2;
    ctx.drawImage(backgroundLogo, x, y, logoSize, logoSize);
    ctx.globalAlpha = 1;

    // Set shadows
    ctx.shadowColor = "rgba(0, 0, 10, 0.5)";
    ctx.shadowBlur = 50;
    ctx.shadowOffsetX = 30;
    ctx.shadowOffsetY = 30;

    // Format text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";

    // Draw main text
    ctx.font = (h / 8) + "px LinLibertine";
    ctx.fillText("THE", w * 0.17, h * 0.23);
    ctx.font = (h / 3) + "px LinLibertine";
    ctx.fillText("Falcon", w * 0.6, h * 0.25);
    ctx.font = (h / 2.5) + "px LinLibertine";
    ctx.fillText("Report", w * 0.5, h * 0.5);

    // Draw bottom text
    if (textOptions.value == 0) {
        ctx.font = (h / 8) + "px Montserrat";
        ctx.fillText(ISOToString(datePicker.value + "T00:00:00"), w * 0.5, h * 0.8);
    }
    else if (textOptions.value == 1) {
        ctx.font = (h / 8) + "px Montserrat";
        ctx.fillText(subtitle.value, w * 0.5, h * 0.8);
    }
    else if (textOptions.value == 2) {
        ctx.font = (h / 8) + "px Montserrat";
        ctx.fillText(subtitle.value, w * 0.5, h * 0.73);
        ctx.fillText(ISOToString(datePicker.value + "T00:00:00"), w * 0.5, h * 0.87);
    }

    // "Disables" shadows
    ctx.shadowColor = "transparent";
}

function ISOToString(date) {
    return new Date(date).toLocaleDateString("en-us", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function downloadImage() {
    var link = document.createElement("a");
    link.download = `fr-${datePicker.value}.png`;
    link.href = image.toDataURL();
    link.click();
}