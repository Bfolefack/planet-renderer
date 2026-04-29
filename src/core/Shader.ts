export class Shader {
    readonly program: WebGLProgram;
    private uniformLocations: Map<string, WebGLUniformLocation|null>;
    private nullUniformLocations: Set<string>;
    private attributeLocations: Map<string, number>;

    constructor(
        private gl: WebGL2RenderingContext,
        vsSource: string,
        fsSource: string
    ) {
        // Compile vertex shader
        const vertexShader = this.compileShader(vsSource, gl.VERTEX_SHADER);
        // Compile fragment shader
        const fragmentShader = this.compileShader(fsSource, gl.FRAGMENT_SHADER);

        // Link shaders into a program
        try {
            this.program = this.linkProgram(vertexShader, fragmentShader);
        } catch (error) {
            console.error("Error linking shader program:", error);
            throw error;
        }

        // Clean up shaders (they are no longer needed after linking)
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        
        // Initialize uniform and attribute location maps
        this.uniformLocations = new Map();
        this.attributeLocations = new Map();
        this.nullUniformLocations = new Set();

        // Cache uniform locations    
        const numUniforms = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < numUniforms; i++) {
            const uniformInfo = gl.getActiveUniform(this.program, i);
            if (uniformInfo) {
                const location = gl.getUniformLocation(this.program, uniformInfo.name);
                this.uniformLocations.set(uniformInfo.name, location);
            }
        }

        // Cache attribute locations
        const numAttributes = gl.getProgramParameter(this.program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < numAttributes; i++) {
            const attributeInfo = gl.getActiveAttrib(this.program, i);
            if (attributeInfo) {
                const location = gl.getAttribLocation(this.program, attributeInfo.name);
                this.attributeLocations.set(attributeInfo.name, location);
            }
        }
    }

    private compileShader(source: string, type: number): WebGLShader {
        const gl = this.gl;
        const shader = gl.createShader(type);
        if (!shader) {
            throw new Error("Unable to create shader");
        }
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            const info = gl.getShaderInfoLog(shader);
            gl.deleteShader(shader);
            // Log the shader source with line numbers for easier debugging
            const numberedSource = source.split('\n').map((line, index) => `${index + 1}: ${line}`).join('\n');
            console.error(`Error compiling shader:\n${numberedSource}\nInfo log:\n${info}`);
            throw new Error(`Error compiling shader: ${info}`);
        }

        return shader;
    }

    private linkProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
        const gl = this.gl;
        const program = gl.createProgram();
        if (!program) {
            throw new Error("Unable to create shader program");
        }
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            const info = gl.getProgramInfoLog(program);
            gl.deleteProgram(program);
            const vertexSource = gl.getShaderSource(vertexShader);
            const fragmentSource = gl.getShaderSource(fragmentShader);
            console.error(`Error linking program:\nVertex Shader:\n${vertexSource}\nFragment Shader:\n${fragmentSource}\nInfo log:\n${info}`);
            throw new Error(`Error linking shader program: ${info}`);
        }

        return program;
    }

    use(): void {
        this.gl.useProgram(this.program);
    }

    //Shortcut for use() + setting uniforms, to reduce boilerplate when setting up shader state for rendering
    //TODO: this isn't ready for use yet, I'll have to see how it works in practice and probably iterate on the API a bit
    bind(uniforms: { [key: string]: number | Float32Array | WebGLTexture }): void {
        this.use();
        for (const [name, value] of Object.entries(uniforms)) {
            if (value instanceof WebGLTexture) {
                this.setTexture(name, value);
            } else if (value instanceof Float32Array) {
                // Heuristic: if length is 16, assume it's a mat4; if 4, assume vec4; if 3, vec3; if 2, vec2
                if (value.length === 16) {
                    this.setMat4(name, value);
                } else if (value.length === 4) {
                    this.setVec4(name, value);
                } else if (value.length === 3) {
                    this.setVec3(name, value);
                } else if (value.length === 2) {
                    this.setVec2(name, value);
                } else {
                    console.warn(`Warning: Unrecognized uniform value for '${name}'. Expected Float32Array of length 2, 3, 4, or 16.`);
                }
            } else if (typeof value === 'number') {
                // Heuristic: if the uniform name contains "texture" or "sampler", assume it's a texture unit index; otherwise, assume it's a float
                // TODO: This is fuzzy, but it'll force me to keep a convention
                if (name.toLowerCase().includes("texture") || name.toLowerCase().includes("sampler")) {
                    this.setTexture(name, value as unknown as WebGLTexture, value as number);
                } else {
                    this.setFloat(name, value as number);
                }
            } else {
                console.warn(`Warning: Unrecognized uniform value type for '${name}'. Expected number, Float32Array, or WebGLTexture.`);
            }
        }
    }

    setMat4(name: string, value: Float32Array): void {
        this.gl.uniformMatrix4fv(this.getUniformLocation(name), false, value);
    }

    setVec4(name: string, value: Float32Array | [number, number, number, number]): void {
        this.gl.uniform4fv(this.getUniformLocation(name), value);
    }

    setVec3(name: string, value: Float32Array | [number, number, number]): void {
        this.gl.uniform3fv(this.getUniformLocation(name), value);
    }

    setVec2(name: string, value: Float32Array | [number, number]): void {
        this.gl.uniform2fv(this.getUniformLocation(name), value);
    }

    setFloat(name: string, value: number): void {
        this.gl.uniform1f(this.getUniformLocation(name), value);
    }

    setInt(name: string, value: number): void {
        this.gl.uniform1i(this.getUniformLocation(name), value);
    }

    // Sets a texture uniform. Automatically manages texture units.
    // NOTE: Keep a consistent convention for texture unit management to avoid conflicts.
    // NOTE: NOTE: That means you Boueny
    setTexture(
        name: string,
        texture: WebGLTexture,
        unit: number = 0,
        target: number = this.gl.TEXTURE_2D
    ): void {
        const location = this.getUniformLocation(name);
        if (location) {
            this.gl.activeTexture(this.gl.TEXTURE0 + unit);
            this.gl.bindTexture(target, texture);
            this.gl.uniform1i(location, unit);
        }
    }

    private getUniformLocation(name: string): WebGLUniformLocation | null {
        if (!this.uniformLocations.has(name)) {
            const location = this.gl.getUniformLocation(this.program, name);
            this.uniformLocations.set(name, location);
            if (location === null) {
                if(!this.nullUniformLocations.has(name)) {
                    console.warn(`Warning: Uniform '${name}' not found in shader program.\nIt may be optimized out if it's not used in the shader code.`);
                    this.nullUniformLocations.add(name);
                }
            }
        }
        return this.uniformLocations.get(name)!;
    }

    //TODO: maybe deprecated, explicit attribute location management is usually better for performance and clarity
    getAttributeLocation(name: string): number {
        return this.attributeLocations.get(name) ?? -1;
    }
}