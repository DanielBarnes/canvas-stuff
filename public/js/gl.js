var canvas = document.getElementById('drawing');
canvas.height = canvas.clientHeight;
canvas.width = canvas.clientWidth;
var gl = canvas.getContext('experimental-webgl');

gl.clearColor(0.0, 0.0, 0.0, 0.0);
gl.clear(gl.COLOR_BUFFER_BIT);

var vertexPosBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, vertexPosBuffer);
var vertices = [
    -0.5, -0.5,
    -0.5, 0.5,
    0.5, 0.5,
    0.5, -0.5
];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);


var vs = 'attribute vec2 pos;' + 'void main() { gl_Position = vec4(pos, 0, 1); }';
var fs = 'precision mediump float;' + 'void main() { gl_FragColor = vec4(0,0,0,1); }';

var program = createProgram(vs,fs);
gl.useProgram(program);

program.vertexPosAttrib = gl.getAttribLocation(program, 'pos');

gl.enableVertexAttribArray(program.vertexPosAttrib);

gl.vertexAttribPointer(program.vertexPosAttrib, 2, gl.FLOAT, false, 0, 0);

gl.drawArrays(gl.LINE_LOOP, 0, 4);

function createProgram(vstr, fstr) {
    var program = gl.createProgram();
    var vshader = createShader(vstr, gl.VERTEX_SHADER);
    var fshader = createShader(fstr, gl.FRAGMENT_SHADER);
    gl.attachShader(program, vshader);
    gl.attachShader(program, fshader);
    gl.linkProgram(program);
    return program;
}

function createShader(str, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    return shader;
}


console.log(gl);
console.log(new Float32Array());
window.onerror = function () {
    console.log('ERROR:', arguments);
};
