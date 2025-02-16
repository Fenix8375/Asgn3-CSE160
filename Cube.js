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

    renderfast() {
        var rgba = this.color;
    
        gl.uniform1i(u_whichTexture, this.textureNum);
        gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
        gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
        var allverts = [];
    
        // Front face
        allverts = allverts.concat([
            0, 0, 0, 0, 0,   // Bottom-left
            1, 0, 0, 1, 0,   // Bottom-right
            1, 1, 0, 1, 1,   // Top-right
            0, 0, 0, 0, 0,   // Bottom-left
            1, 1, 0, 1, 1,   // Top-right
            0, 1, 0, 0, 1    // Top-left
        ]);
    
        // Back face
        allverts = allverts.concat([
            1, 0, 1, 0, 0,   // Bottom-right
            0, 0, 1, 1, 0,   // Bottom-left
            0, 1, 1, 1, 1,   // Top-left
            1, 0, 1, 0, 0,   // Bottom-right
            0, 1, 1, 1, 1,   // Top-left
            1, 1, 1, 0, 1    // Top-right
        ]);
    
        // Top face
        allverts = allverts.concat([
            0, 1, 0, 0, 0,   // Top-left front
            1, 1, 0, 1, 0,   // Top-right front
            1, 1, 1, 1, 1,   // Top-right back
            0, 1, 0, 0, 0,   // Top-left side
            1, 1, 1, 1, 1,   // Top-right back
            0, 1, 1, 0, 1    // Top-left back
        ]);
    
        // Bottom face
        allverts = allverts.concat([
            0, 0, 1, 0, 0,   // Bottom-left back
            1, 0, 1, 1, 0,   // Bottom-right back
            1, 0, 0, 1, 1,   // Bottom-right side
            0, 0, 1, 0, 0,   // Bottom-left back
            1, 0, 0, 1, 1,   // Bottom-right side
            0, 0, 0, 0, 1    // Bottom-left side
        ]);
    
        // Right face
        allverts = allverts.concat([
            1, 0, 0, 0, 0,   // Bottom-right side
            1, 0, 1, 1, 0,   // Bottom-right back
            1, 1, 1, 1, 1,   // Top-right back
            1, 0, 0, 0, 0,   // Bottom-right side
            1, 1, 1, 1, 1,   // Top-right back
            1, 1, 0, 0, 1    // Top-right side
        ]);
    
        // Left face
        allverts = allverts.concat([
            0, 0, 1, 0, 0,   // Bottom-left back
            0, 0, 0, 1, 0,   // Bottom-left side
            0, 1, 0, 1, 1,   // Top-left side
            0, 0, 1, 0, 0,   // Bottom-left back
            0, 1, 0, 1, 1,   // Top-left side
            0, 1, 1, 0, 1    // Top-left back
        ]);
    
        drawTriangle3D2(allverts);
    
    }
}
