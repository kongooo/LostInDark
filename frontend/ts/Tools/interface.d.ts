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
    move?: boolean;
    img?: Array<HTMLImageElement>;
    draw?: (defaultUniforms: Array<UniformLocationObj>, ...args: Array<any>) => void;
}
interface BagItem {
    imgSrc?: string;
    type?: ItemType;
    name?: string;
    useCount?: number;
    description?: string;
}
declare enum ItemType {
    match = 0,
    wood = 1,
    firePile = 2,
    fire = 3,
    fireWoods = 4,
    powderBox = 5,
    powder = 6
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
    hint = 11,
    powder = 12,
    fire = 13,
    fireWood = 14,
    firePile = 15
}
