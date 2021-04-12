import perlinNoise3d from 'perlin-noise-3d';
import VaryMesh from '../../Tools/Mesh/VaryMesh';
import { Item } from '../Item/index';

import mapVsSource from '../../../shaders/MapShader/vsSource.glsl';
import mapFsSource from '../../../shaders/MapShader/fsSource.glsl';

import { WebGL } from '../../Tools/WebGLUtils';

import { CoordUtils, FrameBufferInfo } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';

import Union from './Union';

const ZOOM = 5;
const RECT_VERTEX_COUNT = 4;
const THRESHOLD = 0.6;
const SPREAD_SIZE = 5;

interface Coord {
    x: number;
    y: number;
}

class PerlinMap {
    private noise: any;
    private gl: WebGL2RenderingContext;
    private MapMesh: VaryMesh;
    mapCount: Coord;
    private union: Union;
    fBufferInfo: FrameBufferInfo;
    texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, seed: number, size: number, img: HTMLImageElement, defaultUniformName: Array<string>) {
        const noise = new perlinNoise3d();
        noise.noiseSeed(seed);

        const MapMesh = new VaryMesh(gl, mapVsSource, mapFsSource);
        MapMesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_texCoord', size: 2 }
        ])
        MapMesh.getUniformLocations(['u_image', ...defaultUniformName]);
        MapMesh.getBuffer();

        this.MapMesh = MapMesh;
        this.gl = gl;
        this.noise = noise;
        this.fBufferInfo = WebGL.getFBufferAndTexture(gl, gl.canvas.width, gl.canvas.height);
        this.size = size;
        this.mapCount = { x: Math.floor(gl.canvas.width / size), y: Math.floor(gl.canvas.height / size) };
        this.union = new Union(noise, CoordUtils.add(this.mapCount, SPREAD_SIZE * 2), THRESHOLD, ZOOM, SPREAD_SIZE);
        this.texture = WebGL.getTexture(gl, img);
    }

    private vertics: Array<number> = [];
    private indices: Array<number> = [];
    simpleVertices: Array<Coord> = [];
    lineVertices: Array<Coord> = [];
    private noiseValue: number = 0;
    // vertexWorldPos: Array<number> = [];

    size: number;

    /**
     * 
     * @param cameraWorldPos 摄像机左下角世界坐标
     */
    draw = (cameraWorldPos: Coord, defaultUniform: Array<UniformLocationObj>, obstacleColor: Array<number>) => {
        const gl = this.gl;

        const noiseValue = this.noise.get(Math.floor(cameraWorldPos.x) / ZOOM, Math.floor(cameraWorldPos.y) / ZOOM);

        //边界重新得到地图顶点数据
        if (this.noiseValue !== noiseValue) {
            this.generateVertics(cameraWorldPos.x, cameraWorldPos.y);
            this.noiseValue = noiseValue;
        }

        this.MapMesh.drawWithBuffer(this.vertics, [
            { name: 'u_image', data: [0] },
            ...defaultUniform
        ], this.indices, this.texture);
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

        this.union.init({ x: Math.floor(startX), y: Math.floor(startY) });

        let count = 0;
        this.vertics = [];
        this.indices = [];
        this.simpleVertices = [];

        // const xWorldPos = Math.floor(this.mapCount.x / 2 + startX);
        // const yWorldPos = Math.floor(this.mapCount.y / 2 + startY);
        // const vertices = [
        //     //down
        //     { x: xWorldPos, y: yWorldPos },
        //     { x: xWorldPos + 1, y: yWorldPos },
        //     //right
        //     { x: xWorldPos + 1, y: yWorldPos },
        //     { x: xWorldPos + 1, y: yWorldPos + 1 },
        //     //up
        //     { x: xWorldPos + 1, y: yWorldPos + 1 },
        //     { x: xWorldPos, y: yWorldPos + 1 },
        //     // //left
        //     { x: xWorldPos, y: yWorldPos + 1 },
        //     { x: xWorldPos, y: yWorldPos },
        // ];
        // this.lineVertices.push(...vertices);



        for (let x = -SPREAD_SIZE; x < this.mapCount.x + SPREAD_SIZE; x++)
            for (let y = -SPREAD_SIZE; y < this.mapCount.y + SPREAD_SIZE; y++) {
                const xWorldPos = Math.floor(x + startX);
                const yWorldPos = Math.floor(y + startY);
                const num = this.noise.get(xWorldPos / ZOOM, yWorldPos / ZOOM);
                if (num > THRESHOLD) {

                    this.vertics.push(...[
                        xWorldPos, yWorldPos, 0, 0,
                        xWorldPos + 1, yWorldPos, 1, 0,
                        xWorldPos + 1, yWorldPos + 1, 1, 1,
                        xWorldPos, yWorldPos + 1, 0, 1
                    ]);
                    this.indices.push(...[
                        count * RECT_VERTEX_COUNT,
                        count * RECT_VERTEX_COUNT + 1,
                        count * RECT_VERTEX_COUNT + 2,
                        count * RECT_VERTEX_COUNT,
                        count * RECT_VERTEX_COUNT + 2,
                        count * RECT_VERTEX_COUNT + 3,
                    ]);
                    this.simpleVertices.push(...[
                        { x: xWorldPos, y: yWorldPos },
                        { x: xWorldPos + 1, y: yWorldPos },
                        { x: xWorldPos + 1, y: yWorldPos },
                        { x: xWorldPos + 1, y: yWorldPos + 1 },
                        { x: xWorldPos + 1, y: yWorldPos + 1 },
                        { x: xWorldPos, y: yWorldPos + 1 },
                        { x: xWorldPos, y: yWorldPos + 1 },
                        { x: xWorldPos, y: yWorldPos },
                    ])
                    count++;
                    //将-SPREAD_SIZE，size+SPREAD_SIZE映射到0，size+SPREAD_SIZE
                    this.union.setBlock(x + SPREAD_SIZE, y + SPREAD_SIZE);
                }
            }

        this.lineVertices = this.union.getBlocksLine();
    }

}

const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
};

export default PerlinMap;