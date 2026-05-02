const float PLANET_SCALE = 1.0 / 1000.0;  // 1 unit = 1 km
const float PLANET_RADIUS = 6371.0;
const float ATMOSPHERE_SCALE = 30.0; // Scale factor for atmosphere density
const float ATMOSPHERE_RADIUS = PLANET_RADIUS + 100.0 * ATMOSPHERE_SCALE;
const float PI = 3.14159265358979323846;
//TODO: Expose these as uniforms in the shader.