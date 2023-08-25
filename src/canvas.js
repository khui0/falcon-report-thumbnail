export class Offscreen {
    constructor(target, w, h) {
        this.width = w;
        this.height = h;

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.ctx = this.canvas.getContext("2d");

        this.target = target;
        this.target.width = this.width;
        this.target.height = this.height;
    }

    draw() {
        this.target.getContext("2d").drawImage(this.canvas, 0, 0);
    }
} 