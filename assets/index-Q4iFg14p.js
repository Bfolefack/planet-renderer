(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function e(t){"@babel/helpers - typeof";return e=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},e(t)}function t(t,n){if(e(t)!=`object`||!t)return t;var r=t[Symbol.toPrimitive];if(r!==void 0){var i=r.call(t,n||`default`);if(e(i)!=`object`)return i;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(n===`string`?String:Number)(t)}function n(n){var r=t(n,`string`);return e(r)==`symbol`?r:r+``}function r(e,t,r){return(t=n(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}var i=class{constructor(e,t,n,i,a){r(this,`fbo`,void 0),r(this,`colorTextures`,void 0),r(this,`depthTexture`,null),r(this,`colorAttachments`,[]),this.gl=e,this.width=t,this.height=n,this.colorSpecs=i,this.depthSpec=a;let o=e.createFramebuffer();if(!o)throw Error(`Unable to create framebuffer`);if(this.fbo=o,e.bindFramebuffer(e.FRAMEBUFFER,this.fbo),this.colorTextures=new Map,i.forEach((r,i)=>{let a=e.createTexture();if(!a)throw Error(`Unable to create color texture for attachment ${r.name}`);e.bindTexture(e.TEXTURE_2D,a),e.texImage2D(e.TEXTURE_2D,0,r.internalFormat,t,n,0,r.format,r.type,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0+i,e.TEXTURE_2D,a,0),this.colorTextures.set(r.name,a),this.colorAttachments.push(e.COLOR_ATTACHMENT0+i),console.log(`Attaching ${r.name}:`,{internalFormat:r.internalFormat.toString(16),format:r.format.toString(16),type:r.type.toString(16),width:t,height:n,glError:e.getError().toString(16)});let o=e.checkFramebufferStatus(e.FRAMEBUFFER);if(o!==e.FRAMEBUFFER_COMPLETE)throw Error(`Framebuffer incomplete after attaching color texture ${r.name}: ${this.getFramebufferStatusMessage(o)}`)}),a){let r=e.createTexture();if(!r)throw Error(`Unable to create depth texture for attachment ${a.name}`);e.bindTexture(e.TEXTURE_2D,r),e.texImage2D(e.TEXTURE_2D,0,a.internalFormat,t,n,0,a.format,a.type,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,r,0),this.depthTexture=r}this.colorAttachments.length>0&&e.drawBuffers(this.colorAttachments);let s=e.checkFramebufferStatus(e.FRAMEBUFFER);if(s!==e.FRAMEBUFFER_COMPLETE)throw Error(`Framebuffer incomplete after setup: ${this.getFramebufferStatusMessage(s)}`);e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,null)}bind(){this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,this.fbo),this.gl.viewport(0,0,this.width,this.height)}bindDefault(){this.gl.bindFramebuffer(this.gl.FRAMEBUFFER,null),this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height)}getColorTexture(e){let t=this.colorTextures.get(e);if(!t)throw Error(`No color texture found for attachment name: ${e}`);return t}getDepthTexture(){return this.depthTexture}resize(e,t){this.width=e,this.height=t,this.bind(),this.colorTextures.forEach((n,r)=>{let i=this.colorSpecs.find(e=>e.name===r);i&&(this.gl.bindTexture(this.gl.TEXTURE_2D,n),this.gl.texImage2D(this.gl.TEXTURE_2D,0,i.internalFormat,e,t,0,i.format,i.type,null))}),this.depthTexture&&this.depthSpec&&(this.gl.bindTexture(this.gl.TEXTURE_2D,this.depthTexture),this.gl.texImage2D(this.gl.TEXTURE_2D,0,this.depthSpec.internalFormat,e,t,0,this.depthSpec.format,this.depthSpec.type,null)),this.gl.bindTexture(this.gl.TEXTURE_2D,null)}dispose(){this.colorTextures.forEach(e=>this.gl.deleteTexture(e)),this.depthTexture&&this.gl.deleteTexture(this.depthTexture),this.gl.deleteFramebuffer(this.fbo)}getFramebufferStatusMessage(e){switch(e){case this.gl.FRAMEBUFFER_COMPLETE:return`FRAMEBUFFER_COMPLETE`;case this.gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return`FRAMEBUFFER_INCOMPLETE_ATTACHMENT`;case this.gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return`FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT`;case this.gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return`FRAMEBUFFER_INCOMPLETE_DIMENSIONS`;case this.gl.FRAMEBUFFER_UNSUPPORTED:return`FRAMEBUFFER_UNSUPPORTED`;default:return`Unknown framebuffer status: ${e}`}}},a=class{constructor(e){r(this,`vao`,void 0),this.gl=e;let t=new Float32Array([-1,-1,0,0,1,-1,1,0,-1,1,0,1,1,1,1,1]);this.vao=e.createVertexArray();let n=e.createBuffer();e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,n),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,16,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,2,e.FLOAT,!1,16,8),e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null)}draw(){this.gl.bindVertexArray(this.vao),this.gl.drawArrays(this.gl.TRIANGLE_STRIP,0,4),this.gl.bindVertexArray(null)}},o=class{constructor(e,t,n){r(this,`program`,void 0),r(this,`uniformLocations`,void 0),r(this,`nullUniformLocations`,void 0),r(this,`attributeLocations`,void 0),this.gl=e;let i=this.compileShader(t,e.VERTEX_SHADER),a=this.compileShader(n,e.FRAGMENT_SHADER);try{this.program=this.linkProgram(i,a)}catch(e){throw console.error(`Error linking shader program:`,e),e}e.deleteShader(i),e.deleteShader(a),this.uniformLocations=new Map,this.attributeLocations=new Map,this.nullUniformLocations=new Set;let o=e.getProgramParameter(this.program,e.ACTIVE_UNIFORMS);for(let t=0;t<o;t++){let n=e.getActiveUniform(this.program,t);if(n){let t=e.getUniformLocation(this.program,n.name);this.uniformLocations.set(n.name,t)}}let s=e.getProgramParameter(this.program,e.ACTIVE_ATTRIBUTES);for(let t=0;t<s;t++){let n=e.getActiveAttrib(this.program,t);if(n){let t=e.getAttribLocation(this.program,n.name);this.attributeLocations.set(n.name,t)}}}compileShader(e,t){let n=this.gl,r=n.createShader(t);if(!r)throw Error(`Unable to create shader`);if(n.shaderSource(r,e),n.compileShader(r),!n.getShaderParameter(r,n.COMPILE_STATUS)){let t=n.getShaderInfoLog(r);n.deleteShader(r);let i=e.split(`
`).map((e,t)=>`${t+1}: ${e}`).join(`
`);throw console.error(`Error compiling shader:\n${i}\nInfo log:\n${t}`),Error(`Error compiling shader: ${t}`)}return r}linkProgram(e,t){let n=this.gl,r=n.createProgram();if(!r)throw Error(`Unable to create shader program`);if(n.attachShader(r,e),n.attachShader(r,t),n.linkProgram(r),!n.getProgramParameter(r,n.LINK_STATUS)){let i=n.getProgramInfoLog(r);n.deleteProgram(r);let a=n.getShaderSource(e),o=n.getShaderSource(t);throw console.error(`Error linking program:\nVertex Shader:\n${a}\nFragment Shader:\n${o}\nInfo log:\n${i}`),Error(`Error linking shader program: ${i}`)}return r}use(){this.gl.useProgram(this.program)}bind(e){this.use();for(let[t,n]of Object.entries(e))n instanceof WebGLTexture?this.setTexture(t,n):n instanceof Float32Array?n.length===16?this.setMat4(t,n):n.length===4?this.setVec4(t,n):n.length===3?this.setVec3(t,n):n.length===2?this.setVec2(t,n):console.warn(`Warning: Unrecognized uniform value for '${t}'. Expected Float32Array of length 2, 3, 4, or 16.`):typeof n==`number`?t.toLowerCase().includes(`texture`)||t.toLowerCase().includes(`sampler`)?this.setTexture(t,n,n):this.setFloat(t,n):console.warn(`Warning: Unrecognized uniform value type for '${t}'. Expected number, Float32Array, or WebGLTexture.`)}setMat4(e,t){this.gl.uniformMatrix4fv(this.getUniformLocation(e),!1,t)}setVec4(e,t){this.gl.uniform4fv(this.getUniformLocation(e),t)}setVec3(e,t){this.gl.uniform3fv(this.getUniformLocation(e),t)}setVec2(e,t){this.gl.uniform2fv(this.getUniformLocation(e),t)}setFloat(e,t){this.gl.uniform1f(this.getUniformLocation(e),t)}setInt(e,t){this.gl.uniform1i(this.getUniformLocation(e),t)}setTexture(e,t,n=0,r=this.gl.TEXTURE_2D){let i=this.getUniformLocation(e);i&&(this.gl.activeTexture(this.gl.TEXTURE0+n),this.gl.bindTexture(r,t),this.gl.uniform1i(i,n))}getUniformLocation(e){if(!this.uniformLocations.has(e)){let t=this.gl.getUniformLocation(this.program,e);this.uniformLocations.set(e,t),t===null&&(this.nullUniformLocations.has(e)||(console.warn(`Warning: Uniform '${e}' not found in shader program.\nIt may be optimized out if it's not used in the shader code.`),this.nullUniformLocations.add(e)))}return this.uniformLocations.get(e)}getAttributeLocation(e){return this.attributeLocations.get(e)??-1}},s=`#version 300 es
precision highp float;

in vec2 aPosition;
out vec2 vUV;

void main() {
    vUV = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}`,c=`#version 300 es
precision highp float;

in vec3 vWorldPos;
in vec3 vWorldNormal;

out vec4 fragColor;

void main() {
    
    
    
    
    fragColor = vec4(0.0, 1.0, 0.0, 1.0);
    
}`,l=`#version 300 es
precision highp float;

layout(location = 0) in vec3 aPosition;
layout(location = 1) in vec3 aNormal;

uniform mat4 uViewProjection;
uniform mat4 uModel;

out vec3 vWorldPos;
out vec3 vWorldNormal;

void main() {
    vec4 worldPos = uModel * vec4(aPosition, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = mat3(uModel) * aNormal; 
    gl_Position = uViewProjection * worldPos;
}`,u=`#version 300 es
precision highp float;

const float PLANET_SCALE = 1.0 / 1000.0;  
const float PLANET_RADIUS = 6371.0;
const float ATMOSPHERE_SCALE = 30.0; 
const float ATMOSPHERE_RADIUS = PLANET_RADIUS + 100.0 * ATMOSPHERE_SCALE;
const float PI = 3.14159265358979323846;
vec2 raySphereIntersect(vec3 ro, vec3 rd, vec3 sc, float r) {
    vec3 oc = ro - sc;
    float b = dot(oc, rd);        
    float c = dot(oc, oc) - r * r;
    float h = b * b - c;          
    if (h < 0.0) return vec2(-1.0);
    h = sqrt(h);
    return vec2(-b - h, -b + h);  
}
vec3 worldPosFromDepth(float depth, vec2 uv, mat4 invViewProj) {
    vec4 ndc = vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
    vec4 worldPos = invViewProj * ndc;
    return worldPos.xyz / worldPos.w;
}

vec3 worldRayDir(vec2 uv, vec3 cameraPos, mat4 invViewProj) {
    vec4 ndc = vec4(uv * 2.0 - 1.0, 1.0, 1.0);
    vec4 worldPos = invViewProj * ndc;
    return normalize(worldPos.xyz / worldPos.w - cameraPos);
}
const vec3 RAYLEIGH_COEFFICIENT = vec3(5.802e-6, 13.55e-6, 33.1e-6) * (1.0/ATMOSPHERE_SCALE) * 5.0;
const float MIE_COEFFICIENT = 2.0e-5 * (1.0/ATMOSPHERE_SCALE) * 0.7;
const float MIE_EXTINCTION = MIE_COEFFICIENT * 1.05;
const float RAYLEIGH_SCALE_HEIGHT = 8000.0 * ATMOSPHERE_SCALE;
const float MIE_SCALE_HEIGHT = 1200.0 * ATMOSPHERE_SCALE * 0.8;
const float MIE_G = 0.9; 

const vec3 betaR = RAYLEIGH_COEFFICIENT * (1.0 / PLANET_SCALE);
const float betaM = MIE_COEFFICIENT * (1.0 / PLANET_SCALE);
const float betaMExt = MIE_EXTINCTION * (1.0 / PLANET_SCALE);

const int VIEW_RAY_SAMPLES = 64;
const int SUN_RAY_SAMPLES = 16;

vec2 atmosphereDensity(vec3 position) {
    float altitude = length(position) - PLANET_RADIUS;
    float rayleighDensity = exp(-altitude / (RAYLEIGH_SCALE_HEIGHT * PLANET_SCALE));
    float mieDensity = exp(-altitude / (MIE_SCALE_HEIGHT * PLANET_SCALE));
    return vec2(rayleighDensity, mieDensity);
}

float rayleighPhase(float cosTheta) {
    return 3.0 / (16.0 * PI) * (1.0 + cosTheta * cosTheta);
}

float miePhase(float cosTheta, float g) {
    float g2 = g * g;
    float numerator = (1.0 - g2) * (1.0 + cosTheta * cosTheta);
    float denominator = (2.0 + g2) * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5);
    return (3.0 / (8.0 * PI)) * (numerator / denominator);
}

vec2 sunRayOpticalDepth(vec3 position, vec3 sunDirection) {
    
    vec2 planetHit = raySphereIntersect(position, sunDirection, vec3(0.0), PLANET_RADIUS);
    if (planetHit.x > 0.0) {
        
        return vec2(1e10, 1e10);
    }

    vec2 hit = raySphereIntersect(position, sunDirection, vec3(0.0), ATMOSPHERE_RADIUS);
    if (hit.y < 0.0) return vec2(0.0, 0.0);

    float rayLength = hit.y;
    float stepSize = rayLength / float(SUN_RAY_SAMPLES);
    vec2 opticalDepth = vec2(0.0);
    for (int i = 0; i < SUN_RAY_SAMPLES; i++) {
        vec3 samplePos = position + sunDirection * (float(i) + 0.5) * stepSize;
        opticalDepth += atmosphereDensity(samplePos) * stepSize;
    }
    return opticalDepth;
}

vec4 computeScattering(
    vec3 rayOrigin,
    vec3 rayDirection,
    float tStart,
    float tEnd,
    vec3 sunDirection
) {
    float rayLength = tEnd - tStart;
    float stepSize = rayLength / float(VIEW_RAY_SAMPLES);

    vec3 inscatteredRayleigh = vec3(0.0);
    vec3 inscatteredMie = vec3(0.0);
    vec2 viewOpticalDepth = vec2(0.0);

    float cosTheta = dot(rayDirection, sunDirection);
    float phaseR = rayleighPhase(cosTheta);
    float phaseM = miePhase(cosTheta, MIE_G);

    for (int i = 0; i < VIEW_RAY_SAMPLES; i++) {
        float t = tStart + (float(i) + 0.5) * stepSize;
        vec3 samplePos = rayOrigin + rayDirection * t;

        
        vec2 density = atmosphereDensity(samplePos);
        vec2 stepOpticalDepth = density * stepSize;
        viewOpticalDepth += stepOpticalDepth;

        
        vec2 sunOpticalDepth = sunRayOpticalDepth(samplePos, sunDirection);

        
        vec3 totalOpticalDepth = 
            betaR * (viewOpticalDepth.x + sunOpticalDepth.x) +
            vec3(betaMExt * (viewOpticalDepth.y + sunOpticalDepth.y));

        vec3 transmittance = exp(-totalOpticalDepth);

        inscatteredRayleigh += density.x * transmittance * stepSize;
        inscatteredMie += density.y * transmittance * stepSize;
    }

    vec3 finalLight = 
        inscatteredRayleigh * betaR * phaseR +
        inscatteredMie * betaM * phaseM;

    
    finalLight *= 20.0;

    vec3 viewTransmittance = exp(-(
        betaR * viewOpticalDepth.x +
        vec3(betaMExt) * viewOpticalDepth.y
    ));

    
    float alpha = dot(viewTransmittance, vec3(0.2126, 0.7152, 0.0722));

    
    

    

    return vec4(finalLight, alpha);
}

in vec2 vUV;
out vec4 fragColor;

uniform vec3 uCameraPos;
uniform mat4 uInvViewProj;
uniform vec3 uSunDir;
uniform sampler2D uGBufferDepth;

void main() {
    vec3 rayDir = worldRayDir(vUV, uCameraPos, uInvViewProj);

    float depth = texture(uGBufferDepth, vUV).r;
    bool hitSurface = depth < 1.0;
    vec3 surfacePos = worldPosFromDepth(depth, vUV, uInvViewProj);
    float surfaceDistance = hitSurface ? length(surfacePos - uCameraPos) : 1e30;

    
    vec2 atmosphereHit = raySphereIntersect(uCameraPos, rayDir, vec3(0.0), ATMOSPHERE_RADIUS);

    if (atmosphereHit.y < 0.0) {
        
        
        fragColor = vec4(0.0, 0.0, 0.0, 1.0); 
        return;
    }

    
    
    float tStart = max(atmosphereHit.x, 0.0);
    
    float tEnd = min(atmosphereHit.y, surfaceDistance);

    if (tEnd <= tStart) {
        
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    fragColor = computeScattering(uCameraPos, rayDir, tStart, tEnd, uSunDir);
}`,d=`#version 300 es
precision highp float;

in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uAtmosphere;
uniform sampler2D uCloud;
uniform sampler2D uGBufferDepth;
uniform sampler2D uGBufferColor;
uniform vec3 uCameraPos;
uniform mat4 uInvViewProj;
uniform vec3 uSunDir;

const float PLANET_SCALE = 1.0 / 1000.0;  
const float PLANET_RADIUS = 6371.0;
const float ATMOSPHERE_SCALE = 30.0; 
const float ATMOSPHERE_RADIUS = PLANET_RADIUS + 100.0 * ATMOSPHERE_SCALE;
const float PI = 3.14159265358979323846;
vec2 raySphereIntersect(vec3 ro, vec3 rd, vec3 sc, float r) {
    vec3 oc = ro - sc;
    float b = dot(oc, rd);        
    float c = dot(oc, oc) - r * r;
    float h = b * b - c;          
    if (h < 0.0) return vec2(-1.0);
    h = sqrt(h);
    return vec2(-b - h, -b + h);  
}
vec3 worldPosFromDepth(float depth, vec2 uv, mat4 invViewProj) {
    vec4 ndc = vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
    vec4 worldPos = invViewProj * ndc;
    return worldPos.xyz / worldPos.w;
}

vec3 worldRayDir(vec2 uv, vec3 cameraPos, mat4 invViewProj) {
    vec4 ndc = vec4(uv * 2.0 - 1.0, 1.0, 1.0);
    vec4 worldPos = invViewProj * ndc;
    return normalize(worldPos.xyz / worldPos.w - cameraPos);
}

vec3 acesTonemap(vec3 x) {
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

vec3 worldRayDir(vec2 uv, vec3 cameraPos, mat4 invViewProj);  

void main() {
    vec3 sceneColor = texture(uGBufferColor, vUV).rgb;
    vec4 atm = texture(uAtmosphere, vUV);
    vec4 cloud = texture(uCloud, vUV);
    float depth = texture(uGBufferDepth, vUV).r;
    
    vec3 color = sceneColor * atm.a + atm.rgb;
    color = color * cloud.a + cloud.rgb;
    
    
    if (depth >= 1.0) {
        vec3 rayDir = worldRayDir(vUV, uCameraPos, uInvViewProj);
        float cosAngle = dot(rayDir, uSunDir);
        float sunDisk = smoothstep(0.9998, 0.9999, cosAngle);
        
        color += vec3(20.0, 18.0, 15.0) * sunDisk * cloud.a * atm.a;
    }
    
    
    color = acesTonemap(color);
    
    
    color = pow(color, vec3(1.0 / 2.2));
    
    fragColor = vec4(color, 1.0);
}`,f=`#version 300 es
precision highp float;
precision highp sampler3D;

const float PLANET_SCALE = 1.0 / 1000.0;  
const float PLANET_RADIUS = 6371.0;
const float ATMOSPHERE_SCALE = 30.0; 
const float ATMOSPHERE_RADIUS = PLANET_RADIUS + 100.0 * ATMOSPHERE_SCALE;
const float PI = 3.14159265358979323846;
vec2 raySphereIntersect(vec3 ro, vec3 rd, vec3 sc, float r) {
    vec3 oc = ro - sc;
    float b = dot(oc, rd);        
    float c = dot(oc, oc) - r * r;
    float h = b * b - c;          
    if (h < 0.0) return vec2(-1.0);
    h = sqrt(h);
    return vec2(-b - h, -b + h);  
}
vec3 worldPosFromDepth(float depth, vec2 uv, mat4 invViewProj) {
    vec4 ndc = vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
    vec4 worldPos = invViewProj * ndc;
    return worldPos.xyz / worldPos.w;
}

vec3 worldRayDir(vec2 uv, vec3 cameraPos, mat4 invViewProj) {
    vec4 ndc = vec4(uv * 2.0 - 1.0, 1.0, 1.0);
    vec4 worldPos = invViewProj * ndc;
    return normalize(worldPos.xyz / worldPos.w - cameraPos);
}

in vec2 vUV;
out vec4 fragColor;

uniform vec3 uCameraPos;
uniform vec3 uSunDir;
uniform mat4 uInvViewProj;
uniform sampler2D uGBufferDepth;
uniform sampler3D uNoiseVolume;

const float CLOUD_BOTTOM = 10.0 * ATMOSPHERE_SCALE;
const float CLOUD_TOP = 50.0 * ATMOSPHERE_SCALE;
const float CLOUD_COVERAGE = 0.333; 
const float CLOUD_DENSITY_SCALE = 1.0; 
const int CLOUD_STEPS = 256;
const int SHADOW_STEPS = 16;

float hgPhase(float cosTheta, float g) {
    float g2 = g * g;
    return (1.0 - g2) / (4.0 * 3.14159265 * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5));
}

float dualLobePhase(float cosTheta) {
    float forward = hgPhase(cosTheta, 0.8);
    float back = hgPhase(cosTheta, -0.5);
    return mix(back, forward, 0.7);
}

float powderEffect(float density) {
    return 1.0 - exp(-density * 2.0);
}

float cloudDensity(vec3 pos) {
    float altitude = length(pos) - PLANET_RADIUS;
    if (altitude < CLOUD_BOTTOM || altitude > CLOUD_TOP) {
        return 0.0;
    }

    float heightFraction = (altitude - CLOUD_BOTTOM) / (CLOUD_TOP - CLOUD_BOTTOM);
    float heightShape = smoothstep(0.0, 0.2, heightFraction) * smoothstep(1.0, 0.5, heightFraction);

    
    vec3 noiseUV = pos  / ATMOSPHERE_RADIUS + 0.5; 
    vec4 noise = texture(uNoiseVolume, noiseUV) * heightShape; 

    float baseShape = noise.r; 
    float detail = (noise.g * 0.5 + noise.b * 0.25 + noise.a * 0.125); 

    float density = baseShape - (1.0 - CLOUD_COVERAGE); 
    density = max(density, 0.0);

    
    density = max(0.0, density - detail * 0.6);

    return density * CLOUD_DENSITY_SCALE;
}

float lightMarch(vec3 pos, vec3 sunDir) {

    vec2 planetHit = raySphereIntersect(pos, sunDir, vec3(0.0), PLANET_RADIUS);
    if (planetHit.y > 0.0 && planetHit.x > 0.0) {
        
        return 1000.0; 
    }

    
    vec2 outerHit = raySphereIntersect(pos, sunDir, vec3(0.0), PLANET_RADIUS + CLOUD_TOP);
    if (outerHit.y <= 0.0) return 0.0;
    
    float marchDist = outerHit.y;  
    float stepSize = marchDist / float(SHADOW_STEPS);
    
    float totalDensity = 0.0;
    for (int i = 0; i < SHADOW_STEPS; i++) {
        vec3 samplePos = pos + sunDir * (float(i) + 0.5) * stepSize;
        totalDensity += max(0.0, cloudDensity(samplePos)) * stepSize;
    }
    return totalDensity;
}

void main() {
    vec3 rayDir = worldRayDir(vUV, uCameraPos, uInvViewProj);

    float depth = texture(uGBufferDepth, vUV).r;
    bool hitSurface = depth < 1.0;
    vec3 surfacePos = worldPosFromDepth(depth, vUV, uInvViewProj);
    float surfaceDistance = hitSurface ? length(surfacePos - uCameraPos) : 1e30;

    
    vec2 outerHit = raySphereIntersect(uCameraPos, rayDir, vec3(0.0), PLANET_RADIUS + CLOUD_TOP);
    vec2 innerHit = raySphereIntersect(uCameraPos, rayDir, vec3(0.0), PLANET_RADIUS + CLOUD_BOTTOM);

    if (outerHit.y < 0.0) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0); 
        return;
    }

    float cameraAltitude = length(uCameraPos) - PLANET_RADIUS;
    float tStart, tEnd;

    if (cameraAltitude < CLOUD_BOTTOM) {
        
        if (innerHit.y < 0.0) {
            
            fragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }
        tStart = innerHit.y;
        tEnd = min(outerHit.y, surfaceDistance);

    } else if (cameraAltitude < CLOUD_TOP) {
        
        tStart = 0.0;
        tEnd = min(outerHit.y, surfaceDistance);

    } else {
        
        
        tStart = max(outerHit.x, 0.0);
        tEnd = innerHit.x > 0.0 ? min(innerHit.x, surfaceDistance) : min(outerHit.y, surfaceDistance);
    }

    if (tEnd <= tStart) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }   

    
    float stepSize = (tEnd - tStart) / float(CLOUD_STEPS);
    vec3 scatteredLight = vec3(0.0);
    float transmittance = 1.0;

    for (int i = 0; i < CLOUD_STEPS; i++) {
        if (transmittance < 0.01) break;
        
        float t = tStart + (float(i) + 0.5) * stepSize;
        vec3 samplePos = uCameraPos + rayDir * t;
        
        if (length(samplePos) < PLANET_RADIUS + CLOUD_BOTTOM) continue;
        
        float density = cloudDensity(samplePos);
        if (density <= 0.0) continue;
        
        
        float lightDensity = lightMarch(samplePos, uSunDir);
        float lightTransmittance = exp(-lightDensity * 0.2);
        float cosTheta = dot(rayDir, uSunDir);
        float phase = dualLobePhase(cosTheta);
        float powder = powderEffect(density);
        
        vec3 sunColor = vec3(1.0, 0.95, 0.85) * 100.0;
        vec3 ambient = vec3(0.4, 0.5, 0.6) * 0.4;
        vec3 luminance = sunColor * lightTransmittance * phase * powder + ambient;
        
        float stepTransmittance = exp(-density * stepSize);
        scatteredLight += transmittance * (1.0 - stepTransmittance) * luminance;
        transmittance *= stepTransmittance;
    }

    fragColor = vec4(scatteredLight, transmittance);
}`,p=`#version 300 es
precision highp float;

in vec2 vUV;
uniform sampler2D uTexture;
out vec4 fragColor;
void main() {
    
    fragColor = texture(uTexture, vUV);
    fragColor = vec4(fragColor.r,  fragColor.g, fragColor.b, fragColor.a);
}`,m=class{static generate(e,t){let n=[{normal:[1,0,0],tangent:[0,0,-1],bitangent:[0,-1,0]},{normal:[-1,0,0],tangent:[0,0,1],bitangent:[0,-1,0]},{normal:[0,1,0],tangent:[1,0,0],bitangent:[0,0,1]},{normal:[0,-1,0],tangent:[1,0,0],bitangent:[0,0,-1]},{normal:[0,0,1],tangent:[1,0,0],bitangent:[0,-1,0]},{normal:[0,0,-1],tangent:[-1,0,0],bitangent:[0,-1,0]}],r=[],i=[];for(let i of n)for(let n=0;n<=e;n++)for(let a=0;a<=e;a++){let o=a/e,s=n/e,c=[i.normal[0]+(o-.5)*2*i.tangent[0]+(s-.5)*2*i.bitangent[0],i.normal[1]+(o-.5)*2*i.tangent[1]+(s-.5)*2*i.bitangent[1],i.normal[2]+(o-.5)*2*i.tangent[2]+(s-.5)*2*i.bitangent[2]],l=Math.sqrt(c[0]**2+c[1]**2+c[2]**2),u=[c[0]/l*t,c[1]/l*t,c[2]/l*t],d=[u[0]/t,u[1]/t,u[2]/t];r.push(...u,...d)}for(let t=0;t<n.length;t++){let n=t*(e+1)*(e+1);for(let t=0;t<e;t++)for(let r=0;r<e;r++){let a=n+t*(e+1)+r,o=n+t*(e+1)+(r+1),s=n+(t+1)*(e+1)+r,c=n+(t+1)*(e+1)+(r+1);i.push(a,s,o),i.push(o,s,c)}}return{vertices:new Float32Array(r),indices:new Uint16Array(i)}}},h=class{constructor(e,t,n,i,a){r(this,`vao`,void 0),r(this,`vbo`,void 0),r(this,`ibo`,void 0),r(this,`indexCount`,void 0),r(this,`indexType`,void 0),this.gl=e,this.vao=e.createVertexArray(),this.vbo=e.createBuffer(),e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,this.vbo),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),a.forEach(t=>{e.enableVertexAttribArray(t.location),e.vertexAttribPointer(t.location,t.components,t.type,!1,i,t.offsetBytes)}),n?(this.ibo=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ibo),e.bufferData(e.ELEMENT_ARRAY_BUFFER,n,e.STATIC_DRAW),this.indexCount=n.length,this.indexType=n instanceof Uint32Array?e.UNSIGNED_INT:e.UNSIGNED_SHORT):(this.ibo=null,this.indexCount=t.length/(i/4),this.indexType=0),this.indexCount=n?n.length:t.length/(i/4),this.indexType=n instanceof Uint32Array?e.UNSIGNED_INT:e.UNSIGNED_SHORT,e.bindVertexArray(null),e.bindBuffer(e.ARRAY_BUFFER,null),n&&e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null)}draw(){this.gl.bindVertexArray(this.vao),this.ibo?this.gl.drawElements(this.gl.TRIANGLES,this.indexCount,this.indexType,0):this.gl.drawArrays(this.gl.TRIANGLES,0,this.indexCount),this.gl.bindVertexArray(null)}dispose(){this.gl.deleteBuffer(this.vbo),this.ibo&&this.gl.deleteBuffer(this.ibo),this.gl.deleteVertexArray(this.vao)}},g=class{constructor(e,t,n){this.x=e,this.y=t,this.z=n}dot2(e,t){return this.x*e+this.y*t}dot3(e,t,n){return this.x*e+this.y*t+this.z*n}},_=class{constructor(e=0){r(this,`permutationTable`,[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180]),r(this,`grad3`,[new g(1,1,0),new g(-1,1,0),new g(1,-1,0),new g(-1,-1,0),new g(1,0,1),new g(-1,0,1),new g(1,0,-1),new g(-1,0,-1),new g(0,1,1),new g(0,-1,1),new g(0,1,-1),new g(0,-1,-1)]),r(this,`perm`,Array(512)),r(this,`gradP`,Array(512)),r(this,`F2`,.5*(Math.sqrt(3)-1)),r(this,`G2`,(3-Math.sqrt(3))/6),r(this,`F3`,1/3),r(this,`G3`,1/6),e>0&&e<1&&(e*=65536),e=Math.floor(e),e<256&&(e|=e<<8);for(let t=0;t<256;t++){let n;n=t&1?this.permutationTable[t]^e&255:this.permutationTable[t]^e>>8&255,this.perm[t]=this.perm[t+256]=n,this.gradP[t]=this.gradP[t+256]=this.grad3[n%12]}}simplex2(e,t){let n,r,i,a=(e+t)*this.F2,o=Math.floor(e+a),s=Math.floor(t+a),c=(o+s)*this.G2,l=e-o+c,u=t-s+c,d,f;l>u?(d=1,f=0):(d=0,f=1);let p=l-d+this.G2,m=u-f+this.G2,h=l-1+2*this.G2,g=u-1+2*this.G2;o&=255,s&=255;let _=this.gradP[o+this.perm[s]],v=this.gradP[o+d+this.perm[s+f]],y=this.gradP[o+1+this.perm[s+1]],b=.5-l*l-u*u;b<0?n=0:(b*=b,n=b*b*_.dot2(l,u));let x=.5-p*p-m*m;x<0?r=0:(x*=x,r=x*x*v.dot2(p,m));let S=.5-h*h-g*g;return S<0?i=0:(S*=S,i=S*S*y.dot2(h,g)),70*(n+r+i)}simplex3(e,t,n){let r,i,a,o,s=(e+t+n)*this.F3,c=Math.floor(e+s),l=Math.floor(t+s),u=Math.floor(n+s),d=(c+l+u)*this.G3,f=e-c+d,p=t-l+d,m=n-u+d,h,g,_,v,y,b;f>=p?p>=m?(h=1,g=0,_=0,v=1,y=1,b=0):f>=m?(h=1,g=0,_=0,v=1,y=0,b=1):(h=0,g=0,_=1,v=1,y=0,b=1):p<m?(h=0,g=0,_=1,v=0,y=1,b=1):f<m?(h=0,g=1,_=0,v=0,y=1,b=1):(h=0,g=1,_=0,v=1,y=1,b=0);let x=f-h+this.G3,S=p-g+this.G3,C=m-_+this.G3,w=f-v+2*this.G3,T=p-y+2*this.G3,E=m-b+2*this.G3,D=f-1+3*this.G3,O=p-1+3*this.G3,k=m-1+3*this.G3;c&=255,l&=255,u&=255;let A=this.gradP[c+this.perm[l+this.perm[u]]],j=this.gradP[c+h+this.perm[l+g+this.perm[u+_]]],M=this.gradP[c+v+this.perm[l+y+this.perm[u+b]]],N=this.gradP[c+1+this.perm[l+1+this.perm[u+1]]],P=.6-f*f-p*p-m*m;P<0?r=0:(P*=P,r=P*P*A.dot3(f,p,m));let F=.6-x*x-S*S-C*C;F<0?i=0:(F*=F,i=F*F*j.dot3(x,S,C));let I=.6-w*w-T*T-E*E;I<0?a=0:(I*=I,a=I*I*M.dot3(w,T,E));let L=.6-D*D-O*O-k*k;return L<0?o=0:(L*=L,o=L*L*N.dot3(D,O,k)),32*(r+i+a+o)}fade(e){return e*e*e*(e*(e*6-15)+10)}lerp(e,t,n){return(1-n)*e+n*t}perlin2(e,t){let n=Math.floor(e),r=Math.floor(t);e-=n,t-=r,n&=255,r&=255;let i=this.gradP[n+this.perm[r]].dot2(e,t),a=this.gradP[n+this.perm[r+1]].dot2(e,t-1),o=this.gradP[n+1+this.perm[r]].dot2(e-1,t),s=this.gradP[n+1+this.perm[r+1]].dot2(e-1,t-1),c=this.fade(e);return this.lerp(this.lerp(i,o,c),this.lerp(a,s,c),this.fade(t))}perlin3(e,t,n){let r=Math.floor(e),i=Math.floor(t),a=Math.floor(n);e-=r,t-=i,n-=a,r&=255,i&=255,a&=255;let o=this.gradP[r+this.perm[i+this.perm[a]]].dot3(e,t,n),s=this.gradP[r+this.perm[i+this.perm[a+1]]].dot3(e,t,n-1),c=this.gradP[r+this.perm[i+1+this.perm[a]]].dot3(e,t-1,n),l=this.gradP[r+this.perm[i+1+this.perm[a+1]]].dot3(e,t-1,n-1),u=this.gradP[r+1+this.perm[i+this.perm[a]]].dot3(e-1,t,n),d=this.gradP[r+1+this.perm[i+this.perm[a+1]]].dot3(e-1,t,n-1),f=this.gradP[r+1+this.perm[i+1+this.perm[a]]].dot3(e-1,t-1,n),p=this.gradP[r+1+this.perm[i+1+this.perm[a+1]]].dot3(e-1,t-1,n-1),m=this.fade(e),h=this.fade(t),g=this.fade(n);return this.lerp(this.lerp(this.lerp(o,u,m),this.lerp(s,d,m),g),this.lerp(this.lerp(c,f,m),this.lerp(l,p,m),g),h)}},v=class{static generate(e,t=4){let n=new _,r=new Uint8Array(e*e*e*4),i=[];for(let e=0;e<t;e++)for(let n=0;n<t;n++)for(let r=0;r<t;r++)i.push([(e+Math.random())/t,(n+Math.random())/t,(r+Math.random())/t]);for(let a=0;a<e;a++)for(let o=0;o<e;o++)for(let s=0;s<e;s++){let c=s/e,l=o/e,u=a/e,d=1/0;for(let e of i)for(let t=-1;t<=1;t++)for(let n=-1;n<=1;n++)for(let r=-1;r<=1;r++){let i=e[0]+t,a=e[1]+n,o=e[2]+r,s=c-i,f=l-a,p=u-o,m=s*s+f*f+p*p;d=Math.min(d,m)}let f=(Math.sqrt(3)/t)**2,p=1-Math.min(1,d/f),m=n.perlin3(c*16,l*16,u*16),h=n.perlin3(c*32,l*32,u*32),g=n.perlin3(c*64,l*64,u*64),_=(a*e*e+o*e+s)*4;r[_]=Math.floor(p*255),r[_+1]=Math.floor((m*.5+.5)*255),r[_+2]=Math.floor((h*.5+.5)*255),r[_+3]=Math.floor((g*.5+.5)*255)}return r}},y=class{constructor(e,t=64){r(this,`texture`,void 0),r(this,`resolution`,void 0),this.resolution=t;let n=performance.now(),i=v.generate(t),a=performance.now();console.log(`Generated FBM Worley noise volume in ${(a-n).toFixed(2)} ms`);let o=e.createTexture();if(!o)throw Error(`Failed to create texture`);e.bindTexture(e.TEXTURE_3D,o),e.texImage3D(e.TEXTURE_3D,0,e.RGBA8,t,t,t,0,e.RGBA,e.UNSIGNED_BYTE,i),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_S,e.REPEAT),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_T,e.REPEAT),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_R,e.REPEAT),this.texture=o}},b=typeof Float32Array<`u`?Float32Array:Array;Math.PI/180,180/Math.PI;function x(){var e=new b(9);return b!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function S(){var e=new b(16);return b!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function C(e){return e[0]=1,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=1,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[10]=1,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,e}function w(e,t){var n=t[0],r=t[1],i=t[2],a=t[3],o=t[4],s=t[5],c=t[6],l=t[7],u=t[8],d=t[9],f=t[10],p=t[11],m=t[12],h=t[13],g=t[14],_=t[15],v=n*s-r*o,y=n*c-i*o,b=n*l-a*o,x=r*c-i*s,S=r*l-a*s,C=i*l-a*c,w=u*h-d*m,T=u*g-f*m,E=u*_-p*m,D=d*g-f*h,O=d*_-p*h,k=f*_-p*g,A=v*k-y*O+b*D+x*E-S*T+C*w;return A?(A=1/A,e[0]=(s*k-c*O+l*D)*A,e[1]=(i*O-r*k-a*D)*A,e[2]=(h*C-g*S+_*x)*A,e[3]=(f*S-d*C-p*x)*A,e[4]=(c*E-o*k-l*T)*A,e[5]=(n*k-i*E+a*T)*A,e[6]=(g*b-m*C-_*y)*A,e[7]=(u*C-f*b+p*y)*A,e[8]=(o*O-s*E+l*w)*A,e[9]=(r*E-n*O-a*w)*A,e[10]=(m*S-h*b+_*v)*A,e[11]=(d*b-u*S-p*v)*A,e[12]=(s*T-o*D-c*w)*A,e[13]=(n*D-r*T+i*w)*A,e[14]=(h*y-m*x-g*v)*A,e[15]=(u*x-d*y+f*v)*A,e):null}function T(e,t,n){var r=t[0],i=t[1],a=t[2],o=t[3],s=t[4],c=t[5],l=t[6],u=t[7],d=t[8],f=t[9],p=t[10],m=t[11],h=t[12],g=t[13],_=t[14],v=t[15],y=n[0],b=n[1],x=n[2],S=n[3];return e[0]=y*r+b*s+x*d+S*h,e[1]=y*i+b*c+x*f+S*g,e[2]=y*a+b*l+x*p+S*_,e[3]=y*o+b*u+x*m+S*v,y=n[4],b=n[5],x=n[6],S=n[7],e[4]=y*r+b*s+x*d+S*h,e[5]=y*i+b*c+x*f+S*g,e[6]=y*a+b*l+x*p+S*_,e[7]=y*o+b*u+x*m+S*v,y=n[8],b=n[9],x=n[10],S=n[11],e[8]=y*r+b*s+x*d+S*h,e[9]=y*i+b*c+x*f+S*g,e[10]=y*a+b*l+x*p+S*_,e[11]=y*o+b*u+x*m+S*v,y=n[12],b=n[13],x=n[14],S=n[15],e[12]=y*r+b*s+x*d+S*h,e[13]=y*i+b*c+x*f+S*g,e[14]=y*a+b*l+x*p+S*_,e[15]=y*o+b*u+x*m+S*v,e}function E(e,t,n,r,i){var a=1/Math.tan(t/2);if(e[0]=a/n,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=a,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,i!=null&&i!==1/0){var o=1/(r-i);e[10]=(i+r)*o,e[14]=2*i*r*o}else e[10]=-1,e[14]=-2*r;return e}var D=E;function O(e,t,n,r){var i,a,o,s,c,l,u,d,f,p,m=t[0],h=t[1],g=t[2],_=r[0],v=r[1],y=r[2],b=n[0],x=n[1],S=n[2];return Math.abs(m-b)<1e-6&&Math.abs(h-x)<1e-6&&Math.abs(g-S)<1e-6?C(e):(u=m-b,d=h-x,f=g-S,p=1/Math.sqrt(u*u+d*d+f*f),u*=p,d*=p,f*=p,i=v*f-y*d,a=y*u-_*f,o=_*d-v*u,p=Math.sqrt(i*i+a*a+o*o),p?(p=1/p,i*=p,a*=p,o*=p):(i=0,a=0,o=0),s=d*o-f*a,c=f*i-u*o,l=u*a-d*i,p=Math.sqrt(s*s+c*c+l*l),p?(p=1/p,s*=p,c*=p,l*=p):(s=0,c=0,l=0),e[0]=i,e[1]=s,e[2]=u,e[3]=0,e[4]=a,e[5]=c,e[6]=d,e[7]=0,e[8]=o,e[9]=l,e[10]=f,e[11]=0,e[12]=-(i*m+a*h+o*g),e[13]=-(s*m+c*h+l*g),e[14]=-(u*m+d*h+f*g),e[15]=1,e)}function k(){var e=new b(3);return b!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function A(e){var t=e[0],n=e[1],r=e[2];return Math.sqrt(t*t+n*n+r*r)}function j(e,t,n){var r=new b(3);return r[0]=e,r[1]=t,r[2]=n,r}function M(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e}function N(e,t,n){return e[0]=t[0]+n[0],e[1]=t[1]+n[1],e[2]=t[2]+n[2],e}function P(e,t,n){return e[0]=t[0]-n[0],e[1]=t[1]-n[1],e[2]=t[2]-n[2],e}function F(e,t,n){return e[0]=t[0]*n,e[1]=t[1]*n,e[2]=t[2]*n,e}function I(e,t,n,r){return e[0]=t[0]+n[0]*r,e[1]=t[1]+n[1]*r,e[2]=t[2]+n[2]*r,e}function L(e,t){var n=t[0],r=t[1],i=t[2],a=n*n+r*r+i*i;return a>0&&(a=1/Math.sqrt(a)),e[0]=t[0]*a,e[1]=t[1]*a,e[2]=t[2]*a,e}function R(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function z(e,t,n){var r=t[0],i=t[1],a=t[2],o=n[0],s=n[1],c=n[2];return e[0]=i*c-a*s,e[1]=a*o-r*c,e[2]=r*s-i*o,e}function B(e,t,n){var r=n[0],i=n[1],a=n[2],o=n[3],s=t[0],c=t[1],l=t[2],u=i*l-a*c,d=a*s-r*l,f=r*c-i*s;return u+=u,d+=d,f+=f,e[0]=s+o*u+i*f-a*d,e[1]=c+o*d+a*u-r*f,e[2]=l+o*f+r*d-i*u,e}var V=A;(function(){var e=k();return function(t,n,r,i,a,o){var s,c;for(n||(n=3),r||(r=0),c=i?Math.min(i*n+r,t.length):t.length,s=r;s<c;s+=n)e[0]=t[s],e[1]=t[s+1],e[2]=t[s+2],a(e,e,o),t[s]=e[0],t[s+1]=e[1],t[s+2]=e[2];return t}})();function H(){var e=new b(4);return b!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function U(e,t){var n=t[0],r=t[1],i=t[2],a=t[3],o=n*n+r*r+i*i+a*a;return o>0&&(o=1/Math.sqrt(o)),e[0]=n*o,e[1]=r*o,e[2]=i*o,e[3]=a*o,e}(function(){var e=H();return function(t,n,r,i,a,o){var s,c;for(n||(n=4),r||(r=0),c=i?Math.min(i*n+r,t.length):t.length,s=r;s<c;s+=n)e[0]=t[s],e[1]=t[s+1],e[2]=t[s+2],e[3]=t[s+3],a(e,e,o),t[s]=e[0],t[s+1]=e[1],t[s+2]=e[2],t[s+3]=e[3];return t}})();function W(){var e=new b(4);return b!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function G(e){return e[0]=0,e[1]=0,e[2]=0,e[3]=1,e}function K(e,t,n){n*=.5;var r=Math.sin(n);return e[0]=r*t[0],e[1]=r*t[1],e[2]=r*t[2],e[3]=Math.cos(n),e}function q(e,t,n){var r=t[0],i=t[1],a=t[2],o=t[3],s=n[0],c=n[1],l=n[2],u=n[3];return e[0]=r*u+o*s+i*l-a*c,e[1]=i*u+o*c+a*s-r*l,e[2]=a*u+o*l+r*c-i*s,e[3]=o*u-r*s-i*c-a*l,e}function J(e,t,n,r){var i=t[0],a=t[1],o=t[2],s=t[3],c=n[0],l=n[1],u=n[2],d=n[3],f,p=i*c+a*l+o*u+s*d,m,h,g;return p<0&&(p=-p,c=-c,l=-l,u=-u,d=-d),1-p>1e-6?(f=Math.acos(p),m=Math.sin(f),h=Math.sin((1-r)*f)/m,g=Math.sin(r*f)/m):(h=1-r,g=r),e[0]=h*i+g*c,e[1]=h*a+g*l,e[2]=h*o+g*u,e[3]=h*s+g*d,e}function Y(e,t){var n=t[0]+t[4]+t[8],r;if(n>0)r=Math.sqrt(n+1),e[3]=.5*r,r=.5/r,e[0]=(t[5]-t[7])*r,e[1]=(t[6]-t[2])*r,e[2]=(t[1]-t[3])*r;else{var i=0;t[4]>t[0]&&(i=1),t[8]>t[i*3+i]&&(i=2);var a=(i+1)%3,o=(i+2)%3;r=Math.sqrt(t[i*3+i]-t[a*3+a]-t[o*3+o]+1),e[i]=.5*r,r=.5/r,e[3]=(t[a*3+o]-t[o*3+a])*r,e[a]=(t[a*3+i]+t[i*3+a])*r,e[o]=(t[o*3+i]+t[i*3+o])*r}return e}var X=U;(function(){var e=k(),t=j(1,0,0),n=j(0,1,0);return function(r,i,a){var o=R(i,a);return o<-.999999?(z(e,t,i),V(e)<1e-6&&z(e,n,i),L(e,e),K(r,e,Math.PI),r):o>.999999?(r[0]=0,r[1]=0,r[2]=0,r[3]=1,r):(z(e,i,a),r[0]=e[0],r[1]=e[1],r[2]=e[2],r[3]=1+o,X(r,r))}})(),function(){var e=W(),t=W();return function(n,r,i,a,o,s){return J(e,r,o,s),J(t,i,a,s),J(n,e,t,2*s*(1-s)),n}}(),function(){var e=x();return function(t,n,r,i){return e[0]=r[0],e[3]=r[1],e[6]=r[2],e[1]=i[0],e[4]=i[1],e[7]=i[2],e[2]=-n[0],e[5]=-n[1],e[8]=-n[2],X(t,Y(t,e))}}();var ee=class{constructor(e){r(this,`keysPressed`,void 0),r(this,`mouseDelta`,void 0),r(this,`pointerLocked`,void 0),this.keysPressed=new Set,this.mouseDelta={x:0,y:0},this.pointerLocked=!1,window.addEventListener(`keydown`,e=>{this.keysPressed.add(e.code)}),window.addEventListener(`keyup`,e=>{this.keysPressed.delete(e.code)}),window.addEventListener(`mousemove`,e=>{this.pointerLocked&&(this.mouseDelta.x+=e.movementX,this.mouseDelta.y+=e.movementY)}),e.addEventListener(`mousedown`,t=>{this.pointerLocked||e.requestPointerLock()}),document.addEventListener(`pointerlockchange`,()=>{this.pointerLocked=document.pointerLockElement===e})}isKeyPressed(e){return this.keysPressed.has(e)}getMouseDelta(){let e={...this.mouseDelta};return this.mouseDelta.x=0,this.mouseDelta.y=0,e}isPointerLocked(){return this.pointerLocked}},te=class{constructor(e){r(this,`position`,j(0,0,7171)),r(this,`orientation`,G(W())),r(this,`fov`,Math.PI/3),r(this,`aspect`,16/9),r(this,`near`,10),r(this,`far`,1e6),r(this,`viewMatrix`,S()),r(this,`projMatrix`,S()),r(this,`viewProjectionMatrix`,S()),r(this,`invViewProjectionMatrix`,S()),r(this,`forward`,k()),r(this,`right`,k()),r(this,`up`,k()),M(this.position,e),this.update()}rotatePitch(e){let t=K(W(),this.right,e);q(this.orientation,t,this.orientation),X(this.orientation,this.orientation)}rotateYaw(e){let t=L(k(),this.position),n=K(W(),t,e);q(this.orientation,n,this.orientation),X(this.orientation,this.orientation)}rotateRoll(e){let t=K(W(),this.forward,e);q(this.orientation,t,this.orientation),X(this.orientation,this.orientation)}update(){let e=L(k(),this.position),t=j(0,0,1);Math.abs(R(t,e))>.99&&(t=j(1,0,0));let n=L(k(),z(k(),t,e)),r=L(k(),z(k(),e,n));B(this.forward,n,this.orientation),B(this.right,r,this.orientation),B(this.up,e,this.orientation),L(this.forward,this.forward),L(this.right,this.right),L(this.up,this.up);let i=N(k(),this.position,this.forward);O(this.viewMatrix,this.position,i,this.up),D(this.projMatrix,this.fov,this.aspect,this.near,this.far),T(this.viewProjectionMatrix,this.projMatrix,this.viewMatrix),w(this.invViewProjectionMatrix,this.viewProjectionMatrix)}setAspect(e){this.aspect=e,this.update()}resetOrientation(){G(this.orientation),this.update()}},Z=6371,ne=class e{constructor(t){r(this,`canvas`,void 0),r(this,`gl`,void 0),r(this,`fullScreenQuad`,void 0),r(this,`cubeSphereMesh`,void 0),r(this,`noiseVolume`,void 0),r(this,`gbufferFB`,void 0),r(this,`atmosphereFB`,void 0),r(this,`cloudFB`,void 0),r(this,`compositeFB`,void 0),r(this,`gbufferShader`,void 0),r(this,`atmosphereShader`,void 0),r(this,`cloudShader`,void 0),r(this,`compositeShader`,void 0),r(this,`blitShader`,void 0),r(this,`input`,void 0),r(this,`camera`,void 0),r(this,`sunAngle`,0),r(this,`sunDir`,k()),r(this,`renderClouds`,!0),r(this,`debounceCloudToggle`,!0),r(this,`lastTime`,0),r(this,`lastWidth`,0),r(this,`lastHeight`,0),r(this,`hudElement`,void 0),r(this,`hudVisible`,!0),r(this,`debounceHudToggle`,!0),r(this,`fpsElement`,void 0),r(this,`fpsFrames`,0),r(this,`fpsLastUpdate`,0),r(this,`tick`,e=>{let t=e-this.lastTime;this.handleResize(),this.updateCamera(t),this.render(t),this.updateFps(e),this.lastTime=e,requestAnimationFrame(this.tick)}),this.canvas=t;let n=t.getContext(`webgl2`);if(!n)throw Error(`WebGL2 not supported`);this.gl=n,n.getExtension(`EXT_color_buffer_float`),n.getExtension(`OES_texture_float_linear`),n.getExtension(`EXT_float_blend`),this.fullScreenQuad=new a(this.gl);let g=m.generate(100,Z);this.cubeSphereMesh=new h(this.gl,g.vertices,g.indices,24,[{name:`aPosition`,location:0,components:3,type:this.gl.FLOAT,offsetBytes:0},{name:`aNormal`,location:1,components:3,type:this.gl.FLOAT,offsetBytes:12}]),this.noiseVolume=new y(this.gl,128),this.gbufferFB=new i(this.gl,t.width,t.height,[{name:`color`,internalFormat:this.gl.RGBA16F,format:this.gl.RGBA,type:this.gl.HALF_FLOAT}],{name:`depth`,internalFormat:this.gl.DEPTH_COMPONENT32F,format:this.gl.DEPTH_COMPONENT,type:this.gl.FLOAT}),this.atmosphereFB=new i(this.gl,t.width,t.height,[{name:`color`,internalFormat:this.gl.RGBA16F,format:this.gl.RGBA,type:this.gl.HALF_FLOAT}]),this.cloudFB=new i(this.gl,t.width,t.height,[{name:`color`,internalFormat:this.gl.RGBA16F,format:this.gl.RGBA,type:this.gl.HALF_FLOAT}]),this.compositeFB=new i(this.gl,t.width,t.height,[{name:`color`,internalFormat:this.gl.RGBA16F,format:this.gl.RGBA,type:this.gl.HALF_FLOAT}]),this.gbufferShader=new o(this.gl,l,c),this.atmosphereShader=new o(this.gl,s,u),this.cloudShader=new o(this.gl,s,f),this.compositeShader=new o(this.gl,s,d),this.blitShader=new o(this.gl,s,p),this.input=new ee(t),this.camera=new te([Z+800,0,0]),this.camera.setAspect(t.width/t.height),this.lastWidth=t.width,this.lastHeight=t.height,this.updateSunDirection(),this.hudElement=document.createElement(`div`),this.hudElement.style.cssText=`position:fixed;top:8px;left:8px;padding:6px 10px;background:rgba(0,0,0,0.5);color:#fff;font:14px monospace;pointer-events:none;z-index:10;white-space:pre`,this.fpsElement=document.createElement(`div`);let _=document.createElement(`div`);_.textContent=e.describeRenderer(n);let v=document.createElement(`div`);v.style.marginTop=`6px`,v.textContent=[`Mouse   look (click to lock)`,`W/A/S/D move`,`Space   up`,`Shift   down`,`Q/E     rotate sun`,`1/3     rotate sun (slow)`,`T       reset sun`,`R       reset orientation`,`C       toggle clouds`,`H       toggle HUD`].join(`
`),this.hudElement.append(this.fpsElement,_,v),document.body.appendChild(this.hudElement)}static describeRenderer(e){let t=e.getExtension(`WEBGL_debug_renderer_info`),n=t?e.getParameter(t.UNMASKED_RENDERER_WEBGL):e.getParameter(e.RENDERER);return`${/swiftshader|llvmpipe|softpipe|software|basic render|microsoft basic/i.test(n)?`Rendering: CPU (software)`:`Rendering: GPU`}\n${n}`}start(){console.log(`Starting app`),this.gl.clearColor(1,0,0,1),this.gl.clear(this.gl.COLOR_BUFFER_BIT),this.gl instanceof WebGL2RenderingContext?console.log(`WebGL2 context successfully initialized`):console.error(`Failed to initialize WebGL2 context`),this.gl.getExtension(`EXT_color_buffer_float`)?console.log(`EXT_color_buffer_float extension is available`):console.warn(`EXT_color_buffer_float extension is not available`),requestAnimationFrame(this.tick),console.log(`App started`)}handleResize(){let{width:e,height:t}=this.canvas;if(!(e===this.lastWidth&&t===this.lastHeight)&&!(e===0||t===0)){this.lastWidth=e,this.lastHeight=t;for(let n of[this.gbufferFB,this.atmosphereFB,this.cloudFB,this.compositeFB])n.resize(e,t);this.camera.setAspect(e/t)}}updateFps(e){this.fpsFrames++;let t=e-this.fpsLastUpdate;t>=500&&(this.fpsElement.textContent=`${Math.round(this.fpsFrames*1e3/t)} FPS`,this.fpsFrames=0,this.fpsLastUpdate=e)}render(e){let t=this.gl;this.gbufferFB.bind(),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),this.gbufferShader.use(),this.gbufferShader.setMat4(`uViewProjection`,new Float32Array(this.camera.viewProjectionMatrix)),this.gbufferShader.setMat4(`uModel`,new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])),this.cubeSphereMesh.draw(),this.atmosphereFB.bind(),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT),t.disable(t.DEPTH_TEST),this.atmosphereShader.use(),this.atmosphereShader.setVec3(`uCameraPos`,this.camera.position),this.atmosphereShader.setVec3(`uSunDir`,this.sunDir),this.atmosphereShader.setMat4(`uInvViewProj`,new Float32Array(this.camera.invViewProjectionMatrix)),this.atmosphereShader.setTexture(`uGBufferDepth`,this.gbufferFB.getDepthTexture(),0),this.fullScreenQuad.draw(),this.cloudFB.bind(),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT),this.renderClouds&&(this.cloudShader.use(),this.cloudShader.setVec3(`uSunDir`,this.sunDir),this.cloudShader.setVec3(`uCameraPos`,this.camera.position),this.cloudShader.setMat4(`uInvViewProj`,new Float32Array(this.camera.invViewProjectionMatrix)),this.cloudShader.setTexture(`uGBufferDepth`,this.gbufferFB.getDepthTexture(),0),this.cloudShader.setTexture(`uNoiseVolume`,this.noiseVolume.texture,1,t.TEXTURE_3D)),this.fullScreenQuad.draw(),this.cloudFB.bindDefault(),t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT),t.disable(t.DEPTH_TEST),this.compositeShader.use(),this.compositeShader.setTexture(`uGBufferColor`,this.gbufferFB.getColorTexture(`color`),0),this.compositeShader.setTexture(`uAtmosphere`,this.atmosphereFB.getColorTexture(`color`),1),this.compositeShader.setTexture(`uCloud`,this.cloudFB.getColorTexture(`color`),2),this.compositeShader.setTexture(`uGBufferDepth`,this.gbufferFB.getDepthTexture(),3),this.compositeShader.setVec3(`uCameraPos`,this.camera.position),this.compositeShader.setMat4(`uInvViewProj`,new Float32Array(this.camera.invViewProjectionMatrix)),this.compositeShader.setVec3(`uSunDir`,this.sunDir),this.fullScreenQuad.draw()}updateCamera(e){let t=e/1e3,n=A(this.camera.position)-Z,r=Math.max(1,n*.5),i=.002;if(this.input.isPointerLocked()){let e=this.input.getMouseDelta();this.camera.rotateYaw(-e.x*i),this.camera.rotatePitch(e.y*i)}this.input.isKeyPressed(`KeyC`)&&this.debounceCloudToggle?(this.renderClouds=!this.renderClouds,this.debounceCloudToggle=!1):!this.input.isKeyPressed(`KeyC`)&&!this.debounceCloudToggle&&(this.debounceCloudToggle=!0),this.input.isKeyPressed(`KeyH`)&&this.debounceHudToggle?(this.hudVisible=!this.hudVisible,this.hudElement.style.display=this.hudVisible?`block`:`none`,this.debounceHudToggle=!1):!this.input.isKeyPressed(`KeyH`)&&!this.debounceHudToggle&&(this.debounceHudToggle=!0);let a=k();this.input.isKeyPressed(`KeyW`)&&N(a,a,this.camera.forward),this.input.isKeyPressed(`KeyS`)&&P(a,a,this.camera.forward),this.input.isKeyPressed(`KeyA`)&&P(a,a,this.camera.right),this.input.isKeyPressed(`KeyD`)&&N(a,a,this.camera.right),A(a)>0&&(L(a,a),I(this.camera.position,this.camera.position,a,r*t));let o=L(k(),this.camera.position);this.input.isKeyPressed(`Space`)&&I(this.camera.position,this.camera.position,o,r*t),this.input.isKeyPressed(`ShiftLeft`)&&I(this.camera.position,this.camera.position,o,-r*t);let s=.5;this.input.isKeyPressed(`KeyQ`)&&(this.sunAngle-=s*t),this.input.isKeyPressed(`KeyE`)&&(this.sunAngle+=s*t),this.input.isKeyPressed(`Digit1`)&&(this.sunAngle-=s*.1*t),this.input.isKeyPressed(`Digit3`)&&(this.sunAngle+=s*.1*t),(this.input.isKeyPressed(`KeyQ`)||this.input.isKeyPressed(`KeyE`)||this.input.isKeyPressed(`Digit1`)||this.input.isKeyPressed(`Digit3`))&&this.updateSunDirection(),this.input.isKeyPressed(`KeyT`)&&(this.sunAngle=Math.PI/2,this.updateSunDirection()),this.input.isKeyPressed(`KeyR`)&&this.camera.resetOrientation();let c=A(this.camera.position),l=Z+20,u=Z+5e4;if(c<l||c>u){let e=Math.max(l,Math.min(u,c)),t=L(k(),this.camera.position);F(this.camera.position,t,e)}this.camera.update()}updateSunDirection(){this.sunDir[0]=Math.cos(this.sunAngle),this.sunDir[1]=Math.sin(this.sunAngle),this.sunDir[2]=0,L(this.sunDir,this.sunDir)}},Q=document.getElementById(`glCanvas`);function $(){let e=Math.min(window.devicePixelRatio,2);Q.width=Math.floor(Q.clientWidth*e),Q.height=Math.floor(Q.clientHeight*e)}$(),window.addEventListener(`resize`,$),new ne(Q).start();
//# sourceMappingURL=index-Q4iFg14p.js.map