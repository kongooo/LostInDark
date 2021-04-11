import { Coord } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';
declare class Player {
    private playerMesh;
    private gl;
    private playerTexture;
    private size;
    constructor(gl: WebGL2RenderingContext, size: number, defaultUniformName: Array<string>, img: HTMLImageElement);
    /**
     *
     * @param playerWorldPos
     * @param defaultUniform
     * @param level 方向对应的图片层数
     */
    draw(playerWorldPos: Coord, defaultUniform: Array<UniformLocationObj>, level: number, animaFrame: number): void;
}
export default Player;
