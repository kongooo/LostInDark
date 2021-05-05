export { Mesh };

import { WebGL } from '../WebGLUtils';
import { Attrib, AttribLocationObj, UniformLocationObj } from '../interface';

/**
 * getAttributeLocations
 * getUniformLocations
 * 
 */

class Mesh {

    static FLOAT_SIZE = 4;
    protected shaderProgram: WebGLProgram;
    protected gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
        this.shaderProgram = WebGL.initShaderProgram(gl, vsSource, fsSource);
        this.gl = gl;
    }

    protected attributeLocationObjs: Array<AttribLocationObj> = [];
    protected uniformLocations: Map<string, WebGLUniformLocation> = new Map();
    protected vertexSize: number;

    /**
     * 
     * @param attribs attribute object array
     * @returns attribute object array
     */
    getAttributeLocations = (attribs: Array<Attrib>) => {
        attribs.forEach((attrib) => {
            const attribLocation = this.gl.getAttribLocation(this.shaderProgram, attrib.name);
            this.attributeLocationObjs.push({
                attribLocation,
                size: attrib.size
            });
        })
        this.vertexSize = this.attributeLocationObjs.reduce((pre, cur) => ({ attribLocation: pre.attribLocation, size: pre.size + cur.size })).size;
        return this.attributeLocationObjs;
    }

    protected setAttribPointer = () => {
        const gl = this.gl;
        let offset = 0;
        this.attributeLocationObjs.forEach((attribObj) => {
            gl.enableVertexAttribArray(attribObj.attribLocation);
            gl.vertexAttribPointer(attribObj.attribLocation, attribObj.size, gl.FLOAT, false, this.vertexSize * Mesh.FLOAT_SIZE, offset * Mesh.FLOAT_SIZE);
            offset += attribObj.size;
        })
    }

    protected setUniformLocation = (uniforms: Array<UniformLocationObj>) => {
        uniforms.forEach((uniformObj) => {
            if (!this.uniformLocations.get(uniformObj.name)) this.uniformLocations.set(uniformObj.name, this.gl.getUniformLocation(this.shaderProgram, uniformObj.name));
            // console.log(uniformObj.name, uniformObj.data);
            WebGL.setUniform(this.gl, this.uniformLocations.get(uniformObj.name), uniformObj);
        })
    }

}