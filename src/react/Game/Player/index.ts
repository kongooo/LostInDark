import playerVsSource from '../../shaders/PlayerShader/vsSource.glsl';
import playerFsSource from '../../shaders/PlayerShader/fsSource.glsl';

import StaticMesh from '../../Tools/Mesh/StaticMesh';
import { Coord } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';


class Player {
    private playerMesh: StaticMesh;
    private gl: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext, size: number, defaultUniformName: Array<string>) {
        const playerMesh = new StaticMesh(gl, playerVsSource, playerFsSource);
        playerMesh.getAttributeLocations([{ name: 'a_position', size: 2 }]);
        playerMesh.getUniformLocations(['u_worldPos', 'u_color', ...defaultUniformName]);
        playerMesh.getVAO([
            0, 0,
            size, 0,
            size, size,
            0, size
        ], [0, 1, 2, 0, 2, 3]);
        this.playerMesh = playerMesh;
        this.gl = gl;
    }

    draw(playerWorldPos: Coord, defaultUniform: Array<UniformLocationObj>, color: Array<number>) {
        this.playerMesh.drawWithAVO([
            { name: 'u_worldPos', data: [playerWorldPos.x, playerWorldPos.y] },
            { name: 'u_color', data: color },
            ...defaultUniform
        ]);
    }
}

export default Player;