import itemVsSource from '../../../shaders/PlaceShader/vsSource.glsl';
import itemFsSource from '../../../shaders/PlaceShader/fsSource.glsl';

import StaticMesh from '../../Tools/Mesh/StaticMesh';
import { Coord } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';

class PlaceHintRect {

    private mesh: StaticMesh;

    constructor(gl: WebGL2RenderingContext) {
        const mesh = new StaticMesh(gl, itemVsSource, itemFsSource);
        mesh.getAttributeLocations([
            { name: 'a_position', size: 2 }
        ]);
        mesh.getVAO([
            0, 0,
            0, 1,
            1, 1,
            1, 0
        ], [0, 1, 2, 0, 2, 3])
        this.mesh = mesh;
    }

    draw = (worldPos: Coord, color: Array<number>, defaultUniform: Array<UniformLocationObj>) => {
        this.mesh.drawWithAVO([
            { name: 'u_worldPos', data: [worldPos.x, worldPos.y], type: 'vec2' },
            { name: 'u_color', data: color, type: 'vec3' },
            ...defaultUniform
        ])
    }
}

export default PlaceHintRect;