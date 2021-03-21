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

    static setUniform = (gl: WebGL2RenderingContext, uniformLocation: WebGLUniformLocation, data: Array<number>) => {
        const size = data.length;
        switch (size) {
            case 1:
                gl.uniform1f(uniformLocation, data[0]);
                break;
            case 2:
                gl.uniform2f(uniformLocation, data[0], data[1]);
                break;
            case 3:
                gl.uniform3f(uniformLocation, data[0], data[1], data[2]);
                break;
            case 4:
                gl.uniform4f(uniformLocation, data[0], data[1], data[2], data[3]);
                break;
        }
    }

    static getTexture = (gl: WebGL2RenderingContext, src: any) => {
        const texture = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture);
        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
        return texture;
    }

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

        const fb = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb);

        const attachmentPoint = gl.COLOR_ATTACHMENT0;
        const level = 0;
        gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, targetTexture, level);
        return {
            frameBuffer: fb,
            targetTexture
        }
    }
}