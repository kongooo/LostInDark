import { WebGL } from '../../Tools/WebGLUtils';
import VaryMesh from '../../Tools/Mesh/VaryMesh';
import rectVsSource from '../../../shaders/RectShader/vsSource.glsl';
import rectFsSource from '../../../shaders/RectShader/fsSource.glsl';
import { Coord, CoordUtils } from '../../Tools/Tool';
import Camera from '../Camera';
import { UniformLocationObj } from '../../Tools/interface';

class GroundCanvas {

    private gl: WebGL2RenderingContext;
    private canvasMesh: VaryMesh;
    private texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, img: HTMLImageElement) {

        const mesh = new VaryMesh(gl, rectVsSource, rectFsSource);
        mesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_texCoord', size: 2 },
            { name: 'a_texCoord1', size: 2 }
        ])
        // mesh.getUniformLocations(['u_resolution', 'u_image']);
        mesh.getBuffer();
        this.canvasMesh = mesh;
        this.gl = gl;
        this.texture = WebGL.getTexture(gl, img, true);
    }


    draw = (worldPos: Coord, leftDownPos: Coord, mapCount: Coord, defaultUniform: Array<UniformLocationObj>, lightShadowTexture: WebGLTexture) => {
        const gl = this.gl;
        // mapCount = CoordUtils.add(mapCount, 5);
        this.canvasMesh.drawWithBuffer([
            worldPos.x, worldPos.y, leftDownPos.x, leftDownPos.y, 0, 0,
            worldPos.x, worldPos.y + mapCount.y, leftDownPos.x, leftDownPos.y + 1, 0, 1,
            worldPos.x + mapCount.x, worldPos.y + mapCount.y, leftDownPos.x + 1, leftDownPos.y + 1, 1, 1,
            worldPos.x + mapCount.x, worldPos.y, leftDownPos.x + 1, leftDownPos.y, 1, 0
        ], [
            { name: 'u_resolution', data: [this.gl.canvas.width, this.gl.canvas.height], type: 'vec2' },
            { name: 'u_image', data: [0], texture: this.texture, type: 'texture' },
            { name: 'u_shadow', data: [1], texture: lightShadowTexture, type: 'texture' },
            ...defaultUniform
        ], [0, 1, 2, 0, 2, 3]);
    }
}

export default GroundCanvas;