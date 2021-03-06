import perlinNoise3d from 'perlin-noise-3d';
import InstanceMesh from '../../Tools/Mesh/InstanceMesh';

import mapVsSource from '../../../shaders/MapShader/vsSource.glsl';
import mapFsSource from '../../../shaders/MapShader/fsSource.glsl';

import { WebGL } from '../../Tools/WebGLUtils';

import { CoordUtils, FrameBufferInfo } from '../../Tools/Tool';
import { ItemInfo, UniformLocationObj } from '../../Tools/interface';

import Union from './Union';
import { ItemVertex } from '../Item/ItemVertex';

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
    // fBufferInfo: FrameBufferInfo;
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
            { name: 'a_offset', size: 3 }
        ])

        MapMesh.getBufferAndVAO(ItemVertex.getCubeVertices(1, 1, 1), ItemVertex.cubeIndices);

        this.MapMesh = MapMesh;
        this.gl = gl;
        this.noise = noise;
        // this.fBufferInfo = WebGL.getFBufferAndTexture(gl, mapCount.x, mapCount.y);
        this.mapCount = mapCount;
        this.union = new Union(noise, CoordUtils.add(this.mapCount, SPREAD_SIZE * 2), THRESHOLD, ZOOM, SPREAD_SIZE);
        this.texture = WebGL.getTexture(gl, img, true);
    }

    private gridPos: Array<number> = [];
    simpleVertices: Array<Coord> = [];
    lineVertices: Array<Coord> = [];
    private noiseValue: number = 0;
    // vertexWorldPos: Array<number> = [];


    generateVerticesAndLines = (mapPos: Coord) => {
        this.mapPos = mapPos;
        const noiseValue = this.noise.get(Math.floor(mapPos.x) / ZOOM, Math.floor(mapPos.y) / ZOOM);

        //????????????????????????????????????
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

    //??????????????????????????????
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

    //????????????????????????????????????
    obstacled = (x: number, y: number) => {
        return this.noise.get(Math.floor(x) / ZOOM, Math.floor(y) / ZOOM) > THRESHOLD;
    }


    //????????????????????????
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
                    const height = Math.max(Math.floor((num - THRESHOLD) * 20) % 10, 1);
                    // console.log(height);
                    this.gridPos.push(
                        xWorldPos, yWorldPos, height
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

                    //???-SPREAD_SIZE???size+SPREAD_SIZE?????????0???size+SPREAD_SIZE
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