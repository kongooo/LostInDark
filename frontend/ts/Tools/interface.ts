import { Coord } from "./Tool";

export { Attrib, AttribLocationObj, UniformLocationObj, LightInfo, ItemInfo, ImgType, ItemType }

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
    type: "texture" | "float" | "vec2" | "vec3" | "vec4" | "matrix" | "int",
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

enum ItemType {
    match,
    wood,
    woodPile,
    fire,
    torches,
    powderBox
}

enum ImgType {
    player,
    player1,
    ground,
    obstable,

    matchFront,
    matchUp,

    woodFront,
    woodUp,

    powderFront,
    powderUp,
    powderSide
}