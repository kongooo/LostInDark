import { Coord, FrameBufferInfo } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';
declare class HardShadow {
    private shadowMesh;
    private gl;
    fBufferInfo: FrameBufferInfo;
    private mapSize;
    constructor(gl: WebGL2RenderingContext, mapSize: number, defaultUniformName: Array<string>);
    /**
     *
     * @param obstacleVertics 障碍物世界坐标
     * @param lightPos 光源世界坐标
     * @param radius 光源半径
     * @param defaultUniform 坐标转换uniform
     */
    drawHardShadow: (lineVertics: Array<Coord>, lightPos: Coord, radius: number, defaultUniform: Array<UniformLocationObj>, texture: WebGLTexture) => void;
}
export default HardShadow;
