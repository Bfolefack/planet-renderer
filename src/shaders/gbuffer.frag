#version 300 es
precision highp float;

in vec3 vWorldPos;
in vec3 vWorldNormal;

out vec4 fragColor;

void main() {
    // fragColor = vec4(normalize(vWorldPos) * 0.5 + 0.5, 1.0);
    // Dark green with sinusoidal pattern
    // float pattern = sin(vWorldPos.x * 1e-4) * cos(vWorldPos.z * 1e-4);
    // fragColor = vec4(0.0, 0.5 + 0.5 * pattern, 0.0, 1.0);
    fragColor = vec4(0.0, 1.0, 0.0, 1.0);
    // Visualize normals as colors for debugging
}