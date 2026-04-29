#version 300 es
precision highp float;

in vec2 vUV;
uniform float uTime;
out vec4 fragColor;

void main() {
    // Create a simple animated gradient based on UV coordinates and time
    float r = 0.5 + 0.5 * sin(uTime * 2.0 + vUV.x * 10.0);
    float g = 0.5 + 0.5 * sin(uTime + vUV.y * 10.0);
    float b = 0.5 + 0.5 * sin(uTime * -1.0 + (vUV.x + vUV.y) * 10.0);
    fragColor = vec4(r, g, b, 1.0);
}