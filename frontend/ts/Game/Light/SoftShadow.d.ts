import { Coord, FrameBufferInfo } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';
declare class SoftShadow {
    private shadowMesh;
    private gl;
    fBufferInfo: FrameBufferInfo;
    constructor(gl: WebGL2RenderingContext);
    drawSoftShadow: (lineVertics: Array<Coord>, lightPos: Coord, sLightRadius: number, bLightRadius: number, defaultUniform: Array<UniformLocationObj>) => void;
}
export default SoftShadow;
