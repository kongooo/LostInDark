import { Mesh } from './Mesh';
import { UniformLocationObj } from '../interface';
declare class VaryMesh extends Mesh {
    constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string);
    private buffer;
    private indexBuffer;
    getBuffer: () => WebGLBuffer;
    drawWithBuffer: (vertics: Array<number>, uniforms: Array<UniformLocationObj>, indices?: Array<number>) => void;
}
export default VaryMesh;
