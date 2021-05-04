import { Coord } from "../../Tools/Tool";
import { ItemInfo, ItemType, UniformLocationObj } from '../../Tools/interface';
declare class Item2D implements ItemInfo {
    pos: Coord;
    type: ItemType;
    move: boolean;
    private mesh;
    private texture;
    constructor(gl: WebGL2RenderingContext, itemInfo: ItemInfo, light: boolean, move?: boolean);
    draw(defaultUniforms: Array<UniformLocationObj>): void;
}
export { Item2D };
