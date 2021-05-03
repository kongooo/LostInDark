import { Coord } from "../../Tools/Tool";
import { UniformLocationObj } from '../../Tools/interface';
declare class Arrow {
    private mesh;
    private texture;
    constructor(gl: WebGL2RenderingContext, img: HTMLImageElement);
    draw(worldPos: Coord, defaultUniforms: Array<UniformLocationObj>, angle: number): void;
}
export { Arrow };
