import perlinNoise3d from 'perlin-noise-3d';
import VaryMesh from '../../Tools/Mesh/VaryMesh';
import { Item } from '../Item/index';

import mapVsSource from '../../shaders/MapShader/vsSource.glsl';
import mapFsSource from '../../shaders/MapShader/fsSource.glsl';

import { WebGL } from '../../Tools/WebGLUtils';

import { FrameBufferInfo } from '../../Tools/Tool';

const ZOOM = 5;
const RECT_VERTEX_COUNT = 4;
const THRESHOLD = 0.6;

interface Coord {
    x: number;
    y: number;
}

class PerlinMap {
    private noise: any;
    private gl: WebGL2RenderingContext;
    private MapMesh: VaryMesh;
    fBufferInfo: FrameBufferInfo;

    constructor(gl: WebGL2RenderingContext, seed: number, size: number) {
        const noise = new perlinNoise3d();
        noise.noiseSeed(seed);

        const MapMesh = new VaryMesh(gl, mapVsSource, mapFsSource);
        MapMesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            // { name: 'a_texCoord', size: 2 }
        ])
        MapMesh.getUniformLocations(['u_resolution', 'u_cameraWorldPos', 'u_mapSize', 'u_color']);
        MapMesh.getBuffer();

        this.MapMesh = MapMesh;
        this.gl = gl;
        this.noise = noise;
        this.fBufferInfo = WebGL.getFBufferAndTexture(gl, gl.canvas.width, gl.canvas.height);
        this.size = size;
    }

    vertics: Array<number> = [];
    private indices: Array<number> = [];
    private noiseValue: number = 0;
    // vertexWorldPos: Array<number> = [];

    size: number;

    /**
     * 
     * @param cameraWorldPos 摄像机左下角世界坐标
     */
    draw = (cameraWorldPos: Coord) => {
        const gl = this.gl;

        const noiseValue = this.noise.get(Math.floor(cameraWorldPos.x) / ZOOM, Math.floor(cameraWorldPos.y) / ZOOM);

        //边界重新得到地图顶点数据
        if (this.noiseValue !== noiseValue) {
            this.generateVertics(cameraWorldPos.x, cameraWorldPos.y);
            this.noiseValue = noiseValue;
        }

        this.MapMesh.drawWithBuffer(this.vertics, [
            { name: 'u_resolution', data: [gl.canvas.width, gl.canvas.height] },
            { name: 'u_cameraWorldPos', data: [cameraWorldPos.x, cameraWorldPos.y] },
            { name: 'u_mapSize', data: [this.size] },
            { name: 'u_color', data: [0, 0, 0, 1] },
        ], this.indices);
    }

    //得到没有障碍物的坐标
    getEmptyPos = (startX: number, startY: number) => {
        const xCount = this.gl.canvas.width / this.size;
        const yCount = this.gl.canvas.height / this.size;
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
        const xCount = this.gl.canvas.width / this.size;
        const yCount = this.gl.canvas.height / this.size;
        let count = 0;
        this.vertics = [];
        this.indices = [];

        for (let x = -1; x < xCount + 1; x++)
            for (let y = -1; y < yCount + 1; y++) {
                const xWorldPos = Math.floor(x + startX);
                const yWorldPos = Math.floor(y + startY);
                const num = this.noise.get(xWorldPos / ZOOM, yWorldPos / ZOOM);
                if (num > THRESHOLD) {
                    // const X = x * this.size;
                    // const Y = y * this.size;
                    // this.vertics.push(...[
                    //     X, Y,// 0, 0,
                    //     X + this.size, Y, //1, 0,
                    //     X + this.size, Y + this.size, //1, 1,
                    //     X, Y + this.size, //0, 1
                    // ]);
                    this.vertics.push(...[
                        xWorldPos, yWorldPos,
                        xWorldPos + 1, yWorldPos,
                        xWorldPos + 1, yWorldPos + 1,
                        xWorldPos, yWorldPos + 1
                    ]);
                    this.indices.push(...[
                        count * RECT_VERTEX_COUNT,
                        count * RECT_VERTEX_COUNT + 1,
                        count * RECT_VERTEX_COUNT + 2,
                        count * RECT_VERTEX_COUNT,
                        count * RECT_VERTEX_COUNT + 2,
                        count * RECT_VERTEX_COUNT + 3,
                    ]);
                    count++;
                }
            }

        // console.log(this.vertics, startX, startY);
    }
}

const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
};

export default PerlinMap;