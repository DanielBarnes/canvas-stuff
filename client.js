//view/models
var Tools = Backbone.Model.extend({
    defauts: {
        active: "nothing"
    },
    getTool: function () {
        return this.get("active");
    },
    setTool: function (tool) {
        this.set({ active: tool });
    }
});

var ToolsView = Backbone.View.extend({
    render: function () {
        this.$el.html(templatizer.tools());
        return this.el;
    },
    events: {
        "click": function (event) {
            console.log("click event");
            console.log(event.target.id);
            $("#nothing").removeClass("tool_focus");
            $("#" + this.model.get("active")).removeClass("tool_focus");
            $("#" + event.target.id).addClass("tool_focus");
            this.model.setTool(event.target.id);
        }
    }
});

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

// setup the large map
var map = document.createElement("canvas");
map.height = 3000;
map.width = 4000;
var map_context = map.getContext("2d");

//Screen object to keep track of where you are
var screen = {
    x: 0,
    y: 0,
    impactBottom: map.height - main_canvas.height,
    impactSide: map.width - main_canvas.width,
    canMove: function (ajustX, ajustY) {
        if (this.x - ajustX > 0 && this.x - ajustX < this.impactSide && this.y - ajustY > 0 && this.y - ajustY < this.impactBottom) {
            return true;
        } else {
            return false;
        }
    },
    prevX: null,
    prevY: null,
    move: function (event) {
        if (this.prevX === null || this.prevY === null) {
            this.prevX = getX(event);
            this.prevY = getY(event);
            return;
        }
        //get the changes in to the x and y values
        var cx = getX(event) - this.prevX;
        var cy = getY(event) - this.prevY;

        //test the move and make it, if possible
        if (this.canMove(cx, cy)) {
            this.x -= cx;
            this.y -= cy;

            //update the screens
            update_screen_view();

            //update the prev x, y values
            this.prevX = getX(event);
            this.prevY = getY(event);
        }
    },
    resetMovement: function () {
        this.prevX = null;
        this.prevY = null;
    }
};


// drawing_canvas Events
var isMouseDown = false;
var shape;
drawing_canvas.onmousedown = function (event) {
    console.log("mousedown on #drawing");
    isMouseDown = true;
    if (tools.getTool() === "rectangle") {
        shape = { x: getX(event), y: getY(event) };
    } else if (tools.getTool() === "line") {
        shape =  [{ x: getX(event), y: getY(event) }];
        context.beginPath();
        context.moveTo(shape[0].x, shape[0].y);
    } else if (tools.getTool() === "box_brush") {
        shape = null;
        context.fillRect(getX(event), getY(event), 10, 10);
    } else if (tools.getTool() === "nothing") {
        return;
    }
};

drawing_canvas.onmousemove = function (event) {
    if (isMouseDown) {
        if (tools.getTool() === "rectangle") {
            clear();
            shape.w = getX(event) - shape.x;
            shape.h = getY(event) - shape.y;
            context.fillRect(shape.x, shape.y, shape.w, shape.h);
        } else if (tools.getTool() === "line") {
            clear();
            context.lineTo(getX(event), getY(event));
            shape.push({ x: getX(event), y: getY(event) });
            drawLine(shape);
        } else if (tools.getTool() === "box_brush") {
            context.fillRect(getX(event), getY(event), 10, 10);
        } else if (tools.getTool() === "nothing") {
            screen.move(event);
        }
    } else {

    }
};

drawing_canvas.onmouseup = function (event) {
    console.log("mouse up on #drawing");
    console.log({width: drawing_canvas.width, height: drawing_canvas.height});
    console.log(shape);
    if (tools.getTool() === "line") {
        context.stroke();
    } else if (tools.getTool() === "nothing") {
        screen.resetMovement();
    }
    update();
    clear();
    isMouseDown = false;
};

// tool selector
var tools = new Tools();
var tool_view = new ToolsView({model: tools});
$("#top").append(tool_view.render());

// helpers
function update() {
    //update the main canvas
    map_context.drawImage(drawing_canvas, screen.x, screen.y);

    //update the mini map
    update_mini();

    //draw your current screen of the map to the main_canvas
    update_screen_view();
}
function update_mini() {
    var xScale = mini_canvas.width / map.width;
    var yScale = mini_canvas.height / map.height;
    //scale and draw the mini canvas
    mini_context.save();
    // white background so the main canvas can't cover it
    mini_context.fillStyle = "#FFF";
    mini_context.fillRect(0,0, mini_canvas.width, mini_canvas.height);
    // scale the main canvas a draw
    mini_context.scale(xScale, yScale);
    mini_context.drawImage(map, 0, 0);
    mini_context.restore();
    draw_mini_screen_box();
}
function draw_mini_screen_box() {
    // save and draw the main_canvas out line
    mini_context.save();
    mini_context.strokeStyle = '#158FE0';
    mini_context.lineWidth = 1;
    mini_context.strokeRect(screen.x * (mini_canvas.width / map.width), screen.y * (mini_canvas.height / map.height), main_canvas.width * (mini_canvas.width / map.width), main_canvas.height * (mini_canvas.height / map.height));
    mini_context.restore();
}
function update_screen_view() {
    clear(main_context, main_canvas.width, main_canvas.height);
    //draw you current screen of the map to the main_canvas
    main_context.drawImage(map, screen.x, screen.y, main_canvas.width, main_canvas.height, 0, 0, main_canvas.width, main_canvas.height);
    update_mini();
}
function clear(ctx, width, height) {
    if (ctx) {
        ctx.clearRect(0, 0, width, height);
    } else {
        context.clearRect(0,0,drawing_canvas.width, drawing_canvas.height);
    }
}
function getX(event) {
    return event.clientX - $(".main")[0].offsetLeft;
}
function getY(event) {
    return event.clientY - drawing_canvas.offsetTop;
}
function drawLine(points) {
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }
    context.stroke();
}

// control the connection status icon label thingy
function status_offline() {
    $("#connection_status").removeClass("online");
    $("#connection_status").addClass("offline");
    $("#connection_status").text("offline");
}
function status_online() {
    $("#connection_status").removeClass("offline");
    $("#connection_status").addClass("online");
    $("#connection_status").text("online");
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
