import { Coord } from "../../Tools/Tool";
import { ItemInfo, ItemType, UniformLocationObj } from '../../Tools/interface';
declare class Powder implements ItemInfo {
    pos: Coord;
    type: ItemType;
    move: boolean;
    private mesh;
    private texture;
    constructor(gl: WebGL2RenderingContext, itemInfo: ItemInfo);
    draw(defaultUniforms: Array<UniformLocationObj>): void;
}
export { Powder };
