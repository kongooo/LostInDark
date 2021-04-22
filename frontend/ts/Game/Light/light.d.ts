import { Coord, FrameBufferInfo } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';
declare class Light {
    private lightMesh;
    private gl;
    private color;
    lightRadius: number;
    fBufferInfo: FrameBufferInfo;
    constructor(gl: WebGL2RenderingContext, lightRadius: number, color: Array<number>);
    /**
     *
     * @param worldPos
     * @param texture
     * @param brightNess
     * @param lightScale
     * @param defaultUniform
     * @param type 0: player 1: fire
     */
    draw: (worldPos: Coord, texture: WebGLTexture, brightNess: number, lightScale: number, defaultUniform: Array<UniformLocationObj>, type: 1 | 0) => void;
}
export default Light;
