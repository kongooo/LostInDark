export { WebGL };
declare class WebGL {
    static initShaderProgram: (gl: WebGL2RenderingContext, vsSource: string, fsSource: string) => WebGLProgram;
    static loadShader: (gl: WebGL2RenderingContext, type: number, source: string) => WebGLShader;
    static bindEBO: (gl: WebGL2RenderingContext, index: Array<number>) => void;
    static setUniform: (gl: WebGL2RenderingContext, uniformLocation: WebGLUniformLocation, data: Array<number>) => void;
    static getTexture: (gl: WebGL2RenderingContext, src: any) => WebGLTexture;
    static getFBufferAndTexture: (gl: WebGL2RenderingContext, width: number, height: number) => {
        renderFrameBuffer: WebGLFramebuffer;
        textureFrameBuffer: WebGLFramebuffer;
        targetTexture: WebGLTexture;
    };
}
