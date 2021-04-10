import { Coord } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';
declare class Player {
    private playerMesh;
    private gl;
    constructor(gl: WebGL2RenderingContext, size: number, defaultUniformName: Array<string>);
    draw(playerWorldPos: Coord, defaultUniform: Array<UniformLocationObj>, color: Array<number>): void;
}
export default Player;
