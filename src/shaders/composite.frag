#version 300 es
precision highp float;

// Composites the atmosphere and surface colors.

in vec2 vUV;
out vec4 fragColor;

uniform sampler2D uAtmosphere;
uniform sampler2D uCloud;
uniform sampler2D uGBufferDepth;
uniform sampler2D uGBufferColor;
uniform vec3 uCameraPos;
uniform mat4 uInvViewProj;
uniform vec3 uSunDir;

#include "./common/constants.glsl"
#include "./common/ray.glsl"
#include "./common/reconstruct.glsl"

// ACES tonemapping
vec3 acesTonemap(vec3 x) {
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

vec3 worldRayDir(vec2 uv, vec3 cameraPos, mat4 invViewProj);  // declare or include

void main() {
    vec3 sceneColor = texture(uGBufferColor, vUV).rgb;
    vec4 atm = texture(uAtmosphere, vUV);
    vec4 cloud = texture(uCloud, vUV);
    float depth = texture(uGBufferDepth, vUV).r;
    
    vec3 color = sceneColor * atm.a + atm.rgb;
    color = color * cloud.a + cloud.rgb;
    
    // Sun disk, rendered if no surface in front
    if (depth >= 1.0) {
        vec3 rayDir = worldRayDir(vUV, uCameraPos, uInvViewProj);
        float cosAngle = dot(rayDir, uSunDir);
        float sunDisk = smoothstep(0.9998, 0.9999, cosAngle);
        // Sun color, attenuated by cloud and atmosphere transmittance
        color += vec3(20.0, 18.0, 15.0) * sunDisk * cloud.a * atm.a;
    }
    
    // Tonemap
    color = acesTonemap(color);
    
    // Gamma correction
    color = pow(color, vec3(1.0 / 2.2));
    
    fragColor = vec4(color, 1.0);
}