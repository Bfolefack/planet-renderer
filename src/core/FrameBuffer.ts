export interface AttachmentSpec {
    name: string;
    internalFormat: number;
    format: number;
    type: number;
}

export class FrameBuffer {
    readonly fbo: WebGLFramebuffer;
    private colorTextures: Map<string, WebGLTexture>;
    private depthTexture: WebGLTexture | null = null;
    private colorAttachments: number[] = [];

    constructor(
        private gl: WebGL2RenderingContext,
        public width: number,
        public height: number,
        private colorSpecs: AttachmentSpec[],
        private depthSpec?: AttachmentSpec
    ) {
        // Create framebuffer
        const fbo = gl.createFramebuffer();
        if (!fbo) {
            throw new Error("Unable to create framebuffer");
        }
        this.fbo = fbo;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.fbo);

        // Create and attach color textures
        this.colorTextures = new Map();
        colorSpecs.forEach((spec, index) => {
            const texture = gl.createTexture();
            if (!texture) {
                throw new Error(`Unable to create color texture for attachment ${spec.name}`);
            }
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, spec.internalFormat, width, height, 0, spec.format, spec.type, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + index, gl.TEXTURE_2D, texture, 0);
            this.colorTextures.set(spec.name, texture);
            this.colorAttachments.push(gl.COLOR_ATTACHMENT0 + index);

            console.log(`Attaching ${spec.name}:`, {
                internalFormat: spec.internalFormat.toString(16),
                format: spec.format.toString(16),
                type: spec.type.toString(16),
                width, height,
                glError: gl.getError().toString(16)
            });

            // Check framebuffer status after attaching each texture
            const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
            if (status !== gl.FRAMEBUFFER_COMPLETE) {
                throw new Error(`Framebuffer incomplete after attaching color texture ${spec.name}: ${this.getFramebufferStatusMessage(status)}`);
            }
        });

        // Create and attach depth texture if specified
        if (depthSpec) {
            const texture = gl.createTexture();
            if (!texture) {
                throw new Error(`Unable to create depth texture for attachment ${depthSpec.name}`);
            }
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, depthSpec.internalFormat, width, height, 0, depthSpec.format, depthSpec.type, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, texture, 0);
            this.depthTexture = texture;
            
        }
        
        // Enable draw buffers for multiple color attachments
        if (this.colorAttachments.length > 0) {
            gl.drawBuffers(this.colorAttachments);
        }

        const finalStatus = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (finalStatus !== gl.FRAMEBUFFER_COMPLETE) {
            throw new Error(`Framebuffer incomplete after setup: ${this.getFramebufferStatusMessage(finalStatus)}`);
        }
        
        // Unbind framebuffer and texture
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    bind() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.fbo);
        this.gl.viewport(0, 0, this.width, this.height);
    }

    bindDefault() {
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    }

    getColorTexture(name: string): WebGLTexture {
        const texture = this.colorTextures.get(name);
        if (!texture) {
            throw new Error(`No color texture found for attachment name: ${name}`);
        }
        return texture;
    } 

    getDepthTexture(): WebGLTexture | null {
        return this.depthTexture;
    }

    resize(width: number, height: number): void {
        this.width = width;
        this.height = height;
        this.bind();
        // Resize color textures
        this.colorTextures.forEach((texture, name) => {
            const spec = this.colorSpecs.find(s => s.name === name);
            if (spec) {
                this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
                this.gl.texImage2D(this.gl.TEXTURE_2D, 0, spec.internalFormat, width, height, 0, spec.format, spec.type, null);
            }
        });
        // Resize depth texture if it exists
        if (this.depthTexture && this.depthSpec) {
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.depthTexture);
            this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.depthSpec.internalFormat, width, height, 0, this.depthSpec.format, this.depthSpec.type, null);
        }
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    }

    dispose() {
        this.colorTextures.forEach(texture => this.gl.deleteTexture(texture));
        if (this.depthTexture) {
            this.gl.deleteTexture(this.depthTexture);
        }
        this.gl.deleteFramebuffer(this.fbo);
    }

    private getFramebufferStatusMessage(status: number): string {
        switch (status) {
            case this.gl.FRAMEBUFFER_COMPLETE:
                return "FRAMEBUFFER_COMPLETE";
            case this.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                return "FRAMEBUFFER_INCOMPLETE_ATTACHMENT";
            case this.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                return "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";
            case this.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                return "FRAMEBUFFER_INCOMPLETE_DIMENSIONS";
            case this.gl.FRAMEBUFFER_UNSUPPORTED:
                return "FRAMEBUFFER_UNSUPPORTED";
            default:
                return `Unknown framebuffer status: ${status}`;
        }
    }
}