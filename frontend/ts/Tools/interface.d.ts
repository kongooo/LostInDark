import { Coord } from "./Tool";
export { Attrib, AttribLocationObj, UniformLocationObj, LightInfo, ItemInfo, ImgType, ItemType, BagItem };
interface Attrib {
    name: string;
    size: number;
}
interface AttribLocationObj {
    attribLocation: number;
    size: number;
}
interface UniformLocationObj {
    name: string;
    data: Array<number> | Float32Array;
    type: "texture" | "float" | "vec2" | "vec3" | "vec4" | "matrix" | "int";
    texture?: WebGLTexture;
}
interface LightInfo {
    position: Array<number>;
    color: Array<number>;
    linear: number;
    quadratic: number;
}
interface ItemInfo {
    pos: Coord;
    type: ItemType;
    img?: Array<HTMLImageElement>;
    draw?: (defaultUniforms: Array<UniformLocationObj>) => void;
}
interface BagItem {
    imgSrc?: string;
    count?: number;
    type?: ItemType;
    description?: string;
}
declare enum ItemType {
    match = 0,
    wood = 1,
    woodPile = 2,
    fire = 3,
    torches = 4,
    powderBox = 5
}
declare enum ImgType {
    player = 0,
    player1 = 1,
    ground = 2,
    obstable = 3,
    matchFront = 4,
    matchUp = 5,
    woodFront = 6,
    woodUp = 7,
    powderFront = 8,
    powderUp = 9,
    powderSide = 10,
    hint = 11
}
