export { WebGL };
declare class WebGL {
    static initShaderProgram: (gl: WebGL2RenderingContext, vsSource: string, fsSource: string) => WebGLProgram;
    static loadShader: (gl: WebGL2RenderingContext, type: number, source: string) => WebGLShader;
    static bindEBO: (gl: WebGL2RenderingContext, index: Array<number>) => void;
    static setUniform: (gl: WebGL2RenderingContext, uniformLocation: WebGLUniformLocation, data: Array<number>) => void;
    /**
     *
     * @param gl
     * @param src
     * @returns 通过图片加载纹理
     */
    static getTexture: (gl: WebGL2RenderingContext, src: HTMLImageElement, repeat?: boolean) => WebGLTexture;
    /**
     *
     * @param gl
     * @param width
     * @param height
     * @returns 使用自行绘制的纹理加载
     */
    static getFBufferAndTexture: (gl: WebGL2RenderingContext, width: number, height: number) => {
        renderFrameBuffer: WebGLFramebuffer;
        textureFrameBuffer: WebGLFramebuffer;
        targetTexture: WebGLTexture;
    };
}
