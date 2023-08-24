class Offscreen {
    constructor(w, h) {
        this.width = w;
        this.height = h;

        this.canvas = document.createElement("canvas");
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.ctx = this.canvas.getContext("2d");
    }
} 