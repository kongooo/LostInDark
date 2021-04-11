declare class Canvas {
    private gl;
    private canvasMesh;
    constructor(gl: WebGL2RenderingContext, vsSource: string, fsSource: string);
    draw: (texture?: WebGLTexture, backColor?: Array<number>, obstacleColor?: Array<number>) => void;
}
export default Canvas;
