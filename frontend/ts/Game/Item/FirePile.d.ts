import { Coord } from "../../Tools/Tool";
import { ItemInfo, ItemType, UniformLocationObj } from '../../Tools/interface';
import Light from "../Light/light";
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
    shadowTexture: WebGLTexture;
    light: Light;
    lightColor: Array<number>;
    constructor(gl: WebGL2RenderingContext, itemInfo: ItemInfo);
    getShadowTexture: (mapLines: Array<Coord>) => void;
    draw(defaultUniforms: Array<UniformLocationObj>, fireFrame: number): void;
}
export { FirePile };
