import { Mesh } from './Mesh';
import { UniformLocationObj } from '../interface';
declare class StaticMesh extends Mesh {
    constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string);
    private vao;
    private elementEnable;
    private vertexCount;
    private vertics;
    private indices;
    getVAO: (vertics: Array<number>, indices?: Array<number>) => WebGLVertexArrayObject;
    drawWithAVO: (uniforms: Array<UniformLocationObj>, texture?: WebGLTexture) => void;
}
export default StaticMesh;
