#version 300 es
precision highp float;

in vec2 vUV;
uniform sampler2D uTexture;
out vec4 fragColor;
void main() {
    // Sample the texture using the UV coordinates
    fragColor = texture(uTexture, vUV);
    fragColor = vec4(fragColor.r,  fragColor.g, fragColor.b, fragColor.a);
    // Zero red channel to visualize the blit effect
}