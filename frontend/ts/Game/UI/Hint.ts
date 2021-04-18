import hintVsSource from '../../../shaders/HintShader/vsSource.glsl';
import hintFsSource from '../../../shaders/HintShader/fsSource.glsl';

import StaticMesh from '../../Tools/Mesh/StaticMesh';
import { Coord } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';
import { WebGL } from '../../Tools/WebGLUtils';


class Hint {
    private mesh: StaticMesh;
    private gl: WebGL2RenderingContext;
    private texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, img: HTMLImageElement) {
        const mesh = new StaticMesh(gl, hintVsSource, hintFsSource);
        mesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_texCoord', size: 2 }
        ]);

        mesh.getVAO([
            0, 0, 0, 0,
            0.4, 0, 1, 0,
            0.4, 0.4, 1, 1,
            0, 0.4, 0, 1
        ], [0, 1, 2, 0, 2, 3]);

        this.mesh = mesh;
        this.gl = gl;
        this.texture = WebGL.getTexture(gl, img);
    }


    draw(worldPos: Coord, defaultUniform: Array<UniformLocationObj>) {
        this.mesh.drawWithAVO([
            { name: 'u_image', data: [0], type: 'texture', texture: this.texture },
            { name: 'u_worldPos', data: [worldPos.x, worldPos.y], type: 'vec2' },
            ...defaultUniform
        ])
    }
}

export default Hint;