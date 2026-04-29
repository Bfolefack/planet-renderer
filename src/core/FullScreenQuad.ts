export class FullScreenQuad {
    private vao: WebGLVertexArrayObject;

    constructor(private gl: WebGL2RenderingContext) {
        // Define a full-screen quad (triangle strip with positions and UVs)
        // Triangle strip lets us skip index buffer and draw with 4 vertices
        const vertices = new Float32Array([
            // Positions   // UVs
            -1, -1,        0, 0,
             1, -1,        1, 0,
            -1,  1,        0, 1,
             1,  1,        1, 1,
        ]);
        this.vao = gl.createVertexArray()!;
        const vbo = gl.createBuffer()!;
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        // Position attribute (vec2)
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 4 * 4, 0);
        // UV attribute (vec2)
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 4 * 4, 2 * 4);
        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    draw() {
        this.gl.bindVertexArray(this.vao);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.gl.bindVertexArray(null);
    }
}