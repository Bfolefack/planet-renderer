import { mat4, vec3 } from "gl-matrix";

export class Camera {
    position = vec3.fromValues(0, 0, 5); // Start slightly away from origin to avoid clipping with near plane
    yaw = 0;   // Rotation around Y axis
    pitch = 0; // Rotation around X axis

    // Projection parameters
    fov = Math.PI / 3; // 60 degrees
    aspect = 16 / 9;
    near = 0.1
    far = 100000.0;

    readonly viewMatrix = mat4.create();
    readonly projectionMatrix = mat4.create()
    readonly viewProjectionMatrix = mat4.create();
    readonly forward = vec3.create();
    readonly right = vec3.create()
    readonly up = vec3.create();

    update(): void {
        // Calculate forward vector from yaw and pitch
        this.forward[0] = Math.cos(this.pitch) * -Math.sin(this.yaw);
        this.forward[1] = Math.sin(this.pitch);
        this.forward[2] = Math.cos(this.pitch) * -Math.cos(this.yaw);
        vec3.normalize(this.forward, this.forward);
        vec3.cross(this.right, this.forward, [0, 1, 0]);
        vec3.normalize(this.right, this.right);
        vec3.cross(this.up, this.right, this.forward);
        vec3.normalize(this.up, this.up);

        // Calculate view matrix
        const target = vec3.add(vec3.create(), this.position, this.forward);
        mat4.lookAt(this.viewMatrix, this.position, target, this.up);
        // Calculate projection matrix
        mat4.perspective(this.projectionMatrix, this.fov, this.aspect, this.near, this.far);
        // Calculate combined view-projection matrix
        mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
    }

    setAspect(aspect: number): void {
        this.aspect = aspect;
    }
}