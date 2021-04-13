import { WebGL } from '../../Tools/WebGLUtils';
import StaticMesh from '../../Tools/Mesh/StaticMesh';
import { UniformLocationObj } from '../../Tools/interface';
import { Coord } from '../../Tools/Tool';
import canvasVsSource from '../../../shaders/CanvasShader/vsSource.glsl';
import canvasFsSource from '../../../shaders/CanvasShader/fsSource.glsl';


class Canvas {

    private gl: WebGL2RenderingContext;
    private canvasMesh: StaticMesh;

    constructor(gl: WebGL2RenderingContext, mapCount: Coord) {

        const mesh = new StaticMesh(gl, canvasVsSource, canvasFsSource);
        mesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_texCoord', size: 2 }
        ])
        // mesh.getUniformLocations(['u_resolution', 'u_image', 'u_backColor', 'u_obstacleColor']);
        mesh.getVAO([
            0, 0, 0, 0,
            0, mapCount.y, 0, 1,
            mapCount.x, mapCount.y, 1, 1,
            mapCount.x, 0, 1, 0,
        ], [0, 1, 2, 0, 2, 3]);
        this.canvasMesh = mesh;
        this.gl = gl;
    }

    draw = (worldPos: Coord, defaultUniform: Array<UniformLocationObj>, texture?: WebGLTexture,) => {
        this.canvasMesh.drawWithAVO([
            { name: 'u_resolution', data: [this.gl.canvas.width, this.gl.canvas.height], type: 'vec2' },
            { name: 'u_image', data: [0], texture, type: 'texture' },
            { name: 'u_worldPos', data: [worldPos.x, worldPos.y], type: 'vec2' },
            ...defaultUniform
        ]);
    }
}

export default Canvas;