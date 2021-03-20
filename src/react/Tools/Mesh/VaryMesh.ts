import { Mesh } from './Mesh';
import { UniformLocationObj } from '../interface';

class VaryMesh extends Mesh {

    constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
        super(gl, vsSource, fsSource);
    }

    buffer: WebGLBuffer;
    vertexSize: number;

    getBuffer = () => {
        const gl = this.gl;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.setAttribPointer();
        this.vertexSize = this.attributeLocationObjs.reduce((pre, cur) => ({ attribLocation: pre.attribLocation, size: pre.size + cur.size })).size;
        this.buffer = buffer;
        return this.buffer;
    }

    drawWithBuffer = (vertics: Array<number>, uniforms: Array<UniformLocationObj>) => {
        const gl = this.gl;
        gl.useProgram(this.shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        if (this.texture) {
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.activeTexture(gl.TEXTURE0 + 0);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertics), gl.STATIC_DRAW);
        this.setUniformLocation(uniforms);
        gl.drawArrays(gl.TRIANGLES, 0, vertics.length / this.vertexSize);
    }
}

export default VaryMesh;