import { Coord } from "../../Tools/Tool";
import { ItemInfo, ItemType, UniformLocationObj } from '../../Tools/interface';
declare class FirePile implements ItemInfo {
    pos: Coord;
    type: ItemType;
    move: boolean;
    private gl;
    private woodMesh;
    private fireMesh;
    private woodTexture;
    private fireTexture;
    private rotateMatrix;
    constructor(gl: WebGL2RenderingContext, itemInfo: ItemInfo);
    draw(defaultUniforms: Array<UniformLocationObj>, fireFrame: number): void;
}
export { FirePile };
