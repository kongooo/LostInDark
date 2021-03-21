import perlinNoise3d from 'perlin-noise-3d';
import StaticMesh from '../../Tools/Mesh/StaticMesh';
import { WebGL } from '../../Tools/WebGLUtils';

import rectVsSource from '../../shaders/RectShader/vsSource.glsl';
import rectFsSource from '../../shaders/RectShader/fsSource.glsl';

import KeyPress from '../../Tools/Event/KeyEvent';

class PerlinMap {
    private noise: any;
    private center: { x: number, y: number };
    private gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext, seed: number, center: { x: number, y: number }) {
        const noise = new perlinNoise3d();
        noise.noiseSeed(seed);
        this.noise = noise;
        this.center = center;
        this.gl = gl;
    }

    private size: number = 40;
    private threshold: number = 0.55;
    private preDis: { x: number, y: number } = { x: 0, y: 0 };

    drawMap(startX: number, startY: number) {
        const gl = this.gl;
        const xCount = gl.canvas.width / this.size;
        const yCount = gl.canvas.height / this.size;
        const RECT_VERTEX_COUNT = 4;
        const zoom = 5;
        let vertics = [];
        let indices = [];
        let count = 0;
        const FloorX = Math.floor(startX);
        const FloorY = Math.floor(startY);

        for (let x = -1; x < xCount + 1; x++)
            for (let y = -1; y < yCount + 1; y++) {
                const num = this.noise.get(Math.floor(x + startX) / zoom, Math.floor(y + startY) / zoom);
                if (num > this.threshold) {
                    const X = x * this.size;
                    const Y = y * this.size;
                    vertics.push(...[
                        X, Y, 0, 0,
                        X + this.size, Y, 1, 0,
                        X + this.size, Y + this.size, 1, 1,
                        X, Y + this.size, 0, 1
                    ]);
                    indices.push(...[
                        count * RECT_VERTEX_COUNT,
                        count * RECT_VERTEX_COUNT + 1,
                        count * RECT_VERTEX_COUNT + 2,
                        count * RECT_VERTEX_COUNT,
                        count * RECT_VERTEX_COUNT + 2,
                        count * RECT_VERTEX_COUNT + 3,
                    ])
                    count++;
                }
            }

        const MapMesh = new StaticMesh(gl, rectVsSource, rectFsSource);
        MapMesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_texCoord', size: 2 }
        ])
        MapMesh.getUniformLocations(['u_resolution', 'u_translation']);
        MapMesh.getVAO(vertics, indices);

        const disX = (FloorX - startX) * this.size;
        const disY = (FloorY - startY) * this.size;

        this.preDis = { x: disX !== 0 ? disX : this.preDis.x, y: disY !== 0 ? disY : this.preDis.y };

        MapMesh.drawWithAVO([
            { name: 'u_resolution', data: [gl.canvas.width, gl.canvas.height] },
            { name: 'u_translation', data: [this.preDis.x, this.preDis.y] },
        ])


    }
}

export default PerlinMap;