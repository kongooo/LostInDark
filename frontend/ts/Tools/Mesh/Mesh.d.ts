export { Mesh };
import { Attrib, AttribLocationObj, UniformLocationObj } from '../interface';
/**
 * getAttributeLocations
 * getUniformLocations
 *
 */
declare class Mesh {
    static FLOAT_SIZE: number;
    protected shaderProgram: WebGLProgram;
    protected gl: WebGL2RenderingContext;
    constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string);
    protected attributeLocationObjs: Array<AttribLocationObj>;
    protected uniformLocations: Map<string, WebGLUniformLocation>;
    protected vertexSize: number;
    /**
     *
     * @param attribs attribute object array
     * @returns attribute object array
     */
    getAttributeLocations: (attribs: Array<Attrib>) => AttribLocationObj[];
    protected setAttribPointer: () => void;
    protected setUniformLocation: (uniforms: Array<UniformLocationObj>) => void;
}
