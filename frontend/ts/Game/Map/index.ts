import perlinNoise3d from 'perlin-noise-3d';
import InstanceMesh from '../../Tools/Mesh/InstanceMesh';

import mapVsSource from '../../../shaders/MapShader/vsSource.glsl';
import mapFsSource from '../../../shaders/MapShader/fsSource.glsl';

import { WebGL } from '../../Tools/WebGLUtils';

import { CoordUtils, FrameBufferInfo } from '../../Tools/Tool';
import { ItemInfo, UniformLocationObj } from '../../Tools/interface';

import Union from './Union';

const ZOOM = 5;
const THRESHOLD = 0.6;
const SPREAD_SIZE = 0;

interface Coord {
    x: number;
    y: number;
}

class PerlinMap {
    private noise: any;
    private gl: WebGL2RenderingContext;
    private MapMesh: InstanceMesh;
    mapCount: Coord;
    mapPos: Coord;
    private union: Union;
    fBufferInfo: FrameBufferInfo;
    texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, seed: number, img: HTMLImageElement, mapCount: Coord) {
        const noise = new perlinNoise3d();
        noise.noiseSeed(seed);

        const MapMesh = new InstanceMesh(gl, mapVsSource, mapFsSource);
        MapMesh.getAttributeLocations([
            { name: 'a_position', size: 3 },
            { name: 'a_texCoord', size: 2 },
            { name: 'a_normal', size: 3 }
        ])
        MapMesh.getInstanceAttribLocations([
            { name: 'a_offset', size: 2 }
        ])
        // MapMesh.getUniformLocations(['u_image', 'u_projectionMatrix', 'u_viewMatrix', ...defaultUniformName]);
        MapMesh.getBufferAndVAO([

            //right
            1, 0, 0, 0, 0, 1, 0, 0,
            1, 1, 0, 1, 0, 1, 0, 0,
            1, 1, 1, 1, 1, 1, 0, 0,
            1, 0, 1, 0, 1, 1, 0, 0,

            //left
            0, 0, 0, 0, 0, -1, 0, 0,
            0, 0, 1, 1, 0, -1, 0, 0,
            0, 1, 1, 1, 1, -1, 0, 0,
            0, 1, 0, 0, 1, -1, 0, 0,

            //front
            0, 0, 1, 0, 0, 0, 0, 1,
            1, 0, 1, 1, 0, 0, 0, 1,
            1, 1, 1, 1, 1, 0, 0, 1,
            0, 1, 1, 0, 1, 0, 0, 1,

            //top
            0, 1, 0, 0, 0, 0, 1, 0,
            0, 1, 1, 1, 0, 0, 1, 0,
            1, 1, 1, 1, 1, 0, 1, 0,
            1, 1, 0, 0, 10, 1, 0,
        ], [
            0, 1, 2, 0, 2, 3,
            4, 5, 6, 4, 6, 7,
            8, 9, 10, 8, 10, 11,
            12, 13, 14, 12, 14, 15
        ]);

        this.MapMesh = MapMesh;
        this.gl = gl;
        this.noise = noise;
        this.fBufferInfo = WebGL.getFBufferAndTexture(gl, gl.canvas.width, gl.canvas.height);
        this.mapCount = mapCount;
        this.union = new Union(noise, CoordUtils.add(this.mapCount, SPREAD_SIZE * 2), THRESHOLD, ZOOM, SPREAD_SIZE);
        this.texture = WebGL.getTexture(gl, img);
    }

    private gridPos: Array<number> = [];
    simpleVertices: Array<Coord> = [];
    lineVertices: Array<Coord> = [];
    private noiseValue: number = 0;
    // vertexWorldPos: Array<number> = [];


    generateVerticesAndLines = (mapPos: Coord) => {
        this.mapPos = mapPos;
        const noiseValue = this.noise.get(Math.floor(mapPos.x) / ZOOM, Math.floor(mapPos.y) / ZOOM);

        //边界重新得到地图顶点数据
        if (this.noiseValue !== noiseValue) {
            this.generateVertics(mapPos.x, mapPos.y);
            this.noiseValue = noiseValue;
        }
    }

    draw = (defaultUniform: Array<UniformLocationObj>) => {

        // console.log(this.vertics);
        this.MapMesh.drawWithBufferAndVAO(this.gridPos, [
            { name: 'u_image', data: [0], texture: this.texture, type: 'texture' },
            ...defaultUniform
        ]);
    }

    //得到没有障碍物的坐标
    getEmptyPos = (startX: number, startY: number) => {
        const xCount = this.mapCount.x;
        const yCount = this.mapCount.y;
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

        this.simpleVertices = [];
        this.gridPos = [];

        for (let x = -SPREAD_SIZE; x < this.mapCount.x + SPREAD_SIZE; x++)
            for (let y = -SPREAD_SIZE; y < this.mapCount.y + SPREAD_SIZE; y++) {
                const xWorldPos = Math.floor(x + startX);
                const yWorldPos = Math.floor(y + startY);
                const num = this.noise.get(xWorldPos / ZOOM, yWorldPos / ZOOM);
                if (num > THRESHOLD) {

                    this.gridPos.push(
                        xWorldPos, yWorldPos
                    )

                    // this.simpleVertices.push(
                    //     { x: xWorldPos, y: yWorldPos },
                    //     { x: xWorldPos + 1, y: yWorldPos },
                    //     { x: xWorldPos + 1, y: yWorldPos },
                    //     { x: xWorldPos + 1, y: yWorldPos + 1 },
                    //     { x: xWorldPos + 1, y: yWorldPos + 1 },
                    //     { x: xWorldPos, y: yWorldPos + 1 },
                    //     { x: xWorldPos, y: yWorldPos + 1 },
                    //     { x: xWorldPos, y: yWorldPos },
                    // );

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