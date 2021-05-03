import { Coord } from "../../Tools/Tool";
import { ItemInfo, ItemType, UniformLocationObj } from '../../Tools/interface';
declare class Transmit implements ItemInfo {
    pos: Coord;
    type: ItemType;
    move: boolean;
    private mesh;
    private gl;
    constructor(gl: WebGL2RenderingContext, item: ItemInfo);
    draw(defaultUniforms: Array<UniformLocationObj>): void;
}
export { Transmit };
