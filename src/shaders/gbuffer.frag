#version 300 es
precision highp float;

in vec3 vWorldPos;
in vec3 vWorldNormal;

out vec4 fragColor;

void main() {
    fragColor = vec4(normalize(vWorldPos) * 0.5 + 0.5, 1.0);
    // Visualize normals as colors for debugging
}