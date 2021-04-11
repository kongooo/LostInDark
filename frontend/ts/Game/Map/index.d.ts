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
    constructor(gl: WebGL2RenderingContext, seed: number, size: number, img: HTMLImageElement, defaultUniformName: Array<string>);
    private vertics;
    private indices;
    simpleVertices: Array<Coord>;
    lineVertices: Array<Coord>;
    private noiseValue;
    size: number;
    /**
     *
     * @param cameraWorldPos 摄像机左下角世界坐标
     */
    draw: (cameraWorldPos: Coord, defaultUniform: Array<UniformLocationObj>, obstacleColor: Array<number>) => void;
    getEmptyPos: (startX: number, startY: number) => {
        x: number;
        y: number;
    };
    obstacled: (x: number, y: number) => boolean;
    private generateVertics;
}
export default PerlinMap;
