import { WebGL } from '../../Tools/WebGLUtils';
import VaryMesh from '../../Tools/Mesh/VaryMesh';
import rectVsSource from '../../../shaders/RectShader/vsSource.glsl';
import rectFsSource from '../../../shaders/RectShader/fsSource.glsl';
import { Coord } from '../../Tools/Tool';

class GroundCanvas {

    private gl: WebGL2RenderingContext;
    private canvasMesh: VaryMesh;
    private texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, img: HTMLImageElement) {

        const mesh = new VaryMesh(gl, rectVsSource, rectFsSource);
        mesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_texCoord', size: 2 }
        ])
        mesh.getUniformLocations(['u_resolution', 'u_image']);
        mesh.getBuffer();
        this.canvasMesh = mesh;
        this.gl = gl;
        this.texture = WebGL.getTexture(gl, img, true);
    }

    draw = (leftDownPos: Coord) => {
        const gl = this.gl;
        this.canvasMesh.drawWithBuffer([
            0, 0, leftDownPos.x, leftDownPos.y,
            gl.canvas.width, 0, leftDownPos.x + 1, leftDownPos.y,
            gl.canvas.width, gl.canvas.height, leftDownPos.x + 1, leftDownPos.y + 1,
            0, gl.canvas.height, leftDownPos.x, leftDownPos.y + 1
        ], [
            { name: 'u_resolution', data: [this.gl.canvas.width, this.gl.canvas.height] },
            { name: 'u_image', data: [0] },
        ], [0, 1, 2, 0, 2, 3], this.texture);
    }
}

export default GroundCanvas;