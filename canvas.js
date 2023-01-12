export class Text {
    constructor(string, x, y, font) {
        this.string = string;
        this.x = x;
        this.y = y;
        this.font = font;
    }
}

export class Canvas {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.canvas = document.createElement("canvas");
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx = this.canvas.getContext("2d");
    }
}