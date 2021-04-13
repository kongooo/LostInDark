import playerVsSource from '../../../shaders/PlayerShader/vsSource.glsl';
import playerFsSource from '../../../shaders/PlayerShader/fsSource.glsl';

import VaryMesh from '../../Tools/Mesh/VaryMesh';
import { Coord } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';
import { WebGL } from '../../Tools/WebGLUtils';
import Camera from '../Camera';


class Player {
    private playerMesh: VaryMesh;
    private gl: WebGL2RenderingContext;
    private playerTexture: WebGLTexture;
    private size: number;

    constructor(gl: WebGL2RenderingContext, size: number, defaultUniformName: Array<string>, img: HTMLImageElement) {
        const playerMesh = new VaryMesh(gl, playerVsSource, playerFsSource);
        playerMesh.getAttributeLocations([
            { name: 'a_position', size: 2 },
            { name: 'a_texCoord', size: 2 }
        ]);
        // playerMesh.getUniformLocations(['u_worldPos', 'u_image', 'u_scale', 'u_projectionMatrix', 'u_viewMatrix', ...defaultUniformName]);
        playerMesh.getBuffer();

        this.playerMesh = playerMesh;
        this.gl = gl;
        this.size = size;
        this.playerTexture = WebGL.getTexture(gl, img);
    }

    /**
     * 
     * @param playerWorldPos 
     * @param defaultUniform 
     * @param level 方向对应的图片层数
     */
    draw(playerWorldPos: Coord, defaultUniform: Array<UniformLocationObj>, level: number, animaFrame: number) {
        this.playerMesh.drawWithBuffer([
            0, 0, 0.25 * animaFrame, 0.25 * level,
            this.size, 0, 0.25 * (animaFrame + 1), 0.25 * level,
            this.size, this.size, 0.25 * (animaFrame + 1), 0.25 * (level + 1),
            0, this.size, 0.25 * animaFrame, 0.25 * (level + 1)
        ], [
            { name: 'u_worldPos', data: [playerWorldPos.x, playerWorldPos.y], type: 'vec2' },
            { name: 'u_image', data: [0], type: 'texture', texture: this.playerTexture },
            { name: 'u_scale', data: [1], type: 'number' },
            ...defaultUniform
        ], [
            0, 1, 2, 0, 2, 3
        ]);
    }
}

export default Player;