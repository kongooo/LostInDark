import { FrameBufferInfo } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';
interface Coord {
    x: number;
    y: number;
}
declare class PerlinMap {
    private noise;
    private gl;
    private MapMesh;
    mapCount: Coord;
    private union;
    fBufferInfo: FrameBufferInfo;
    texture: WebGLTexture;
    constructor(gl: WebGL2RenderingContext, seed: number, size: number, img: HTMLImageElement, mapCount: Coord);
    private vertics;
    private indices;
    private gridPos;
    simpleVertices: Array<Coord>;
    lineVertices: Array<Coord>;
    private noiseValue;
    size: number;
    generateVerticesAndLines: (mapPos: Coord) => void;
    /**
     *
     * @param cameraWorldPos 摄像机左下角世界坐标
     */
    draw: (defaultUniform: Array<UniformLocationObj>) => void;
    getEmptyPos: (startX: number, startY: number) => {
        x: number;
        y: number;
    };
    obstacled: (x: number, y: number) => boolean;
    private generateVertics;
}
export default PerlinMap;
