class Cube {
    constructor() {
        this.type = "cube";
        this.color = [1.0, 1.0, 1.0, 1.0];
        this.matrix = new Matrix4();
        this.textureNum = -1;
    }

    render() {
        var rgba = this.color;

        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        // Front face
        drawTriangle3DUV([0, 0, 0,   1, 1, 0,   1, 0, 0], [0, 0,   1, 1,   1, 0]);
        drawTriangle3DUV([0, 0, 0,   0, 1, 0,   1, 1, 0], [0, 0,   0, 1,   1, 1]);

        gl.uniform4f(u_FragColor, rgba[0]*.9, rgba[1]*.9, rgba[2]*.9, rgba[3]);

        // Top face
        drawTriangle3DUV([0, 1, 0,   0, 1, 1,   1, 1, 1], [0, 0,  0, 1 , 1, 1]);
        drawTriangle3DUV([0, 1, 0,   1, 1, 1,   1, 1, 0], [0, 0,  1, 1,  1, 0]);

        gl.uniform4f(u_FragColor, rgba[0]*.8, rgba[1]*.8, rgba[2]*.8, rgba[3]);

        // Right face
        drawTriangle3D([1, 1, 0,  1, 1, 1,  1, 0, 0]);
        drawTriangle3D([1, 0, 0,  1, 1, 1,   1, 0, 1]);

        gl.uniform4f(u_FragColor, rgba[0]*.7, rgba[1]*.7, rgba[2]*.7, rgba[3]);

        // Left face
        drawTriangle3D([0, 1, 0,   0, 1, 1,  0, 0, 0]);
        drawTriangle3D([0, 0, 0,   0, 1, 1,   0, 0, 1]);

        gl.uniform4f(u_FragColor, rgba[0]*.6, rgba[1]*.6, rgba[2]*.6, rgba[3]);

        // Bottom face
        drawTriangle3D([0, 0, 0,   0, 0, 1,   1, 0, 1]);
        drawTriangle3D([0, 0, 0,   1, 0, 1,   1, 0, 0]);

        gl.uniform4f(u_FragColor, rgba[0]*.5, rgba[1]*.5, rgba[2]*.5, rgba[3]);

        // Back face
        drawTriangle3D([0, 0, 1,   1, 1, 1,   1, 0, 1]);
        drawTriangle3D([0, 0, 1,   0, 1, 1,   1, 1, 1]);

    }

    renderfast(){

        var rgba = this.color;

        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

        var allverts = [];

        //Front of cube

        allverts=allverts.concat([0, 0, 0,   1, 1, 0,   1, 0, 0]);
        allverts=allverts.concat([0, 0, 0,   0, 1, 0,   1, 1, 0]);

        //Top of cube

        allverts=allverts.concat([0, 1, 0,   0, 1, 1,   1, 1, 1]);
        allverts=allverts.concat([0, 1, 0,   1, 1, 1,   1, 1, 0]);

        //Right of cube

        allverts=allverts.concat([1, 1, 0,  1, 1, 1,  1, 0, 0]);
        allverts=allverts.concat([1, 0, 0,  1, 1, 1,   1, 0, 1]);

        //Left of cube

        allverts=allverts.concat([0, 1, 0,   0, 1, 1,  0, 0, 0]);
        allverts=allverts.concat([0, 0, 0,   0, 1, 1,   0, 0, 1]);

        //Bottom of cube

        allverts=allverts.concat([0, 0, 0,   0, 0, 1,   1, 0, 1]);
        allverts=allverts.concat([0, 0, 0,   1, 0, 1,   1, 0, 0]);

        //Back of cube

        allverts=allverts.concat([0, 0, 1,   1, 1, 1,   1, 0, 1]);
        allverts=allverts.concat([0, 0, 1,   0, 1, 1,   1, 1, 1]);

        drawTriangle3D(allverts);



    }
}
