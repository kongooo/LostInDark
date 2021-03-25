import perlinNoise3d from 'perlin-noise-3d';
import VaryMesh from '../../Tools/Mesh/VaryMesh';
import { Item } from '../Item/index';

import colorRectVsSource from '../../shaders/ColorRectShader/vsSource.glsl';
import colorRectFsSource from '../../shaders/ColorRectShader/fsSource.glsl';

const ZOOM = 5;
const RECT_VERTEX_COUNT = 4;
const THRESHOLD = 0.6;
const SIZE = 40;
const WALL_COLOR = [170, 170, 170];

interface Coord {
    x: number;
    y: number;
}

class PerlinMap {
    private noise: any;
    private gl: WebGL2RenderingContext;
    private MapMesh: VaryMesh;

    constructor(gl: WebGL2RenderingContext, seed: number) {
        const noise = new perlinNoise3d();
        noise.noiseSeed(seed);
        this.noise = noise;
        this.gl = gl;
        const MapMesh = new VaryMesh(gl, colorRectVsSource, colorRectFsSource);
        MapMesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            // { name: 'a_texCoord', size: 2 }
        ])
        MapMesh.getUniformLocations(['u_resolution', 'u_translation', 'u_color']);
        MapMesh.getBuffer();
        this.MapMesh = MapMesh;
    }

    private vertics: Array<number> = [];
    private indices: Array<number> = [];
    private noiseValue: number = 0;

    size: number = SIZE;

    //startPos：摄像机左下角世界坐标
    draw = (startPos: Coord, cameraOffset: Coord) => {
        const gl = this.gl;

        const noiseValue = this.noise.get(Math.floor(startPos.x) / ZOOM, Math.floor(startPos.y) / ZOOM);

        //边界重新得到地图顶点数据
        if (this.noiseValue !== noiseValue) {
            this.generateVertics(startPos.x, startPos.y);
            this.noiseValue = noiseValue;
        }

        this.MapMesh.drawWithBuffer(this.vertics, [
            { name: 'u_resolution', data: [gl.canvas.width, gl.canvas.height] },
            { name: 'u_translation', data: [cameraOffset.x, cameraOffset.y] },
            { name: 'u_color', data: WALL_COLOR },
        ], this.indices);
    }

    //得到没有障碍物的坐标
    getEmptyPos = (startX: number, startY: number) => {
        const xCount = this.gl.canvas.width / SIZE;
        const yCount = this.gl.canvas.height / SIZE;
        const xMin = xCount / 3, xMax = (xCount / 3) * 2;
        const yMin = yCount / 3, yMax = (yCount / 3) * 2;
        let xIndex = randomInt(xMin, xMax), yIndex = randomInt(yMin, yMax);
        while (this.noise.get(Math.floor(xIndex + startX) / ZOOM, Math.floor(yIndex + startY) / ZOOM) > THRESHOLD) {
            xIndex = randomInt(xMin, xMax);
            yIndex = randomInt(yMin, yMax);
        }
        return { x: xIndex + startX, y: yIndex + startY };
    }

    //判断该点坐标是否为障碍物
    obstacled = (x: number, y: number) => {
        return this.noise.get(Math.floor(x) / ZOOM, Math.floor(y) / ZOOM) > THRESHOLD;
    }

    //生成地图顶点坐标
    private generateVertics = (startX: number, startY: number) => {
        const xCount = this.gl.canvas.width / SIZE;
        const yCount = this.gl.canvas.height / SIZE;
        let count = 0;
        this.vertics = [];
        this.indices = [];
        for (let x = -1; x < xCount + 1; x++)
            for (let y = -1; y < yCount + 1; y++) {
                const num = this.noise.get(Math.floor(x + startX) / ZOOM, Math.floor(y + startY) / ZOOM);
                if (num > THRESHOLD) {
                    const X = x * SIZE;
                    const Y = y * SIZE;
                    this.vertics.push(...[
                        X, Y,// 0, 0,
                        X + SIZE, Y, //1, 0,
                        X + SIZE, Y + SIZE, //1, 1,
                        X, Y + SIZE, //0, 1
                    ]);
                    this.indices.push(...[
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
    }
}

const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
};

export default PerlinMap;