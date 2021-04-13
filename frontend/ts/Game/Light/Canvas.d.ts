import { UniformLocationObj } from '../../Tools/interface';
import { Coord } from '../../Tools/Tool';
declare class Canvas {
    private gl;
    private canvasMesh;
    constructor(gl: WebGL2RenderingContext, mapCount: Coord);
    draw: (worldPos: Coord, defaultUniform: Array<UniformLocationObj>, texture?: WebGLTexture) => void;
}
export default Canvas;
