export { Attrib, AttribLocationObj, UniformLocationObj }

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
    type: "texture" | "number" | "vec2" | "vec3" | "vec4" | "matrix",
    texture?: WebGLTexture;
}