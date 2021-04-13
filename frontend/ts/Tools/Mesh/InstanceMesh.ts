import { Mesh } from './Mesh';
import { Attrib, AttribLocationObj, UniformLocationObj } from '../interface';
import { WebGL } from '../WebGLUtils';

class InstanceMesh extends Mesh {

    constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string) {
        super(gl, vsSource, fsSource);
        this.instanceAttribs = [];
    }

    private meshVAO: WebGLVertexArrayObject;
    private instanceBuffer: WebGLBuffer;
    private instanceAttribs: Array<AttribLocationObj>;
    private instanceAttribSize: number;
    private meshIndicesCount: number;

    getBufferAndVAO = (meshVertics: Array<number>, meshIndices: Array<number>) => {
        const gl = this.gl;

        const VAO = gl.createVertexArray();
        gl.bindVertexArray(VAO);
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(meshVertics), gl.STATIC_DRAW);

        WebGL.bindEBO(gl, meshIndices);

        this.setAttribPointer();

        this.meshVAO = VAO;
        this.meshIndicesCount = meshIndices.length;
        gl.bindVertexArray(null);

        const instanceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
        this.instanceBuffer = instanceBuffer;
    }

    /**
     * 
     * @param attribs instance attribute object array
     * @returns instance attribute object array
     */
    getInstanceAttribLocations = (attribs: Array<Attrib>) => {
        attribs.forEach((attrib) => {
            const attribLocation = this.gl.getAttribLocation(this.shaderProgram, attrib.name);
            this.instanceAttribs.push({
                attribLocation,
                size: attrib.size
            });
        })
        this.instanceAttribSize = this.instanceAttribs.reduce((pre, cur) => ({ attribLocation: pre.attribLocation, size: pre.size + cur.size })).size;
        return this.instanceAttribs;
    }


    private setInstanceAttribPointer = () => {
        const gl = this.gl;
        let offset = 0;
        this.instanceAttribs.forEach((attribObj) => {
            gl.enableVertexAttribArray(attribObj.attribLocation);
            gl.vertexAttribPointer(attribObj.attribLocation, attribObj.size, gl.FLOAT, false, this.instanceAttribSize * Mesh.FLOAT_SIZE, offset * Mesh.FLOAT_SIZE);
            gl.vertexAttribDivisor(attribObj.attribLocation, 1);
            offset += attribObj.size;
        })
    }


    drawWithBufferAndVAO = (instanceVertics: Array<number>, uniforms: Array<UniformLocationObj>) => {
        const gl = this.gl;
        gl.useProgram(this.shaderProgram);


        gl.bindVertexArray(this.meshVAO);

        this.setUniformLocation(uniforms);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(instanceVertics), gl.DYNAMIC_DRAW);
        this.setInstanceAttribPointer();

        gl.drawElementsInstanced(gl.TRIANGLES, this.meshIndicesCount, gl.UNSIGNED_SHORT, 0, instanceVertics.length / this.instanceAttribSize)

        gl.bindVertexArray(null);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }
}

export default InstanceMesh;