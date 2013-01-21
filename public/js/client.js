




var Map = function (canvas) {
    this.canvas = canvas;
    this.canvas.height = 3000;
    this.canvas.width = 4000;
    this.context = this.canvas.getContext("2d");
};

Map.prototype.update = function () {

};

var Canvas = function (canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
};
Canvas.prototype.initializeHandlers = function () {
    this.canvas.onmousedown = this.mouse_down;
    this.canvas.onmousemove = this.mouse_move;
    this.canvas.onmouseup = this.mouse_up;
};
