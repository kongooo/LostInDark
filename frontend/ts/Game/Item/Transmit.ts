import { Coord } from "../../Tools/Tool";
import StaticMesh from '../../Tools/Mesh/StaticMesh';
import { ImgType, ItemInfo, ItemType, UniformLocationObj } from '../../Tools/interface';

import transmitVsSource from '../../../shaders/TransmitShader/vsSource.glsl';
import transmitFsSource from '../../../shaders/TransmitShader/fsSource.glsl';
import { WebGL } from '../../Tools/WebGLUtils';
import { mat4 } from "gl-matrix";
import { ItemVertex } from "./ItemVertex";


class Transmit implements ItemInfo {
    pos: Coord;
    type: ItemType;
    move: boolean = false;
    private mesh: StaticMesh;
    private gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext, item: ItemInfo) {
        this.type = item.type;
        this.pos = item.pos;
        this.mesh = new StaticMesh(gl, transmitVsSource, transmitFsSource);
        this.mesh.getAttributeLocations([
            { name: 'a_position', size: 3 },
            { name: 'a_texCoord', size: 2 },
            { name: 'a_normal', size: 3 }
        ]);
        let vertices, indices;
        vertices = [...ItemVertex.getCubeVertices(2, 0.5, 2),
        ...ItemVertex.getCubeVertices(0.2, 2, 0.2),
        ...ItemVertex.getCubeVertices(0.2, 2, 0.2, { x: 1.8, y: 0 }),
        ...ItemVertex.getCubeVertices(0.2, 2, 0.2, { x: 1.8, y: 1.8 }),
        ...ItemVertex.getCubeVertices(0.2, 2, 0.2, { x: 0, y: 1.8 }),
        ...ItemVertex.getCubeVertices(0.1, 4, 0.1, { x: 0.95, y: 0.95 }),
        ...ItemVertex.getCubeVertices(0.4, 0.4, 0.4, { x: 0.8, y: 0.8 }, 4),
        ]
        indices = ItemVertex.getCubeIndicesByCount(7);
        this.mesh.getVAO(vertices, indices);
        this.gl = gl;
    }

    draw(defaultUniforms: Array<UniformLocationObj>) {
        this.mesh.drawWithAVO([
            { name: 'u_worldPos', data: [this.pos.x, this.pos.y], type: 'vec2' },
            // { name: 'u_rotateMatrix', data: this.rotateMatrix, type: 'matrix' },
            { name: 'u_color', data: [205, 208, 203], type: 'vec3' },
            ...defaultUniforms
        ])
    }
}

export { Transmit };