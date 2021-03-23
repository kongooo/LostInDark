import rectVsSource from '../../shaders/RectShader/vsSource.glsl';
import rectFsSource from '../../shaders/RectShader/fsSource.glsl';

import StaticMesh from '../../Tools/Mesh/StaticMesh';

class Canvas {

    private gl: WebGL2RenderingContext;
    private canvasMesh: StaticMesh;

    constructor(gl: WebGL2RenderingContext) {

        const mesh = new StaticMesh(gl, rectVsSource, rectFsSource);
        mesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_texCoord', size: 2 }
        ])
        mesh.getUniformLocations(['u_resolution', 'u_image']);
        mesh.getVAO([
            0, 0, 0, 0,
            gl.canvas.width, 0, 1, 0,
            gl.canvas.width, gl.canvas.height, 1, 1,
            0, gl.canvas.height, 0, 1
        ], [0, 1, 2, 0, 2, 3]);
        this.canvasMesh = mesh;
        this.gl = gl;
    }

    draw = (texture: WebGLTexture) => {
        this.canvasMesh.drawWithAVO([
            { name: 'u_resolution', data: [this.gl.canvas.width, this.gl.canvas.height] },
            { name: 'u_image', data: [0] }
        ], texture);
    }
}

export default Canvas;