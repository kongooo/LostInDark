import { UniformLocationObj } from "./interface";

export { WebGL }

class WebGL {
    static initShaderProgram = (gl: WebGL2RenderingContext, vsSource: string, fsSource: string) => {
        const vertexShader = WebGL.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = WebGL.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error(`shader program error: ${gl.getProgramInfoLog(shaderProgram)}`);
            return null;
        }

        return shaderProgram;
    }

    static loadShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error(`shader compile error: ${gl.getShaderInfoLog(shader)}`);
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    static bindEBO = (gl: WebGL2RenderingContext, index: Array<number>) => {
        const indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(index), gl.STATIC_DRAW);
    }

    static setUniform = (gl: WebGL2RenderingContext, uniformLocation: WebGLUniformLocation, uniformObj: UniformLocationObj) => {

        let data;
        switch (uniformObj.type) {
            case 'matrix':
                gl.uniformMatrix4fv(uniformLocation, false, uniformObj.data as Float32Array);
                break;
            case 'number':
                gl.uniform1f(uniformLocation, (uniformObj.data as Array<number>)[0]);
                break;
            case 'texture':
                const index = (uniformObj.data as Array<number>)[0];
                gl.activeTexture(gl.TEXTURE0 + index);
                gl.bindTexture(gl.TEXTURE_2D, uniformObj.texture);
                gl.uniform1i(uniformLocation, index);
                break;
            case 'vec2':
                data = (uniformObj.data as Array<number>);
                gl.uniform2f(uniformLocation, data[0], data[1]);
                break;
            case 'vec3':
                data = (uniformObj.data as Array<number>);
                gl.uniform3f(uniformLocation, data[0], data[1], data[2]);
                break;
            case 'vec4':
                data = (uniformObj.data as Array<number>);
                gl.uniform4f(uniformLocation, data[0], data[1], data[2], data[3]);
                break;
        }
    }

    /**
     * 
     * @param gl 
     * @param src 
     * @returns 通过图片加载纹理
     */
    static getTexture = (gl: WebGL2RenderingContext, src: HTMLImageElement, repeat = false) => {

        if (!src) return undefined;

        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Set the parameters so we can render any size image.
        const textureWrap = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, textureWrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, textureWrap);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
        return texture;
    }

    /**
     * 
     * @param gl 
     * @param width 
     * @param height 
     * @returns 使用自行绘制的纹理加载
     */
    static getFBufferAndTexture = (gl: WebGL2RenderingContext, width: number, height: number) => {

        const targetTexture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, targetTexture);
        {
            const level = 0;
            const internalFormat = gl.RGBA;
            const border = 0;
            const format = gl.RGBA;
            const type = gl.UNSIGNED_BYTE;
            const data: ArrayBufferView = null;
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, data);

            // set the filtering so we don't need mips
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        //创建带有SMAA效果的render buffer
        //SMAA效果只能在render buffer中使用
        const renderBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, renderBuffer);
        gl.renderbufferStorageMultisample(gl.RENDERBUFFER, 0, gl.RGBA8, gl.canvas.width, gl.canvas.height);

        //create render frame buffer
        const renderFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, renderFrameBuffer);

        //bind render buffer to current frame buffer
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, renderBuffer);

        //create texture frame buffer
        const textureFrameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, textureFrameBuffer);

        //bind texture to current frame buffer
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, targetTexture, 0);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        return {
            renderFrameBuffer,
            textureFrameBuffer,
            targetTexture
        }
    }
}