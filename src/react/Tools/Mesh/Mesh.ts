export { Mesh };

import { WebGL } from '../WebGLUtils';
import { Attrib, AttribLocationObj, UniformLocationObj } from '../interface';

class Mesh {

    static FLOAT_SIZE = 4;
    shaderProgram: WebGLProgram;
    gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
        this.shaderProgram = WebGL.initShaderProgram(gl, vsSource, fsSource);
        this.gl = gl;
    }

    attributeLocationObjs: Array<AttribLocationObj>;
    uniformLocations: Map<string, WebGLUniformLocation>;
    texture: WebGLTexture;

    getAttributeLocations = (attribs: Array<Attrib>) => {
        attribs.forEach((attrib) => {
            const attribLocation = this.gl.getAttribLocation(this.shaderProgram, attrib.name);
            this.attributeLocationObjs.push({
                attribLocation,
                size: attrib.size
            });
        })
        return this.attributeLocationObjs;
    }

    getUniformLocations = (uniforms: Array<string>) => {
        uniforms.forEach((uniform) => {
            const uniformLocation = this.gl.getUniformLocation(this.shaderProgram, uniform);
            this.uniformLocations.set(uniform, uniformLocation);
        })
        return this.uniformLocations;
    }

    setAttribPointer = () => {
        const gl = this.gl;
        let offset = 0;
        this.attributeLocationObjs.forEach((attribObj) => {
            gl.enableVertexAttribArray(attribObj.attribLocation);
            gl.vertexAttribPointer(attribObj.attribLocation, attribObj.size, gl.FLOAT, false, length * Mesh.FLOAT_SIZE, offset * Mesh.FLOAT_SIZE);
            offset += attribObj.size;
        })
    }

    setUniformLocation = (uniforms: Array<UniformLocationObj>) => {
        uniforms.forEach((uniformObj) => {
            WebGL.setUniform(this.gl, this.uniformLocations.get(uniformObj.name), uniformObj.data);
        })
    }

    getTexture = (texture: WebGLTexture) => {
        this.texture = texture;
        return this.texture;
    }
}