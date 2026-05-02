vec3 worldPosFromDepth(float depth, vec2 uv, mat4 invViewProj) {
    vec4 ndc = vec4(uv * 2.0 - 1.0, depth * 2.0 - 1.0, 1.0);
    vec4 worldPos = invViewProj * ndc;
    return worldPos.xyz / worldPos.w;
}

vec3 worldRayDir(vec2 uv, vec3 cameraPos, mat4 invViewProj) {
    vec4 ndc = vec4(uv * 2.0 - 1.0, 1.0, 1.0);
    vec4 worldPos = invViewProj * ndc;
    return normalize(worldPos.xyz / worldPos.w - cameraPos);
}