#version 300 es
precision highp float;
precision highp sampler3D;

#include "./common/constants.glsl"
#include "./common/ray.glsl"
#include "./common/reconstruct.glsl"

in vec2 vUV;
out vec4 fragColor;

uniform vec3 uCameraPos;
uniform vec3 uSunDir;
uniform mat4 uInvViewProj;
uniform sampler2D uGBufferDepth;
uniform sampler3D uNoiseVolume;

const float CLOUD_BOTTOM = 10.0 * ATMOSPHERE_SCALE;
const float CLOUD_TOP = 50.0 * ATMOSPHERE_SCALE;
const float CLOUD_COVERAGE = 0.333; // Percentage of the sky covered by clouds
const float CLOUD_DENSITY_SCALE = 1.0; // Overall density of the clouds
const int CLOUD_STEPS = 256;
const int SHADOW_STEPS = 16;

// Henyey-Greenstein phase function with dual lobes
// Seems like magic, but the math checks out
float hgPhase(float cosTheta, float g) {
    float g2 = g * g;
    return (1.0 - g2) / (4.0 * 3.14159265 * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5));
}

float dualLobePhase(float cosTheta) {
    float forward = hgPhase(cosTheta, 0.8);
    float back = hgPhase(cosTheta, -0.5);
    return mix(back, forward, 0.7);
}

// Powder effect to darken edges of clouds
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

    // Sample noise for cloud structure
    vec3 noiseUV = pos  / ATMOSPHERE_RADIUS + 0.5; // Scale noise coordinates
    vec4 noise = texture(uNoiseVolume, noiseUV) * heightShape; // Modulate noise by height shape to fade out at edges

    float baseShape = noise.r; // Base cloud shape from noise
    float detail = (noise.g * 0.5 + noise.b * 0.25 + noise.a * 0.125); // Add finer details from noise

    float density = baseShape - (1.0 - CLOUD_COVERAGE); // Adjust density based on coverage
    density = max(density, 0.0);

    // Erode with detail to create more interesting shapes
    density = max(0.0, density - detail * 0.6);

    return density * CLOUD_DENSITY_SCALE;
}

float lightMarch(vec3 pos, vec3 sunDir) {

    vec2 planetHit = raySphereIntersect(pos, sunDir, vec3(0.0), PLANET_RADIUS);
    if (planetHit.y > 0.0 && planetHit.x > 0.0) {
        // Sun is blocked by planet
        return 1000.0; // effectively zero transmittance via exp(-density)
    }

    // March all the way to the cloud shell top
    vec2 outerHit = raySphereIntersect(pos, sunDir, vec3(0.0), PLANET_RADIUS + CLOUD_TOP);
    if (outerHit.y <= 0.0) return 0.0;
    
    float marchDist = outerHit.y;  // distance to cloud shell exit
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

    // Find ray path through the cloud layer
    vec2 outerHit = raySphereIntersect(uCameraPos, rayDir, vec3(0.0), PLANET_RADIUS + CLOUD_TOP);
    vec2 innerHit = raySphereIntersect(uCameraPos, rayDir, vec3(0.0), PLANET_RADIUS + CLOUD_BOTTOM);

    if (outerHit.y < 0.0) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0); // No cloud hit
        return;
    }


    float cameraAltitude = length(uCameraPos) - PLANET_RADIUS;
    float tStart, tEnd;

    if (cameraAltitude < CLOUD_BOTTOM) {
        // Camera below clouds: enter at inner shell exit, exit at outer shell exit
        if (innerHit.y < 0.0) {
            // Ray doesn't hit inner shell (looking sideways/down): no clouds
            fragColor = vec4(0.0, 0.0, 0.0, 1.0);
            return;
        }
        tStart = innerHit.y;
        tEnd = min(outerHit.y, surfaceDistance);

    } else if (cameraAltitude < CLOUD_TOP) {
        // Camera inside cloud layer: start at camera, exit at outer shell
        tStart = 0.0;
        tEnd = min(outerHit.y, surfaceDistance);

    } else {
        // Camera above clouds: enter at outer shell entry, exit at inner shell entry
        // (or outer shell exit if ray doesn't hit inner shell)
        tStart = max(outerHit.x, 0.0);
        tEnd = innerHit.x > 0.0 ? min(innerHit.x, surfaceDistance) : min(outerHit.y, surfaceDistance);
    }

    if (tEnd <= tStart) {
        fragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
    }   

    // Ray march through the cloud layer
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
        
        // Lighting
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
}