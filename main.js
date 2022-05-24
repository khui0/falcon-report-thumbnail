const thumbnail = document.getElementById("thumbnail");
thumbnail.offscreen = document.createElement("canvas");

const w = 1920;
const h = 1080;

thumbnail.setAttribute("width", w);
thumbnail.setAttribute("height", h);
thumbnail.offscreen.width = thumbnail.width;
thumbnail.offscreen.height = thumbnail.height;

const ctx = thumbnail.offscreen.getContext("2d");

const textSize = document.getElementById("text-size");
const displayOptions = document.getElementById("display-options");
const subtitle = document.getElementById("subtitle");
const datePicker = document.getElementById("date");

// Assets
const primaryFont = new FontFace("LinLibertine", "url(assets/LinLibertine_aBS.ttf)");
const secondaryFont = new FontFace("Montserrat", "url(assets/Montserrat-SemiBold.ttf)");
const backgroundLogo = new Image();
backgroundLogo.src = "assets/falcon.svg";

document.querySelectorAll("input, select").forEach(item => {
    item.addEventListener("input", update);
});

document.getElementById("download").addEventListener("click", downloadImage);

// Set date picker to the this Friday
var today = new Date();
var friday = today.getDate() - today.getDay() + 5;
datePicker.value = dateToISO(new Date(today.setDate(friday)));

// Load fonts and update
primaryFont.load().then(font => {
    document.fonts.add(font);
    secondaryFont.load().then(font => {
        document.fonts.add(font);
        update();
    });
});

function update() {
    ctx.fillStyle = backgroundGradient();
    ctx.fillRect(0, 0, w, h);

    // Draw background logo
    let size = h * 1.5;
    let x = (w - size) / 2;
    let y = (h - size) / 2;
    ctx.globalAlpha = 0.2;
    ctx.drawImage(backgroundLogo, x, y, size, size);
    ctx.globalAlpha = 1;

    // Format text
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "white";

    // Draw main text
    ctx.font = (h / 8) + "px LinLibertine";
    floating3DText(ctx, "THE", w * 0.17, h * 0.23, h / 30);
    ctx.font = (h / 3) + "px LinLibertine";
    floating3DText(ctx, "Falcon", w * 0.6, h * 0.25, h / 30);
    ctx.font = (h / 2.5) + "px LinLibertine";
    floating3DText(ctx, "Report", w * 0.5, h * 0.5, h / 30);

    // Draw bottom text
    ctx.font = (h / textSize.value) + "px Montserrat";
    switch (displayOptions.value) {
        case "0":
            floating3DText(ctx, dateToString(datePicker.value + "T00:00:00"), w * 0.5, h * 0.8, h / 30);
            break;
        case "1":
            floating3DText(ctx, subtitle.value, w * 0.5, h * 0.8, h / 30);
            break;
        case "2":
            floating3DText(ctx, subtitle.value, w * 0.5, h * 0.73, h / 30);
            floating3DText(ctx, dateToString(datePicker.value + "T00:00:00"), w * 0.5, h * 0.87, h / 30);
            break;
    }

    // Draw offscreen canvas to onscreen canvas
    thumbnail.getContext("2d").drawImage(thumbnail.offscreen, 0, 0);
}

function backgroundGradient() {
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
    return gradient;
}

function floating3DText(ctx, string, x, y, depth) {
    let startX = x + depth;
    let startY = y + depth;
    for (i = 1; i < depth; i++) {
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

function dateToISO(date) {
    let year = date.getFullYear()
    let month = (date.getMonth() + 1).toString().padStart(2, "0");
    let day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function downloadImage() {
    let link = document.createElement("a");
    link.download = `fr-${datePicker.value}.png`;
    link.href = thumbnail.toDataURL();
    link.click();
}