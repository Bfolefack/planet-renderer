export class CubeSphere {
    static generate(resolution: number, radius: number): {
        vertices: Float32Array; 
        indices: Uint16Array;
    } {
        const faces = [
            { // +X face
                normal: [1, 0, 0],
                tangent: [0, 0, -1],
                bitangent: [0, -1, 0]
            },
            { // -X face
                normal: [-1, 0, 0],
                tangent: [0, 0, 1],
                bitangent: [0, -1, 0]
            },
            { // +Y face
                normal: [0, 1, 0],
                tangent: [1, 0, 0],
                bitangent: [0, 0, 1]
            },
            { // -Y face
                normal: [0, -1, 0],
                tangent: [1, 0, 0],
                bitangent: [0, 0, -1]
            },
            { // +Z face
                normal: [0, 0, 1],
                tangent: [1, 0, 0],
                bitangent: [0, -1, 0]
            },
            { // -Z face
                normal: [0, 0, -1],
                tangent: [-1, 0, 0],
                bitangent: [0, -1, 0]
            }
        ];

        const vertices: number[] = [];
        const indices: number[] = [];

        for (const face of faces) {
            for (let y = 0; y <= resolution; y++) {
                for (let x = 0; x <= resolution; x++) {
                    // Map (x, y) to [-1, 1] range
                    const u = x / resolution;
                    const v = y / resolution;
                    const pointOnFace = [
                        face.normal[0] + (u - 0.5) * 2 * face.tangent[0] + (v - 0.5) * 2 * face.bitangent[0],
                        face.normal[1] + (u - 0.5) * 2 * face.tangent[1] + (v - 0.5) * 2 * face.bitangent[1],
                        face.normal[2] + (u - 0.5) * 2 * face.tangent[2] + (v - 0.5) * 2 * face.bitangent[2]
                    ];
                    // Project onto sphere
                    const length = Math.sqrt(pointOnFace[0] ** 2 + pointOnFace[1] ** 2 + pointOnFace[2] ** 2);
                    const pointOnSphere = [
                        (pointOnFace[0] / length) * radius,
                        (pointOnFace[1] / length) * radius,
                        (pointOnFace[2] / length) * radius
                    ];
                    const surfaceNormal = [
                        pointOnSphere[0] / radius,
                        pointOnSphere[1] / radius,
                        pointOnSphere[2] / radius
                    ];
                    vertices.push(...pointOnSphere, ...surfaceNormal);
                }
            }
        }

        for (let faceIndex = 0; faceIndex < faces.length; faceIndex++) {
            const vertexOffset = faceIndex * (resolution + 1) * (resolution + 1);
            for (let y = 0; y < resolution; y++) {
                for (let x = 0; x < resolution; x++) {
                    const i0 = vertexOffset + y * (resolution + 1) + x;
                    const i1 = vertexOffset + y * (resolution + 1) + (x + 1);
                    const i2 = vertexOffset + (y + 1) * (resolution + 1) + x;
                    const i3 = vertexOffset + (y + 1) * (resolution + 1) + (x + 1);
                    indices.push(i0, i2, i1);
                    indices.push(i1, i2, i3);
                }
            }
        }

        return {
            vertices: new Float32Array(vertices),
            indices: new Uint16Array(indices)
        };
    }
}
