vec2 raySphereIntersect(vec3 ro, vec3 rd, vec3 sc, float r) {
    vec3 oc = ro - sc;
    float b = dot(oc, rd);        // half-b, no factor of 2
    float c = dot(oc, oc) - r * r;
    float h = b * b - c;          // discriminant / 4, no factor of 4
    if (h < 0.0) return vec2(-1.0);
    h = sqrt(h);
    return vec2(-b - h, -b + h);  // solutions are -b ± h directly
}