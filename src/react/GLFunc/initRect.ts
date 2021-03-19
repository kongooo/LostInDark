// import { vsSource, fsSource } from "../shaders/RectShader";
import vsSource from '../shaders/StarShaders/vsSource.glsl';
import fsSource from '../shaders/StarShaders/fsSource.glsl';
import skyFsSource from '../shaders/SkyShaders/skyFsSource.glsl';
import skyVsSource from '../shaders/SkyShaders/skyVsSource.glsl';
import { mat4 } from 'gl-matrix';
import imgSource from '../../../image/girl.png';
import { render } from 'react-dom';

export { drawRect };

const drawRect = (gl: WebGL2RenderingContext) => {
    drawShape(gl);
}

const drawShape = (gl: WebGL2RenderingContext) => {
    const maxWidth = gl.canvas.width;
    const maxHeight = gl.canvas.height;
    const circleCount = 10;

    const skyShaderProgram = initShaderProgram(gl, skyVsSource, skyFsSource);
    const skyPosAttributeLoaction = gl.getAttribLocation(skyShaderProgram, 'a_position');
    const skyTexAttributeLoaction = gl.getAttribLocation(skyShaderProgram, 'a_texCoord');
    const colorAttributeLoaction = gl.getAttribLocation(skyShaderProgram, 'a_color');
    const skyResolutionUniformLocation = gl.getUniformLocation(skyShaderProgram, 'u_resolution');
    const skyImageUniformLocation = gl.getUniformLocation(skyShaderProgram, 'u_image');


    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const positionAttributeLoaction = gl.getAttribLocation(shaderProgram, 'a_position');
    const starTexAttributeLoaction = gl.getAttribLocation(shaderProgram, 'a_texCoord');
    const resolutionUniformLocation = gl.getUniformLocation(shaderProgram, 'u_resolution');
    const translationUniformLocation = gl.getUniformLocation(shaderProgram, 'u_translation');
    const scaleUniformLocation = gl.getUniformLocation(shaderProgram, 'u_scale');

    const renderResults = renderLightToTexture(gl);
    const frameBuffer = renderResults[0];
    const targetTexture = renderResults[1];

    const UVCircleVAO = getUVCircleVAO(gl, positionAttributeLoaction, starTexAttributeLoaction, 100, 100, 100);
    const rectVAO = getRectangleVAO(gl, skyPosAttributeLoaction, 0, 0, gl.canvas.width, gl.canvas.height, colorAttributeLoaction, skyTexAttributeLoaction);//gl.canvas.width, gl.canvas.height);

    let dirX = 0, dirY = 0;
    const speed = 10;

    const draw = (x: number, y: number, skyTexture: WebGLTexture) => {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        {
            gl.disable(gl.BLEND);
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            // gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            gl.useProgram(shaderProgram);
            gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
            gl.bindVertexArray(UVCircleVAO);
            gl.uniform2f(translationUniformLocation, x, y);
            gl.uniform1f(scaleUniformLocation, 2);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        }

        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            // const skyTexture = getTextureFromImg(gl, image);
            // console.log(skyTexture);
            gl.bindTexture(gl.TEXTURE_2D, skyTexture);
            gl.useProgram(skyShaderProgram);
            gl.uniform2f(skyResolutionUniformLocation, gl.canvas.width, gl.canvas.height);
            gl.activeTexture(gl.TEXTURE0 + 0);
            gl.uniform1i(skyImageUniformLocation, 0);
            gl.bindVertexArray(rectVAO);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        }

        {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.DST_COLOR, 0);
            gl.bindTexture(gl.TEXTURE_2D, targetTexture);
            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
        }
    }



    const moveLight = (event: KeyboardEvent) => {
        const keyCode = event.key;
        console.log(keyCode);
        if (keyCode === 'w') {
            dirY += speed;
        }
        if (keyCode === 's') {
            dirY -= speed;
        }
        if (keyCode === 'a') {
            dirX -= speed;
        }
        if (keyCode === 'd') {
            dirX += speed;
        }

    }

    document.onkeydown = moveLight;

    const image = new Image();
    image.src = imgSource;
    image.onload = () => {
        const skyTexture = getTextureFromImg(gl, image);
        const update = () => {
            draw(dirX, dirY, skyTexture);
            requestAnimationFrame(update);
        }
        update();
        // draw(0, 0, skyTexture);
    }

}


const initShaderProgram = (gl: WebGL2RenderingContext, vsSource: string, fsSource: string) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

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

const loadShader = (gl: WebGL2RenderingContext, type: number, source: string) => {
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

const getRectangleVAO = (gl: WebGL2RenderingContext, positionAttributeLoaction: number, x: number, y: number, width: number, height: number, colorAttributeLoaction: number, texAttributeLocation: number) => {
    const x1 = x, x2 = x + width, y1 = y, y2 = y + height;
    const FLOAT_SIZE = 4;
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1, 0, 0, 0, 0, 0,
        x2, y1, 100, 100, 100, 1, 0,
        x2, y2, 200, 200, 200, 1, 1,
        // x1, y1,//
        // x2, y2,//
        x1, y2, 150, 150, 150, 0, 1
    ]), gl.STATIC_DRAW);


    bindEBO(gl);
    gl.enableVertexAttribArray(positionAttributeLoaction);
    gl.vertexAttribPointer(positionAttributeLoaction, 2, gl.FLOAT, false, 7 * FLOAT_SIZE, 0);
    gl.enableVertexAttribArray(colorAttributeLoaction);
    gl.vertexAttribPointer(colorAttributeLoaction, 3, gl.FLOAT, false, 7 * FLOAT_SIZE, 2 * FLOAT_SIZE);
    gl.enableVertexAttribArray(texAttributeLocation);
    gl.vertexAttribPointer(texAttributeLocation, 2, gl.FLOAT, false, 7 * FLOAT_SIZE, 5 * FLOAT_SIZE);
    return vao;
}



const bindEBO = (gl: WebGL2RenderingContext) => {
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([
        0, 1, 2,
        0, 2, 3
    ]), gl.STATIC_DRAW);
}

const getCircleVAO = (gl: WebGL2RenderingContext, positionAttributeLoaction: number, centerX: number, centerY: number, radius: number, count: number) => {
    const precision = Math.PI / count;
    let vertices = [];
    for (let theta = 0; theta <= Math.PI * 2; theta += precision) {
        vertices.push(...[centerX, centerY,
            centerX + radius * Math.cos(theta), centerY + radius * Math.sin(theta),
            centerX + radius * Math.cos(theta + precision), centerY + radius * Math.sin(theta + precision),])
    }
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    setAttribPointer(gl, positionAttributeLoaction, 2, 0);
    return vao;

}

const getUVCircleVAO = (gl: WebGL2RenderingContext, positionAttributeLoaction: number, texAttributeLocation: number, x: number, y: number, radius: number) => {
    const vao = gl.createVertexArray();
    const FLOAT_SIZE = 4;
    gl.bindVertexArray(vao);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x, y, 0, 0,
        x + radius * 2, y, 1, 0,
        radius * 2 + x, radius * 2 + y, 1, 1,
        x, radius * 2 + y, 0, 1
    ]), gl.STATIC_DRAW);
    bindEBO(gl);
    gl.enableVertexAttribArray(positionAttributeLoaction);
    gl.vertexAttribPointer(positionAttributeLoaction, 2, gl.FLOAT, false, 4 * FLOAT_SIZE, 0);
    gl.enableVertexAttribArray(texAttributeLocation);
    gl.vertexAttribPointer(texAttributeLocation, 2, gl.FLOAT, false, 4 * FLOAT_SIZE, 2 * FLOAT_SIZE);
    return vao;
}

const renderLightToTexture = (gl: WebGL2RenderingContext) => {
    const textureWidth = gl.canvas.width;
    const textureHeight = gl.canvas.height;
    const targetTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, targetTexture);
    {
        const level = 0;
        const internalFormat = gl.RGBA;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        const data: ArrayBufferView = null;
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, textureWidth, textureHeight, border, format, type, data);

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
    return [fb, targetTexture];
}

const getTextureFromImg = (gl: WebGL2RenderingContext, img: HTMLImageElement) => {
    const texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    return texture;
}

const setAttribPointer = (gl: WebGL2RenderingContext, positionAttributeLoaction: number, abbrSize: number, abbrOffset: number) => {
    gl.enableVertexAttribArray(positionAttributeLoaction);

    const size = abbrSize;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = abbrOffset;

    gl.vertexAttribPointer(positionAttributeLoaction, size, type, normalize, stride, offset);
}

const randomInt = (range: number) => {
    return Math.floor(Math.random() * range);
}

