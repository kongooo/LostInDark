import { Mesh } from './Mesh';
import { UniformLocationObj } from '../interface';
import { WebGL } from '../WebGLUtils';

class StaticMesh extends Mesh {

    constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
        super(gl, vsSource, fsSource);
    }

    private vao: WebGLVertexArrayObject;
    private elementEnable: boolean;
    private vertexCount: number;
    private vertics: Array<number>;
    private indices: Array<number>;

    getVAO = (vertics: Array<number>, indices?: Array<number>) => {
        const gl = this.gl;
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertics), gl.STATIC_DRAW);
        if (indices) {
            WebGL.bindEBO(gl, indices);
            this.elementEnable = true;
        }
        this.vertexCount = indices ? indices.length : vertics.length / this.vertexSize;
        this.setAttribPointer();
        this.vao = vao;
        this.vertics = vertics;
        this.indices = indices;
        gl.bindVertexArray(null);
        return this.vao;
    }

    drawWithAVO = (uniforms: Array<UniformLocationObj>) => {
        const gl = this.gl;
        gl.useProgram(this.shaderProgram);
        gl.bindVertexArray(this.vao);
        this.setUniformLocation(uniforms);
        if (this.elementEnable) {
            gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);
        }
        gl.bindVertexArray(null);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

export default StaticMesh;