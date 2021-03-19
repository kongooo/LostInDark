export { Mesh };

import { WebGL } from './WebGLUtils';
import { Attrib, AttribLocationObj } from './interface';

class Mesh {
    shaderProgram: WebGLProgram;
    gl: WebGL2RenderingContext;
    constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
        this.shaderProgram = WebGL.initShaderProgram(gl, vsSource, fsSource);
        this.gl = gl;
    }

    attributeLocationObjs: Array<AttribLocationObj>;
    uniformLocations: Array<WebGLUniformLocation>;
    vao: WebGLVertexArrayObject;
    texture: WebGLTexture;
    elementEnable: boolean;
    vertexCount: number;
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
            this.uniformLocations.push(uniformLocation);
        })
        return this.uniformLocations;
    }
    getVAO = (vertics: Array<number>, indices?: Array<number>) => {
        const gl = this.gl;
        const vao = gl.createVertexArray();
        const FLOAT_SIZE = 4;
        gl.bindVertexArray(vao);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertics), gl.STATIC_DRAW);
        if (indices) {
            WebGL.bindEBO(gl, indices);
            this.elementEnable = true;
        }
        const length = this.attributeLocationObjs.reduce((pre, cur) => ({ attribLocation: pre.attribLocation, size: pre.size + cur.size })).size;
        this.vertexCount = indices ? indices.length : vertics.length / length;
        let offset = 0;
        this.attributeLocationObjs.forEach((attribObj) => {
            gl.enableVertexAttribArray(attribObj.attribLocation);
            gl.vertexAttribPointer(attribObj.attribLocation, attribObj.size, gl.FLOAT, false, length * FLOAT_SIZE, offset * FLOAT_SIZE);
            offset += attribObj.size;
        })
        this.vao = vao;
        return this.vao;
    }
    getTexture = (texture: WebGLTexture) => {
        this.texture = texture;
        return this.texture;
    }
    draw = () => {
        const gl = this.gl;
        gl.useProgram(this.shaderProgram);
        if (this.texture) {
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.activeTexture(gl.TEXTURE0 + 0);
        }
        gl.bindVertexArray(this.vao);
        if (this.elementEnable) {
            gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
        }

    }
}