#version 300 es
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
    vWorldNormal = mat3(uModel) * aNormal; // Transform normal to world space
    gl_Position = uViewProjection * worldPos;
}