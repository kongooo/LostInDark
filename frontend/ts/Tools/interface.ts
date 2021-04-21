import { Coord } from "./Tool";

export { Attrib, AttribLocationObj, UniformLocationObj, LightInfo, ItemInfo, ImgType, ItemType, BagItem }

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
    move?: boolean;
    img?: Array<HTMLImageElement>;
    draw?: (defaultUniforms: Array<UniformLocationObj>) => void;
}

interface BagItem {
    imgSrc?: string;
    type?: ItemType;
    name?: string;
    useCount?: number;
    description?: string;
}

enum ItemType {
    match,
    wood,
    firePile,
    fire,
    fireWoods,
    powderBox,
    powder,
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
    powderSide,

    hint,
    powder,

    fire,
    fireWood,
    firePile
}

