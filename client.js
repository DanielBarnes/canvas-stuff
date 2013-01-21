var mini_canvas = document.getElementById("mini_canvas");

var main_canvas = document.getElementById("main_canvas");
var main_context = main_canvas.getContext("2d");
main_canvas.height = main_canvas.clientHeight;
main_canvas.width = main_canvas.clientWidth;
console.log(main_canvas);

var drawing_canvas = document.getElementById("drawing");
var context = drawing_canvas.getContext("2d");
drawing_canvas.height = drawing_canvas.clientHeight;
drawing_canvas.width = drawing_canvas.clientWidth;
console.log(drawing_canvas);


$("#main").click(function (event) {
    console.log(event);
});


// drawing_canvas Events
var isMouseDown = false;
var shape = {};
$(drawing_canvas).mousedown(function (event) {
    console.log("mousedown on #drawing");
    isMouseDown = true;
    shape = { x: getX(event), y: getY(event) };

});

$(drawing_canvas).mousemove(function (event) {
    if (isMouseDown) {
        clear();
        shape.w = getX(event) - shape.x;
        shape.h = getY(event) - shape.y;
        context.fillRect(shape.x, shape.y, shape.w, shape.h);
    } else {

    }
});

$(drawing_canvas).mouseup(function (event) {
    console.log("mouse up on #drawing");
    console.log({width: drawing_canvas.width, height: drawing_canvas.height});
    console.log(shape);
    isMouseDown = false;
    update();
    clear();
});

// helpers
function update() {
    main_context.drawImage(drawing_canvas, 0, 0);
}
function clear() {
    context.clearRect(0,0,drawing_canvas.width, drawing_canvas.height);
}
function getX(event) {
    return event.clientX - $(".main")[0].offsetLeft;
}
function getY(event) {
    return event.clientY - drawing_canvas.offsetTop;
}


/*
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
*/
