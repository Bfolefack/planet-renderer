import { FrameBuffer } from "./core/FrameBuffer";
import { FullScreenQuad } from "./core/FullScreenQuad";
import { Shader } from "./core/Shader";


import fullscreenFS from "./shaders/gradient.frag";
import fullscreenVS from "./shaders/fullscreen.vert";
import gbufferFS from "./shaders/gbuffer.frag";
import gbufferVS from "./shaders/gbuffer.vert";
import atmosphereFS from "./shaders/atmosphere.frag"
import compositeFS from "./shaders/composite.frag"
import cloudFS from "./shaders/cloud.frag"

import blitFS from "./shaders/blit.frag";


import { CubeSphere } from "./render/geometry/CubeSphere";
import { Mesh } from "./render/Mesh";
import { NoiseVolume } from "./render/noise/NoiseVolume";
import { mat4, vec3 } from "gl-matrix";
import { InputHandler } from "./input/InputHandler";
import { Camera } from "./render/Camera";

// TODO: These are defined separately in shader context and application code, bind them through uniforms
// const PLANET_RADIUS = 6371000.0;
// const ATMOSPHERE_RADIUS = PLANET_RADIUS + 100000.0;

// const PLANET_SCALE = 1.0 / 1000.0;  // 1 unit = 1 km
const PLANET_RADIUS = 6371.0;
// const ATMOSPHERE_RADIUS = PLANET_RADIUS + 10000.0;
export class App {
  // Canvas and WebGL context
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;

  // Geometries 
  private fullScreenQuad: FullScreenQuad;
  private cubeSphereMesh: Mesh;
  private noiseVolume: NoiseVolume;


  // Framebuffers
  private gbufferFB: FrameBuffer;
  private atmosphereFB: FrameBuffer;
  private cloudFB: FrameBuffer;
  private compositeFB: FrameBuffer;

  // Shaders
  private gbufferShader: Shader;
  private atmosphereShader: Shader;
  private cloudShader: Shader;
  private compositeShader: Shader;
  private blitShader: Shader;

  // Input and Camera
  private input: InputHandler;
  private camera: Camera;

  private sunAngle: number = 0; // radians, 0 = sun directly above +X axis
  private sunDir: vec3 = vec3.create();

  private renderClouds: boolean = true;
  private debounceCloudToggle: boolean = true;

  
  private lastTime: number = 0;
  private lastWidth: number = 0;
  private lastHeight: number = 0;

  // Framerate display
  private hudElement: HTMLDivElement;
  private hudVisible: boolean = true;
  private debounceHudToggle: boolean = true;
  private fpsElement: HTMLDivElement;
  private fpsFrames: number = 0;
  private fpsLastUpdate: number = 0;

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

    // Initialize geometries
    this.fullScreenQuad = new FullScreenQuad(this.gl);

    const cubeSphereData = CubeSphere.generate(100, PLANET_RADIUS);
    this.cubeSphereMesh = new Mesh(this.gl, cubeSphereData.vertices, cubeSphereData.indices, 6 * 4, [
      { name: 'aPosition', location: 0, components: 3, type: this.gl.FLOAT, offsetBytes: 0 },
      { name: 'aNormal', location: 1, components: 3, type: this.gl.FLOAT, offsetBytes: 3 * 4 },
    ]);

    this.noiseVolume = new NoiseVolume(this.gl, 128);

    // Initialize framebuffers
    this.gbufferFB = new FrameBuffer(this.gl, canvas.width, canvas.height, 
      [{
        name: 'color',
        internalFormat: this.gl.RGBA16F,
        format: this.gl.RGBA,
        type: this.gl.HALF_FLOAT
      }],
      {
          name: 'depth',
          internalFormat: this.gl.DEPTH_COMPONENT32F,
          format: this.gl.DEPTH_COMPONENT,
          type: this.gl.FLOAT
      }
    );

    this.atmosphereFB = new FrameBuffer(this.gl, canvas.width, canvas.height, 
      [{
        name: 'color',
        internalFormat: this.gl.RGBA16F,
        format: this.gl.RGBA,
        type: this.gl.HALF_FLOAT
      }]
    );

    this.cloudFB = new FrameBuffer(this.gl, canvas.width, canvas.height,
      [{
        name: 'color',
        internalFormat: this.gl.RGBA16F,
        format: this.gl.RGBA,
        type: this.gl.HALF_FLOAT
      }]
    );

    this.compositeFB = new FrameBuffer(this.gl, canvas.width, canvas.height, 
      [{
        name: 'color',
        internalFormat: this.gl.RGBA16F,
        format: this.gl.RGBA,
        type: this.gl.HALF_FLOAT
      }]
    );

    // Initialize shaders
    this.gbufferShader = new Shader(this.gl, gbufferVS, gbufferFS);
    this.atmosphereShader = new Shader(this.gl, fullscreenVS, atmosphereFS);
    this.cloudShader = new Shader(this.gl, fullscreenVS, cloudFS);
    this.compositeShader = new Shader(this.gl, fullscreenVS, compositeFS);
    this.blitShader = new Shader(this.gl, fullscreenVS, blitFS);
    


    // Initialize input and camera
    this.input = new InputHandler(canvas);
    this.camera = new Camera([PLANET_RADIUS + 800.0, 0, 0]);
    this.camera.setAspect(canvas.width / canvas.height);
    this.lastWidth = canvas.width;
    this.lastHeight = canvas.height;
    this.updateSunDirection();

    this.hudElement = document.createElement('div');
    this.hudElement.style.cssText =
      'position:fixed;top:8px;left:8px;padding:6px 10px;background:rgba(0,0,0,0.5);' +
      'color:#fff;font:14px monospace;pointer-events:none;z-index:10;white-space:pre';
    this.fpsElement = document.createElement('div');
    const controlsElement = document.createElement('div');
    controlsElement.style.marginTop = '6px';
    controlsElement.textContent = [
      'Mouse   look (click to lock)',
      'W/A/S/D move',
      'Space   up',
      'Shift   down',
      'Q/E     rotate sun',
      '1/3     rotate sun (slow)',
      'T       reset sun',
      'R       reset orientation',
      'C       toggle clouds',
      'H       toggle HUD',
    ].join('\n');
    this.hudElement.append(this.fpsElement, controlsElement);
    document.body.appendChild(this.hudElement);
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
    const deltaTime = time - this.lastTime;
    this.handleResize();
    this.updateCamera(deltaTime);
    this.render(deltaTime);
    this.updateFps(time);
    this.lastTime = time;
    requestAnimationFrame(this.tick);
  }

  // Resize framebuffers and camera aspect when the canvas size changes (main.ts resizes the canvas)
  private handleResize(): void {
    const { width, height } = this.canvas;
    if (width === this.lastWidth && height === this.lastHeight) return;
    if (width === 0 || height === 0) return;
    this.lastWidth = width;
    this.lastHeight = height;
    for (const fb of [this.gbufferFB, this.atmosphereFB, this.cloudFB, this.compositeFB]) {
      fb.resize(width, height);
    }
    this.camera.setAspect(width / height);
  }

  private updateFps(time: number): void {
    this.fpsFrames++;
    const elapsed = time - this.fpsLastUpdate;
    if (elapsed >= 500) {
      this.fpsElement.textContent = `${Math.round((this.fpsFrames * 1000) / elapsed)} FPS`;
      this.fpsFrames = 0;
      this.fpsLastUpdate = time;
    }
  }

  private render(deltaTime: number): void {
    const gl = this.gl;

    // Pass 1: GBuffer
    this.gbufferFB.bind();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);

    this.gbufferShader.use();
    this.gbufferShader.setMat4("uViewProjection", new Float32Array(this.camera.viewProjectionMatrix));
    this.gbufferShader.setMat4("uModel", new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ]));
    this.cubeSphereMesh.draw();

    // Pass 2: Atmosphere
    this.atmosphereFB.bind();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);

    this.atmosphereShader.use();
    this.atmosphereShader.setVec3("uCameraPos", this.camera.position);
    this.atmosphereShader.setVec3("uSunDir", this.sunDir);
    this.atmosphereShader.setMat4("uInvViewProj", new Float32Array(this.camera.invViewProjectionMatrix));
    this.atmosphereShader.setTexture("uGBufferDepth", this.gbufferFB.getDepthTexture()!, 0);
    this.fullScreenQuad.draw();

    // Pass 3: Clouds
    this.cloudFB.bind();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (this.renderClouds) {
      this.cloudShader.use();
      this.cloudShader.setVec3("uSunDir", this.sunDir);
      this.cloudShader.setVec3("uCameraPos", this.camera.position);
      this.cloudShader.setMat4("uInvViewProj", new Float32Array(this.camera.invViewProjectionMatrix));
      this.cloudShader.setTexture("uGBufferDepth", this.gbufferFB.getDepthTexture()!, 0);
      this.cloudShader.setTexture("uNoiseVolume", this.noiseVolume.texture, 1, gl.TEXTURE_3D);
    }
    this.fullScreenQuad.draw();
    this.cloudFB.bindDefault();
    
    // Pass 4: Composite
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);

    this.compositeShader.use();
    this.compositeShader.setTexture("uGBufferColor", this.gbufferFB.getColorTexture('color'), 0);
    this.compositeShader.setTexture("uAtmosphere", this.atmosphereFB.getColorTexture('color'), 1);
    this.compositeShader.setTexture("uCloud", this.cloudFB.getColorTexture('color'), 2);
    this.compositeShader.setTexture("uGBufferDepth", this.gbufferFB.getDepthTexture()!, 3);
    this.compositeShader.setVec3("uCameraPos", this.camera.position);
    this.compositeShader.setMat4("uInvViewProj", new Float32Array(this.camera.invViewProjectionMatrix));
    this.compositeShader.setVec3("uSunDir", this.sunDir);
    this.fullScreenQuad.draw();
  }

  // Camera update code generated by Claude with manual cleanup and expansion for new features.
  updateCamera(dt: number) {
    const dtSec = dt / 1000;
    const distFromPlanet = vec3.length(this.camera.position);
    const altitude = distFromPlanet - PLANET_RADIUS;
    const moveSpeed = Math.max(1, altitude * 0.5);
    const turnSpeed = 0.002;

    // Mouse look — now planet-relative
    if (this.input.isPointerLocked()) {
        const mouseDelta = this.input.getMouseDelta();
        this.camera.rotateYaw(-mouseDelta.x * turnSpeed);
        this.camera.rotatePitch(mouseDelta.y * turnSpeed);
    }

    // C - enable/disable clouds
    if (this.input.isKeyPressed('KeyC') && this.debounceCloudToggle){
      this.renderClouds = !this.renderClouds;
      this.debounceCloudToggle = false;
    } else if (!this.input.isKeyPressed('KeyC') && !this.debounceCloudToggle){
      this.debounceCloudToggle = true;
    }

    // H - show/hide HUD (FPS + controls)
    if (this.input.isKeyPressed('KeyH') && this.debounceHudToggle) {
      this.hudVisible = !this.hudVisible;
      this.hudElement.style.display = this.hudVisible ? 'block' : 'none';
      this.debounceHudToggle = false;
    } else if (!this.input.isKeyPressed('KeyH') && !this.debounceHudToggle) {
      this.debounceHudToggle = true;
    }

    // WASD — move in camera-local horizontal plane
    const direction = vec3.create();
    if (this.input.isKeyPressed('KeyW')) vec3.add(direction, direction, this.camera.forward);
    if (this.input.isKeyPressed('KeyS')) vec3.subtract(direction, direction, this.camera.forward);
    if (this.input.isKeyPressed('KeyA')) vec3.subtract(direction, direction, this.camera.right);
    if (this.input.isKeyPressed('KeyD')) vec3.add(direction, direction, this.camera.right);

    if (vec3.length(direction) > 0) {
        vec3.normalize(direction, direction);
        vec3.scaleAndAdd(this.camera.position, this.camera.position, direction, moveSpeed * dtSec);
    }

    // Space / Shift — radial movement (up/down relative to planet)
    const radialDir = vec3.normalize(vec3.create(), this.camera.position);
    if (this.input.isKeyPressed('Space')) {
        vec3.scaleAndAdd(this.camera.position, this.camera.position, radialDir, moveSpeed * dtSec);
    }
    if (this.input.isKeyPressed('ShiftLeft')) {
        vec3.scaleAndAdd(this.camera.position, this.camera.position, radialDir, -moveSpeed * dtSec);
    }

    // Q / E — sun control
    const sunSpeed = 0.5;
    if (this.input.isKeyPressed('KeyQ')) this.sunAngle -= sunSpeed * dtSec;
    if (this.input.isKeyPressed('KeyE')) this.sunAngle += sunSpeed * dtSec;
    // 1 / 3 - slower sun control
    if (this.input.isKeyPressed('Digit1')) this.sunAngle -= sunSpeed * 0.1 * dtSec;
    if (this.input.isKeyPressed('Digit3')) this.sunAngle += sunSpeed * 0.1 * dtSec;

    if (this.input.isKeyPressed('KeyQ') || this.input.isKeyPressed('KeyE') || this.input.isKeyPressed('Digit1') || this.input.isKeyPressed('Digit3')) {
        this.updateSunDirection();
    }

    // T — reset sun
    if (this.input.isKeyPressed('KeyT')) {
        this.sunAngle = Math.PI / 2;
        this.updateSunDirection();
    }

    // R — look at planet center
    if (this.input.isKeyPressed('KeyR')) {
        // Reset orientation so camera looks straight down at planet
        // This means forward = -planetUp, which we achieve by pitching down 90 degrees from default
        this.camera.resetOrientation();
    }

    // Altitude clamp
    const newDist = vec3.length(this.camera.position);
    const minDist = PLANET_RADIUS + 20.0;
    const maxDist = PLANET_RADIUS + 50000.0;

    if (newDist < minDist || newDist > maxDist) {
        const clampedDist = Math.max(minDist, Math.min(maxDist, newDist));
        const dir = vec3.normalize(vec3.create(), this.camera.position);
        vec3.scale(this.camera.position, dir, clampedDist);
    }

    this.camera.update();
  }

  private updateSunDirection() {
    // Sun rotates in the X-Z plane (could also tilt for axial tilt later)
    this.sunDir[0] = Math.cos(this.sunAngle);
    this.sunDir[1] = Math.sin(this.sunAngle);
    this.sunDir[2] = 0.0;
    vec3.normalize(this.sunDir, this.sunDir);
}
}