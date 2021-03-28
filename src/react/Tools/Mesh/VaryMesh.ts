import { Mesh } from './Mesh';
import { UniformLocationObj } from '../interface';

class VaryMesh extends Mesh {

    constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
        super(gl, vsSource, fsSource);
    }

    private buffer: WebGLBuffer;
    private indexBuffer: WebGLBuffer;

    getBuffer = () => {
        const gl = this.gl;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        this.buffer = buffer;
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.indexBuffer = indexBuffer;
        return this.buffer;
    }

    drawWithBuffer = (vertics: Array<number>, uniforms: Array<UniformLocationObj>, indices?: Array<number>, texture?: WebGLTexture) => {
        const gl = this.gl;
        gl.useProgram(this.shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

        this.setUniformLocation(uniforms);
        if (texture) {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.activeTexture(gl.TEXTURE0 + 0);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertics), gl.STATIC_DRAW);
        this.setAttribPointer();
        if (indices) {
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
            gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, vertics.length / this.vertexSize);
        }
    }
}

export default VaryMesh;