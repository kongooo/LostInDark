// import { vsSource, fsSource } from "../shaders/RectShader";
import vsSource from '../shaders/vsSource.glsl';
import fsSource from '../shaders/fsSource.glsl';
import { mat4 } from 'gl-matrix';

export { drawRect };

const drawRect = (gl: WebGL2RenderingContext) => {
    drawShape(gl, [
        10, 20,
        80, 20,
        10, 30,
        10, 30,
        80, 20,
        80, 30,
    ])
}

const drawShape = (gl: WebGL2RenderingContext, vertices: Array<number>) => {
    const maxWidth = gl.canvas.width;
    const maxHeight = gl.canvas.height;
    const circleCount = 20;
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    let positionAttributeLoaction = gl.getAttribLocation(shaderProgram, 'a_position');
    let resolutionUniformLocation = gl.getUniformLocation(shaderProgram, 'u_resolution');
    let translationUniformLocation = gl.getUniformLocation(shaderProgram, 'u_translation');
    let colorUmiformLocation = gl.getUniformLocation(shaderProgram, 'u_color');
    const rectVAO = getRectangleVAO(gl, positionAttributeLoaction, 0, 0, 100, 100);
    const circleVAO = getCircleVAO(gl, positionAttributeLoaction, maxWidth / 2, maxHeight / 2, 100, circleCount);
    gl.useProgram(shaderProgram);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    gl.bindVertexArray(rectVAO);
    gl.uniform2f(translationUniformLocation, 100, 100);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.uniform2f(translationUniformLocation, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);


    gl.bindVertexArray(circleVAO);
    gl.drawArrays(gl.TRIANGLES, 0, 6 * circleCount);
    gl.uniform2f(translationUniformLocation, 200, 200);
    gl.drawArrays(gl.TRIANGLES, 0, 6 * circleCount);

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

const getRectangleVAO = (gl: WebGL2RenderingContext, positionAttributeLoaction: number, x: number, y: number, width: number, height: number) => {
    const x1 = x, x2 = x + width, y1 = y, y2 = y + height;
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x2, y2,
        x1, y2,
        x2, y1
    ]), gl.STATIC_DRAW)
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    setAttribPointer(gl, positionAttributeLoaction);
    return vao;
}

const getCircleVAO = (gl: WebGL2RenderingContext, positionAttributeLoaction: number, centerX: number, centerY: number, radius: number, count: number) => {
    const precision = Math.PI / count;
    let vertices = [];
    for (let theta = 0; theta <= Math.PI * 2; theta += precision) {
        vertices.push(...[centerX, centerY,
            centerX + radius * Math.cos(theta), centerY + radius * Math.sin(theta),
            centerX + radius * Math.cos(theta + precision), centerY + radius * Math.sin(theta + precision),])
    }
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    let vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    setAttribPointer(gl, positionAttributeLoaction);
    return vao;
}

const setAttribPointer = (gl: WebGL2RenderingContext, positionAttributeLoaction: number) => {
    gl.enableVertexAttribArray(positionAttributeLoaction);

    const size = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.vertexAttribPointer(positionAttributeLoaction, size, type, normalize, stride, offset);
}

const randomInt = (range: number) => {
    return Math.floor(Math.random() * range);
}

