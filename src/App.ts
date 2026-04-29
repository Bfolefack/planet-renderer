import { FrameBuffer } from "./core/FrameBuffer";
import { FullScreenQuad } from "./core/FullScreenQuad";
import { Shader } from "./core/Shader";

import fullscreenVS from "./shaders/fullscreen.vert";
import fullscreenFS from "./shaders/gradient.frag";
import gbufferFS from "./shaders/gbuffer.frag";
import gbufferVS from "./shaders/gBuffer.vert";
import blitFS from "./shaders/blit.frag";


import { CubeSphere } from "./render/geometry/CubeSphere";
import { Mesh } from "./render/Mesh";
import { mat4, vec3 } from "gl-matrix";
import { InputHandler } from "./input/InputHandler";
import { Camera } from "./render/Camera";



export class App {
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;

  private fullScreenQuad: FullScreenQuad;
  private testFrameBuffer: FrameBuffer;
  private shader: Shader;
  private blitShader: Shader;
  private gbufferShader: Shader;
  private cubeSphereMesh: Mesh;

  private input: InputHandler;
  private camera: Camera;
  private lastTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      throw new Error('WebGL2 not supported');
    }
    this.gl = gl;
    gl.getExtension('EXT_color_buffer_float'); // Ensure we can use floating point textures
    gl.getExtension('OES_texture_float_linear');
    gl.getExtension('EXT_float_blend');

    // Initialize core components
    this.fullScreenQuad = new FullScreenQuad(this.gl);
    this.shader = new Shader(this.gl, fullscreenVS, fullscreenFS);
    this.blitShader = new Shader(this.gl, fullscreenVS, blitFS);
    this.gbufferShader = new Shader(this.gl, gbufferVS, gbufferFS);
    this.testFrameBuffer = new FrameBuffer(this.gl, canvas.width, canvas.height, [
      {
        name: 'color',
        internalFormat: this.gl.RGBA16F,
        format: this.gl.RGBA,
        type: this.gl.HALF_FLOAT
      }
    ]);
    const cubeSphereData = CubeSphere.generate(10, 1);
    this.cubeSphereMesh = new Mesh(this.gl, cubeSphereData.vertices, cubeSphereData.indices, 6 * 4, [
      { name: 'aPosition', location: 0, components: 3, type: this.gl.FLOAT, offsetBytes: 0 },
      { name: 'aNormal', location: 1, components: 3, type: this.gl.FLOAT, offsetBytes: 3 * 4 },
    ]);


    this.input = new InputHandler(canvas);
    this.camera = new Camera();
    this.camera.setAspect(canvas.width / canvas.height);
  }

  start() {
    console.log('Starting app');
    // Set clear color to black, fully opaque
    this.gl.clearColor(1.0, 0.0, 0.0, 1.0);
    // Clear the color buffer with specified clear color
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);

    if (this.gl instanceof WebGL2RenderingContext) {
      console.log('WebGL2 context successfully initialized');
    } else {
      console.error('Failed to initialize WebGL2 context');
    }

    // Check that EXT_color_buffer_float extension is available
    const ext = this.gl.getExtension('EXT_color_buffer_float');
    if (ext) {
      console.log('EXT_color_buffer_float extension is available');
    } else {
      console.warn('EXT_color_buffer_float extension is not available');
    }

    // Start the render loop
    requestAnimationFrame(this.tick);

    console.log('App started');
  }


  private tick = (time: number) => {
    this.testFrameBuffer.bind();
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0); 
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);

    this.updateCamera(time - this.lastTime);

    this.gbufferShader.use();
    this.gbufferShader.setMat4("uViewProjection", new Float32Array(this.camera.viewProjectionMatrix));
    this.gbufferShader.setMat4("uModel", new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]));
    this.cubeSphereMesh.draw();

    this.testFrameBuffer.bindDefault();
    this.blitShader.use();
    this.blitShader.setTexture("uTexture", this.testFrameBuffer.getColorTexture('color'), 0);
    this.fullScreenQuad.draw();
    


    // Request next frame
    this.lastTime = time;
    requestAnimationFrame(this.tick);
  }

  updateCamera(dt: number) {
    const moveSpeed = 5; // units per second
    const turnSpeed = 0.002; // radians per pixel

    // Update camera rotation based on mouse movement
    if (this.input.isPointerLocked()) {
      const mouseDelta = this.input.getMouseDelta();
      this.camera.yaw -= mouseDelta.x * turnSpeed;
      this.camera.pitch -= mouseDelta.y * turnSpeed;
      // Clamp pitch to avoid flipping
      const maxPitch = Math.PI / 2 - 0.01;
      this.camera.pitch = Math.max(-maxPitch, Math.min(maxPitch, this.camera.pitch));
    }

    // Update camera position based on keyboard input
    const forward = this.input.isKeyPressed('KeyW');
    const backward = this.input.isKeyPressed('KeyS');
    const left = this.input.isKeyPressed('KeyA');
    const right = this.input.isKeyPressed('KeyD');

    const direction = vec3.create();
    if (forward) vec3.add(direction, direction, this.camera.forward);
    if (backward) vec3.subtract(direction, direction, this.camera.forward);
    if (left) vec3.subtract(direction, direction, this.camera.right);
    if (right) vec3.add(direction, direction, this.camera.right);

    if (vec3.length(direction) > 0) {
      vec3.normalize(direction, direction);
      vec3.scaleAndAdd(this.camera.position, this.camera.position, direction, moveSpeed * (dt / 1000));
    }

    this.camera.update();
  }
}