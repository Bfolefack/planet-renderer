import { PerlinWorley } from "./PerlinWorley";

export class NoiseVolume {
    readonly texture: WebGLTexture;
    readonly resolution: number;

    constructor (gl: WebGL2RenderingContext, resolution: number = 64) {
        this.resolution = resolution;

        const startTime = performance.now();
        const data = PerlinWorley.generate(resolution);
        const endTime = performance.now();
        console.log(`Generated FBM Worley noise volume in ${(endTime - startTime).toFixed(2)} ms`);

        const tex = gl.createTexture();
        if (!tex) {
            throw new Error('Failed to create texture');
        }

        gl.bindTexture(gl.TEXTURE_3D, tex);
        gl.texImage3D(
            gl.TEXTURE_3D,
            0,
            gl.RGBA8,
            resolution,
            resolution,
            resolution,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            data
        )
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.REPEAT);

        this.texture = tex;
    }
}