const image = document.getElementById("thumbnail");
const ctx = image.getContext("2d");
const w = 1920;
const h = 1080;

const textSize = document.getElementById("text-size");
const displayStyle = document.getElementById("display-style");
const subtitle = document.getElementById("subtitle");
const datePicker = document.getElementById("date");

const primaryFont = new FontFace("LinLibertine", "url(assets/LinLibertine_aBS.ttf)");
const secondaryFont = new FontFace("Montserrat", "url(assets/Montserrat-SemiBold.ttf)");

const backgroundLogo = new Image();
backgroundLogo.src = "assets/falcon.svg";

// Event listeners
document.querySelectorAll("input, select").forEach(item => {
    item.addEventListener("input", () => {
        update();
    });
});

document.getElementById("download").addEventListener("click", () => {
    downloadImage();
});

// Set the image dimensions
image.setAttribute("width", w);
image.setAttribute("height", h);

// Set default text size
textSize.value = 8;

// Set date picker to this week's friday
var today = new Date();
var friday = today.getDate() - today.getDay() + 5;
datePicker.value = dateToISO(new Date(today.setDate(friday)));

// Load fonts
primaryFont.load().then(font => {
    document.fonts.add(font);
    secondaryFont.load().then(font => {
        document.fonts.add(font);
        update();
    });
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
    if (displayStyle.value == 0) {
        floating3DText(ctx, dateToString(datePicker.value + "T00:00:00"), w * 0.5, h * 0.8, h / 30);
    }
    else if (displayStyle.value == 1) {
        floating3DText(ctx, subtitle.value, w * 0.5, h * 0.8, h / 30);
    }
    else if (displayStyle.value == 2) {
        floating3DText(ctx, subtitle.value, w * 0.5, h * 0.73, h / 30);
        floating3DText(ctx, dateToString(datePicker.value + "T00:00:00"), w * 0.5, h * 0.87, h / 30);
    }
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
    let month = date.getMonth() + 1;
    let day = date.getDate();
    if (month < 10) {
        month = "0" + month;
    }
    return `${year}-${month}-${day}`;
}

function downloadImage() {
    var link = document.createElement("a");
    link.download = `fr-${datePicker.value}.png`;
    link.href = image.toDataURL();
    link.click();
}