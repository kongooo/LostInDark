import { Coord } from '../../Tools/Tool';
declare class GroundCanvas {
    private gl;
    private canvasMesh;
    private texture;
    constructor(gl: WebGL2RenderingContext, img: HTMLImageElement);
    draw: (leftDownPos: Coord, rightupPos: Coord) => void;
}
export default GroundCanvas;
