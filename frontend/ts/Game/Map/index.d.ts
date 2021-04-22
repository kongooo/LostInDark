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
    mapPos: Coord;
    private union;
    texture: WebGLTexture;
    constructor(gl: WebGL2RenderingContext, seed: number, img: HTMLImageElement, mapCount: Coord);
    private gridPos;
    simpleVertices: Array<Coord>;
    lineVertices: Array<Coord>;
    private noiseValue;
    generateVerticesAndLines: (mapPos: Coord) => void;
    draw: (defaultUniform: Array<UniformLocationObj>) => void;
    getEmptyPos: (startX: number, startY: number) => {
        x: number;
        y: number;
    };
    obstacled: (x: number, y: number) => boolean;
    private generateVertics;
}
export default PerlinMap;
