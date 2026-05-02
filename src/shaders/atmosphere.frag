#version 300 es
precision highp float;

#include "./common/constants.glsl"
#include "./common/ray.glsl"
#include "./common/reconstruct.glsl"
#include "./common/scattering.glsl"

// Calculates the atmospheric effect for a given ray.
// It takes into account the camera position, view-projection matrix, and sun direction.

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

    //TODO: Assuming only one planet centered at the origin
    vec2 atmosphereHit = raySphereIntersect(uCameraPos, rayDir, vec3(0.0), ATMOSPHERE_RADIUS);

    if (atmosphereHit.y < 0.0) {
        // Black for no atmosphere hit, only seeing space
        // TODO: Stars?
        fragColor = vec4(0.0, 0.0, 0.0, 1.0); 
        return;
    }

    // Calculate TOF in atmosphere
    // Start at our current position if we're inside the atmosphere, otherwise start at the first intersection
    float tStart = max(atmosphereHit.x, 0.0);
    // End at the surface if we hit it, otherwise end at the last intersection
    float tEnd = min(atmosphereHit.y, surfaceDistance);

    if (tEnd <= tStart) {
        // Handle tangent case and floating point error
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }

    fragColor = computeScattering(uCameraPos, rayDir, tStart, tEnd, uSunDir);
}