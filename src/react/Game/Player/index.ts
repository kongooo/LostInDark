import playerVsSource from '../../shaders/PlayerShader/vsSource.glsl';
import playerFsSource from '../../shaders/PlayerShader/fsSource.glsl';

import VaryMesh from '../../Tools/Mesh/VaryMesh';
import { Coord } from '../../Tools/Tool';


class Player {
    private playerMesh: VaryMesh;
    private gl: WebGL2RenderingContext;
    private size: number;

    constructor(gl: WebGL2RenderingContext, size: number) {
        const playerMesh = new VaryMesh(gl, playerVsSource, playerFsSource);
        playerMesh.getAttributeLocations([{ name: 'a_position', size: 2 }]);
        playerMesh.getUniformLocations(['u_resolution', 'u_cameraWorldPos', 'u_mapSize']);
        playerMesh.getBuffer();
        this.playerMesh = playerMesh;
        this.gl = gl;
        this.size = size;
    }

    draw(pos: Coord, cameraWorldPos: Coord, mapSize: number) {
        this.playerMesh.drawWithBuffer([
            pos.x, pos.y,
            pos.x + this.size, pos.y,
            pos.x + this.size, pos.y + this.size,
            pos.x, pos.y + this.size
        ],
            [
                { name: 'u_resolution', data: [this.gl.canvas.width, this.gl.canvas.height] },
                { name: 'u_cameraWorldPos', data: [cameraWorldPos.x, cameraWorldPos.y] },
                { name: 'u_mapSize', data: [mapSize] },
            ], [0, 1, 2, 0, 2, 3]);
    }
}

export default Player;