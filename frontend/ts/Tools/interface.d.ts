export { Attrib, AttribLocationObj, UniformLocationObj };
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
    data: Array<number>;
}
