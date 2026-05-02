import Perlin  from "./Perlin";

export class PerlinWorley {

    public static generate(res: number, cellsPerAxis: number = 4): Uint8Array {
        const perlin = new Perlin();
        const data = new Uint8Array(res * res * res * 4);
        
        // Generate Worley noise points
        const points: [number, number, number][] = [];
        for (let x = 0; x < cellsPerAxis; x++) {
            for (let y = 0; y < cellsPerAxis; y++) {
                for (let z = 0; z < cellsPerAxis; z++) {
                    points.push([
                        (x + Math.random()) / cellsPerAxis,
                        (y + Math.random()) / cellsPerAxis,
                        (z + Math.random()) / cellsPerAxis,
                    ]);
                }
            }
        }
        
        for (let z = 0; z < res; z++) {
            for (let y = 0; y < res; y++) {
                for (let x = 0; x < res; x++) {
                    const u = x / res;
                    const v = y / res;
                    const w = z / res;
                    
                    let minDistSq = Infinity;

                    for (const p of points) {
                        for (let dx = -1; dx <= 1; dx++) {
                            for (let dy = -1; dy <= 1; dy++) {
                                for (let dz = -1; dz <= 1; dz++) {
                                    const px = p[0] + dx;
                                    const py = p[1] + dy;
                                    const pz = p[2] + dz;

                                    const dx_ = u - px;
                                    const dy_ = v - py;
                                    const dz_ = w - pz;

                                    const d = dx_*dx_ + dy_*dy_ + dz_*dz_;
                                    minDistSq = Math.min(minDistSq, d);
                                }
                            }
                        }
                    }

                    const maxDistSq = (Math.sqrt(3) / cellsPerAxis) ** 2;
                    const worley = 1.0 - Math.min(1.0, minDistSq / maxDistSq);

                    const octave1 = 16;
                    const octave2 = 32;
                    const octave3 = 64;

                    const perlin1 = perlin.perlin3(u * octave1, v * octave1, w * octave1);
                    const perlin2 = perlin.perlin3(u * octave2, v * octave2, w * octave2);
                    const perlin3 = perlin.perlin3(u * octave3, v * octave3, w * octave3);
                    const idx = (z * res * res + y * res + x) * 4;
                    data[idx] = Math.floor(worley * 255);
                    data[idx + 1] = Math.floor((perlin1 * 0.5 + 0.5) * 255);
                    data[idx + 2] = Math.floor((perlin2 * 0.5 + 0.5) * 255);
                    data[idx + 3] = Math.floor((perlin3 * 0.5 + 0.5) * 255);
                }
            }
        }
        return data;
    }
}