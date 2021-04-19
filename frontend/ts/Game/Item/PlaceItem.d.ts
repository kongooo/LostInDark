import { Coord } from '../../Tools/Tool';
import { UniformLocationObj } from '../../Tools/interface';
declare class PlaceHintRect {
    private mesh;
    constructor(gl: WebGL2RenderingContext);
    draw: (worldPos: Coord, color: Array<number>, defaultUniform: Array<UniformLocationObj>) => void;
}
export default PlaceHintRect;
