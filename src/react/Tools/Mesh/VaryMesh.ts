import { Mesh } from './Mesh';
import { UniformLocationObj } from '../interface';

class VaryMesh extends Mesh {

    constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
        super(gl, vsSource, fsSource);
    }

    private buffer: WebGLBuffer;

    getBuffer = () => {
        const gl = this.gl;
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        this.setAttribPointer();
        this.buffer = buffer;
        return this.buffer;
    }

    drawWithBuffer = (vertics: Array<number>, uniforms: Array<UniformLocationObj>, texture?: WebGLTexture) => {
        const gl = this.gl;
        gl.useProgram(this.shaderProgram);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        this.setUniformLocation(uniforms);
        if (texture) {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.activeTexture(gl.TEXTURE0 + 0);
        }
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertics), gl.STATIC_DRAW);
        gl.drawArrays(gl.TRIANGLES, 0, vertics.length / this.vertexSize);
    }
}

export default VaryMesh;