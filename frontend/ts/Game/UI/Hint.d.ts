import { Coord } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';
declare class Hint {
    private mesh;
    private gl;
    private texture;
    constructor(gl: WebGL2RenderingContext, img: HTMLImageElement);
    draw(worldPos: Coord, defaultUniform: Array<UniformLocationObj>): void;
}
export default Hint;
