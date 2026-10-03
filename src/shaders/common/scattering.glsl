//Extinction coefficients for Rayleigh and Mie scattering
//Everything is in units of 1/m and will be scaled by PLANET_SCALE
const vec3 RAYLEIGH_COEFFICIENT = vec3(5.802e-6, 13.55e-6, 33.1e-6) * (1.0/ATMOSPHERE_SCALE) * 5.0;
const float MIE_COEFFICIENT = 2.0e-5 * (1.0/ATMOSPHERE_SCALE) * 0.7;
const float MIE_EXTINCTION = MIE_COEFFICIENT * 1.05;
const float RAYLEIGH_SCALE_HEIGHT = 8000.0 * ATMOSPHERE_SCALE;
const float MIE_SCALE_HEIGHT = 1200.0 * ATMOSPHERE_SCALE * 0.8;
const float MIE_G = 0.9; // anisotropy parameter

const vec3 betaR = RAYLEIGH_COEFFICIENT * (1.0 / PLANET_SCALE);
const float betaM = MIE_COEFFICIENT * (1.0 / PLANET_SCALE);
const float betaMExt = MIE_EXTINCTION * (1.0 / PLANET_SCALE);

const int VIEW_RAY_SAMPLES = 64;
const int SUN_RAY_SAMPLES = 16;

// The density of the atmosphere at a given position
// Returns vec2 (rayleigh density, mie density)
vec2 atmosphereDensity(vec3 position) {
    float altitude = length(position) - PLANET_RADIUS;
    float rayleighDensity = exp(-altitude / (RAYLEIGH_SCALE_HEIGHT * PLANET_SCALE));
    float mieDensity = exp(-altitude / (MIE_SCALE_HEIGHT * PLANET_SCALE));
    return vec2(rayleighDensity, mieDensity);
}

// Phase functions: how much light is scattered in a given direction
float rayleighPhase(float cosTheta) {
    return 3.0 / (16.0 * PI) * (1.0 + cosTheta * cosTheta);
}

// Mie phase function
float miePhase(float cosTheta, float g) {
    float g2 = g * g;
    float numerator = (1.0 - g2) * (1.0 + cosTheta * cosTheta);
    float denominator = (2.0 + g2) * pow(1.0 + g2 - 2.0 * g * cosTheta, 1.5);
    return (3.0 / (8.0 * PI)) * (numerator / denominator);
}

// Compute optical depth from a point to the sun
// Returns vec2 (rayleigh optical depth, mie optical depth)
vec2 sunRayOpticalDepth(vec3 position, vec3 sunDirection) {
    // If sun ray hits the planet, this point is in shadow
    vec2 planetHit = raySphereIntersect(position, sunDirection, vec3(0.0), PLANET_RADIUS);
    if (planetHit.x > 0.0) {
        // Ray hits planet. If point is in shadow, return large optical depth
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

// Main scattering function. Returns vec4(inscatteredLight.rgb, transmittance)
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

        // Density at this point
        vec2 density = atmosphereDensity(samplePos);
        vec2 stepOpticalDepth = density * stepSize;
        viewOpticalDepth += stepOpticalDepth;

        // Optical depth from sample point to the sun
        vec2 sunOpticalDepth = sunRayOpticalDepth(samplePos, sunDirection);

        // Total optical depth: from camera to sample, and from sample to sun
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

    //TODO: Sun intensity is constant, make uniform later
    finalLight *= 20.0;

    vec3 viewTransmittance = exp(-(
        betaR * viewOpticalDepth.x +
        vec3(betaMExt) * viewOpticalDepth.y
    ));

    // float alpha = dot(viewTransmittance, vec3(0.299, 0.587, 0.114));
    float alpha = dot(viewTransmittance, vec3(0.2126, 0.7152, 0.0722));

    // float totalOD = dot(betaR * viewOpticalDepth.x, vec3(0.333));
    // return vec4(vec3(totalOD * 0.1), 1.0);  // scale down to visible range

    // return vec4(vec3(rayLength / (ATMOSPHERE_RADIUS * 2.0)), 1.0);

    return vec4(finalLight, alpha);
}