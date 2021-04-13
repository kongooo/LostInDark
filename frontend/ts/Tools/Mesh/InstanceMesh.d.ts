import { Mesh } from './Mesh';
import { Attrib, AttribLocationObj, UniformLocationObj } from '../interface';
declare class InstanceMesh extends Mesh {
    constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string);
    private meshVAO;
    private instanceBuffer;
    private instanceAttribs;
    private instanceAttribSize;
    private meshIndicesCount;
    getBufferAndVAO: (meshVertics: Array<number>, meshIndices: Array<number>) => void;
    /**
     *
     * @param attribs instance attribute object array
     * @returns instance attribute object array
     */
    getInstanceAttribLocations: (attribs: Array<Attrib>) => AttribLocationObj[];
    private setInstanceAttribPointer;
    drawWithBufferAndVAO: (instanceVertics: Array<number>, uniforms: Array<UniformLocationObj>) => void;
}
export default InstanceMesh;
