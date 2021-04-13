import { Coord } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';
declare class GroundCanvas {
    private gl;
    private canvasMesh;
    private texture;
    constructor(gl: WebGL2RenderingContext, img: HTMLImageElement);
    draw: (worldPos: Coord, leftDownPos: Coord, mapCount: Coord, defaultUniform: Array<UniformLocationObj>, lightShadowTexture: WebGLTexture) => void;
}
export default GroundCanvas;
