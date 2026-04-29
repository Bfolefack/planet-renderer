interface VertexAttribute {
    name: string;
    location: number;
    components: number;
    type: number;
    offsetBytes: number;
}

export class Mesh {
    private vao: WebGLVertexArrayObject;
    private vbo: WebGLBuffer;
    private ibo: WebGLBuffer;
    private indexCount: number;
    private indexType: number;

    constructor(
        private gl: WebGL2RenderingContext,
        vertices: Float32Array,
        indices: Uint16Array | Uint32Array | null,
        strideBytes: number,
        attributes: VertexAttribute[]
    ) {
        this.vao = gl.createVertexArray()!;
        this.vbo = gl.createBuffer()!;
        gl.bindVertexArray(this.vao);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        attributes.forEach(attr => {
            gl.enableVertexAttribArray(attr.location);
            gl.vertexAttribPointer(attr.location, attr.components, attr.type, false, strideBytes, attr.offsetBytes);
        });
        if (indices) {
            this.ibo = gl.createBuffer()!;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ibo);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
            this.indexCount = indices.length;
            this.indexType = indices instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;
        } else {
            this.ibo = null as any;
            this.indexCount = vertices.length / (strideBytes / 4);
            this.indexType = 0;
        }

        this.indexCount = indices ? indices.length : vertices.length / (strideBytes / 4);
        this.indexType = indices instanceof Uint32Array ? gl.UNSIGNED_INT : gl.UNSIGNED_SHORT;

        gl.bindVertexArray(null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        if (indices) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        }
    }

    draw() {
        this.gl.bindVertexArray(this.vao);
        if (this.ibo) {
            this.gl.drawElements(this.gl.TRIANGLES, this.indexCount, this.indexType, 0);
        } else {
            this.gl.drawArrays(this.gl.TRIANGLES, 0, this.indexCount);
        }
        this.gl.bindVertexArray(null);
    }

    dispose() {
        this.gl.deleteBuffer(this.vbo);
        if (this.ibo) {
            this.gl.deleteBuffer(this.ibo);
        }
        this.gl.deleteVertexArray(this.vao);
    }
}