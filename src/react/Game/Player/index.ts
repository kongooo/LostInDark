import colorRectVsSource from '../../shaders/ColorRectShader/vsSource.glsl';
import colorRectFsSource from '../../shaders/ColorRectShader/fsSource.glsl';

import StaticMesh from '../../Tools/Mesh/StaticMesh';

const SIZE = 40;
const PLAYER_COLOR = [255, 199, 199];

class Player {
    private playerMesh: StaticMesh;
    private gl: WebGL2RenderingContext;
    constructor(gl: WebGL2RenderingContext) {
        const playerMesh = new StaticMesh(gl, colorRectVsSource, colorRectFsSource);
        playerMesh.getAttributeLocations([{ name: 'a_position', size: 2 }]);
        playerMesh.getUniformLocations(['u_resolution', 'u_translation', 'u_color']);
        playerMesh.getVAO([
            0, 0,
            SIZE, 0,
            SIZE, SIZE,
            0, SIZE
        ], [0, 1, 2, 0, 2, 3]);
        this.playerMesh = playerMesh;
        this.gl = gl;
    }

    draw(x: number, y: number) {
        this.playerMesh.drawWithAVO([
            { name: 'u_resolution', data: [this.gl.canvas.width, this.gl.canvas.height] },
            { name: 'u_translation', data: [x, y] },
            { name: 'u_color', data: PLAYER_COLOR },
        ])
    }
}

export default Player;