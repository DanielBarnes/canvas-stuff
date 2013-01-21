// setup mini_canvas
var mini_canvas = document.getElementById("mini_canvas");
var mini_context = mini_canvas.getContext("2d");

//setup main_canvas
var main_canvas = document.getElementById("main_canvas");
var main_context = main_canvas.getContext("2d");
// css makes the size of canvas funky so you have to fix it
main_canvas.height = main_canvas.clientHeight;
main_canvas.width = main_canvas.clientWidth;
console.log(main_canvas);

// setup the drawing_canvas
var drawing_canvas = document.getElementById("drawing");
var context = drawing_canvas.getContext("2d");
// css makes the size of canvas funky so you have to fix it
drawing_canvas.height = drawing_canvas.clientHeight;
drawing_canvas.width = drawing_canvas.clientWidth;
console.log(drawing_canvas);


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
    //update the main canvas
    main_context.drawImage(drawing_canvas, 0, 0);
    //scale and draw the mini canvas
    mini_context.save();
    // white background so the main canvas can't cover it
    mini_context.fillStyle = "#FFF";
    mini_context.fillRect(0,0, mini_canvas.width, mini_canvas.height);
    // scale the main canvas a draw
    mini_context.scale(mini_canvas.width / main_canvas.width, mini_canvas.height / main_canvas.height);
    mini_context.drawImage(main_canvas, 0, 0);
    mini_context.restore();
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
