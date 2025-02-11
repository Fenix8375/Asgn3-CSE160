var VSHADER_SOURCE = `
    precision mediump float;
    attribute vec4 a_Position;
    attribute vec2 a_UV;
    varying vec2 v_UV;
    uniform mat4 u_ModelMatrix;
    uniform mat4 u_GlobalRotateMatrix;
    uniform mat4 u_ViewMatrix;
    uniform mat4 u_ProjectionMatrix;
    void main() {
        gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
        v_UV = a_UV;
    }`;


    var FSHADER_SOURCE = `
    precision mediump float;
    varying vec2 v_UV;
    uniform vec4 u_FragColor;
    uniform sampler2D u_Sampler0;
    uniform sampler2D u_Sampler1;
    uniform sampler2D u_Sampler2;
    uniform int u_whichTexture;

    void main() {
        if (u_whichTexture == -2) {
            gl_FragColor = u_FragColor;
        } else if (u_whichTexture == -1) {
            gl_FragColor = vec4(v_UV, 1.0, 1.0);
        } else if (u_whichTexture == 0) {
            gl_FragColor = texture2D(u_Sampler0, v_UV);
        } else if (u_whichTexture == 1) {
            gl_FragColor = texture2D(u_Sampler1, v_UV);
        } else if (u_whichTexture == 2) {
            gl_FragColor = texture2D(u_Sampler2, v_UV);
        } else {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); 
        }
    }`;



// Global Variables for WebGL
let canvas = 0;
let gl = 0;
let a_Position = 0;
let a_UV = 0; 
let u_FragColor = 0; 
let u_ModelMatrix = 0;
let u_GlobalRotateMatrix = 0; 
let u_ProjectionMatrix = 0; 
let u_ViewMatrix = 0; 
let u_Sampler0 = 0;
let u_whichTexture = 0;
let g_globalAngle = 0;



function setupWebGL() {
    canvas = document.getElementById('webgl');
    gl = canvas.getContext("webgl", { preserveDrawingBuffer: true });

    if (!gl) {
        console.error("WebGL context failed to initialize!");
        return;
    }

    gl.enable(gl.DEPTH_TEST);
}

// Shader Debugging Function
function initShadersWithLogging(gl, vshader, fshader) {
    var program = createProgram(gl, vshader, fshader);
    if (!program) {
        console.error('Failed to create program');
        return false;
    }
    gl.useProgram(program);
    gl.program = program;

    return true;
}

function connectVariablesToGLSL() {
    if (!initShadersWithLogging(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Shader initialization failed.');
        return;
    }

    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    a_UV = gl.getAttribLocation(gl.program, "a_UV");
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
    u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, "u_GlobalRotateMatrix");
    u_ProjectionMatrix = gl.getUniformLocation(gl.program, "u_ProjectionMatrix");
    u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
    u_Sampler0 = gl.getUniformLocation(gl.program, "u_Sampler0");
    u_Sampler1 = gl.getUniformLocation(gl.program, "u_Sampler1");
    u_Sampler2 = gl.getUniformLocation(gl.program, "u_Sampler2");
    u_whichTexture = gl.getUniformLocation(gl.program, "u_whichTexture");

    if (
        a_Position < 0 || a_UV < 0 || !u_FragColor ||
        !u_ModelMatrix || !u_GlobalRotateMatrix ||
        !u_ProjectionMatrix || !u_ViewMatrix ||
        !u_Sampler0 || !u_whichTexture
    ) {
        console.error("Error getting shader variable locations");
        return;
    }

    var identity_Matrix = new Matrix4();
    gl.uniformMatrix4fv(u_ModelMatrix, false, identity_Matrix.elements);

    // Explicitly enable attributes
    gl.enableVertexAttribArray(a_Position);
    gl.enableVertexAttribArray(a_UV);
}

function initTextures() {
    let image0 = new Image();
    let image1 = new Image();
    let image2 = new Image();

    image0.onload = function () {
        sendTextureToGLSL(0, u_Sampler0, image0);
    };
    image1.onload = function () {
        sendTextureToGLSL(1, u_Sampler1, image1);
    };

    image2.onload = function () {
        sendTextureToGLSL(2, u_Sampler2, image2);
    };
    

    image0.src = "GoodSky.png"; 
    image1.src = "fire.jpg";
    image2.src = "dirt.jpg";
}



function sendTextureToGLSL(n, u_Sampler, image) {
    let texture = gl.createTexture();
    if (!texture) {
        console.error("Failed to create texture object");
        return false;
    }

    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.activeTexture(gl.TEXTURE0 + n);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, n);

    console.log(`Texture ${n} Loaded:`, gl.getParameter(gl.TEXTURE_BINDING_2D));
}



function addActionsForHtmlUI(){

    document.getElementById("angleSlide").addEventListener("mousemove", function() {g_globalAngle = this.value; renderScene(); });
    document.addEventListener("keydown", function(event) {
        switch (event.key) {
            case "w": g_camera.moveForward(); break;
            case "s": g_camera.moveBackwards(); break;
            case "a": g_camera.moveLeft(); break;
            case "d": g_camera.moveRight(); break;
            case "q": g_camera.panLeft(); break;
            case "e": g_camera.panRight(); break;
            case "ArrowLeft": g_camera.rotateLeftRight(-5); break;
            case "ArrowRight": g_camera.rotateLeftRight(5); break;
            case "ArrowUp": g_camera.rotateUpDown(-5); break;
            case "ArrowDown": g_camera.rotateUpDown(5); break;
        }
        renderScene();
    });
    
}

function main() {
    setupWebGL();
    g_camera = new Camera(canvas);
    connectVariablesToGLSL();
    initTextures();
    addActionsForHtmlUI();


    document.onkeydown = keydown;

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    renderScene();
}


function keydown(ev){


    if(ev.keyCode == 39){ //Right Arrow Key

        g_eye[0] += 0.2;

    }else{
        
        if(ev.keyCode == 37){ //Left Arrow Key

            g_eye[0] -=0.2;
        }
    }

    renderScene();
    console.log(ev.keyCode);

}

// var g_eye = [0,0,3];

// var g_at = [0,0,-100];

// var g_up = [0,1,0];

var g_map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 0, 0, 0, 0, 1],
    [1, 0, 1, 0, 0, 0, 1, 0, 0, 1],
    [1, 0, 0, 1, 1, 0, 0, 0, 0, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 1],
    [1, 1, 0, 0, 0, 1, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

function drawMap(){
    for(var x = 0; x < g_map.length; x++){
        for(var y = 0; y < g_map[x].length; y++){

            if (g_map[x][y] == 1){
                var blocks = new Cube();
                blocks.color = [1, 1, 1, 1];
                blocks.textureNum = 2;
                blocks.matrix.translate(x - g_map.length/2, -0.75, y - g_map[x].length/2);
                gl.uniform1i(u_whichTexture, blocks.textureNum);
                blocks.renderfast();
            }

        }
    }
}




function renderScene() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);

    var projMat = new Matrix4();
    projMat.setPerspective(50, 1 * canvas.width/canvas.height, 1 ,100);
    gl.uniformMatrix4fv(u_ProjectionMatrix, false, g_camera.projectionMatrix.elements);

    var viewMat = new Matrix4();
    // viewMat.setLookAt(g_eye[0], g_eye[1], g_eye[2],   g_at[0], g_at[1], g_at[2],    g_up[0], g_up[1], g_up[2]); //eye, at, up 

    viewMat.setLookAt(g_camera.eye.x, g_camera.eye.y, g_camera.eye.z,
        g_camera.at.x, g_camera.at.y, g_camera.at.z,
        g_camera.up.x, g_camera.up.y, g_camera.up.z)


    gl.uniformMatrix4fv(u_ViewMatrix, false, g_camera.viewMatrix.elements);


    var globalRotMat = new Matrix4().rotate(g_globalAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);



    //Floor

    var floor = new Cube();
    floor.color = [1.0, 0.0, 0.0, 1.0];
    floor.textureNum = -1;
    floor.matrix.translate(0, -.75, 0.0);
    floor.matrix.scale(10, 0 ,10);
    floor.matrix.translate(-0.5, 0, -0.5);
    floor.render();

    //Sky

    var sky = new Cube();
    sky.color = [0.529, 0.808, 0.922, 1.0];
    sky.textureNum = -2;
    sky.matrix.scale(50,50,50);
    sky.matrix.translate(-0.5, -0.5, -0.5);
    sky.render();

    drawMap();

    // var body = new Cube();
    // body.color = [1.0, 0.0, 0.0, 1.0];
    // body.textureNum = -1;
    // body.matrix.rotate(-5, 1, 0, 0);
    // body.matrix.scale(0.5, 0.3, 0.5);
    // body.render();

    // var yellow = new Cube();

    // yellow.color = [1,1,0,1];
    // yellow.matrix.setTranslate(0, -.5, 0.0);
    // yellow.matrix.rotate(-5,1,0,0);
    // var yellowCoords = new Matrix4(yellow.matrix);
    // yellow.matrix.scale(0.25, .7, .5);
    // yellow.matrix.translate(-.5,0,0);
    // yellow.render();
}
