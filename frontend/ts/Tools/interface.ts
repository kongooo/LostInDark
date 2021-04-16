
export { Attrib, AttribLocationObj, UniformLocationObj, LightInfo }

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