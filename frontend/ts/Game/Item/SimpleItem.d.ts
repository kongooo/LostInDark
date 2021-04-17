import { Coord } from "../../Tools/Tool";
import { ItemInfo, ItemType, UniformLocationObj } from '../../Tools/interface';
declare class SimpleItem implements ItemInfo {
    pos: Coord;
    type: ItemType;
    private mesh;
    private textureUp;
    private textureSide;
    private textureFront;
    private rotateMatrix;
    constructor(gl: WebGL2RenderingContext, item: ItemInfo);
    draw(defaultUniforms: Array<UniformLocationObj>): void;
}
export { SimpleItem };
