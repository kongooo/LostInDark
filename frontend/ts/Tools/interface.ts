import { Coord } from "./Tool";

export { ComposeItem, ItemActionInfo, Item, Attrib, AttribLocationObj, UniformLocationObj, LightInfo, ItemInfo, ImgType, ItemType, BagItem }

interface ItemActionInfo {
    pos: Coord;
    type: 'add' | 'delete',
    itemType?: ItemType;
}

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
    draw?: (defaultUniforms: Array<UniformLocationObj>, ...args: Array<any>) => void;
}

interface BagItem {
    imgSrc?: string;
    type?: ItemType;
    name?: string;
    useCount?: number;
    description?: string;
}

interface Item {
    pos: Coord;
    type: ItemType;
}

interface ComposeItem {
    type: ItemType;
    count: number;
}

enum ItemType {
    match,
    wood,
    firePile,
    fire,
    fireWoods,
    powderBox,
    powder,
    transmit,
    receive,
    battery,
    wire,
    circuitBoard,
    placeHolder,
    toast,
    sandwich
}

enum ImgType {
    mikasa,
    alen,
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
    firePile,

    battery,
    batteryUp,
    batteryFront,

    wire,
    circuitBoard,

    arrow,

    sandwichFront,
    sandwichUp,

    toastFront,
    toastUp
}

