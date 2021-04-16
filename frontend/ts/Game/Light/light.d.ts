import { Coord, FrameBufferInfo } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';
declare class Light {
    private lightMesh;
    private gl;
    lightRadius: number;
    fBufferInfo: FrameBufferInfo;
    constructor(gl: WebGL2RenderingContext, lightRadius: number);
    /**
     *
     * @param worldPos 光源世界坐标
     * @param texture shadow贴图
     */
    draw: (worldPos: Coord, texture: WebGLTexture, defaultUniform: Array<UniformLocationObj>) => void;
}
export default Light;
