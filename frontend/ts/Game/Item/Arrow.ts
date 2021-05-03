import { Coord } from "../../Tools/Tool";
import StaticMesh from '../../Tools/Mesh/StaticMesh';
import { ItemInfo, ItemType, UniformLocationObj } from '../../Tools/interface';

import arrowVsSource from '../../../shaders/ArrowShader/vsSource.glsl';
import arrowFsSource from '../../../shaders/ArrowShader/fsSource.glsl';
import { ItemVertex } from "./ItemVertex";
import { WebGL } from "../../Tools/WebGLUtils";
import { mat4 } from "gl-matrix";

class Arrow {
    private mesh: StaticMesh;
    private texture: WebGLTexture;

    constructor(gl: WebGL2RenderingContext, img: HTMLImageElement) {
        this.mesh = new StaticMesh(gl, arrowVsSource, arrowFsSource);
        this.mesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_texCoord', size: 2 },
        ]);

        this.mesh.getVAO([
            -1, -1, 0, 0,
            -1, 1, 0, 1,
            1, 1, 1, 1,
            1, -1, 1, 0
        ], ItemVertex.squareIndices);
        this.texture = WebGL.getTexture(gl, img);
    }

    draw(worldPos: Coord, defaultUniforms: Array<UniformLocationObj>, angle: number) {
        const rotateMatrix = mat4.create();
        mat4.identity(rotateMatrix);
        mat4.rotateY(rotateMatrix, rotateMatrix, angle);
        this.mesh.drawWithAVO([
            { name: 'u_worldPos', data: [worldPos.x, worldPos.y], type: 'vec2' },
            { name: 'u_image', data: [0], type: 'texture', texture: this.texture },
            { name: 'u_scale', data: [1], type: 'float' },
            { name: 'u_rotateMatrix', data: rotateMatrix, type: 'matrix' },
            ...defaultUniforms
        ])
    }
}

export { Arrow };