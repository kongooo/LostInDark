import lightVsSource from '../shaders/LightShader/vsSource.glsl';
import lightFsSource from '../shaders/LightShader/fsSource.glsl';
import rectVsSource from '../shaders/RectShader/vsSource.glsl';
import rectFsSource from '../shaders/RectShader/fsSource.glsl';

import imgSource from '../../../image/girl.png';

import { WebGL } from '../Tools/WebGLUtils';

import StaticMesh from '../Tools/Mesh/StaticMesh';
import VaryMesh from '../Tools/Mesh/VaryMesh';

export { gameStart };

const gameStart = (gl: WebGL2RenderingContext) => {

    const renderResults = renderLightToTexture(gl);
    const frameBuffer = renderResults[0];
    const targetTexture = renderResults[1];

    const TestVaryMesh = new VaryMesh(gl, rectVsSource, rectFsSource);
    TestVaryMesh.getAttributeLocations([
        { name: 'a_position', size: 2 },
        { name: 'a_texCoord', size: 2 }
    ])
    TestVaryMesh.getUniformLocations(['u_resolution', 'u_image']);
    TestVaryMesh.getBuffer();


    const TestRectMesh = new StaticMesh(gl, rectVsSource, rectFsSource);
    TestRectMesh.getAttributeLocations([
        { name: 'a_position', size: 2 },
        { name: 'a_texCoord', size: 2 }
    ])
    TestRectMesh.getUniformLocations(['u_resolution', 'u_image']);
    TestRectMesh.getVAO([
        0, 0, 0, 0,
        gl.canvas.width, 0, 1, 0,
        gl.canvas.width, gl.canvas.height, 1, 1,
        0, gl.canvas.height, 0, 1
    ], [0, 1, 2, 0, 2, 3]);

    let dirX = 0, dirY = 0;
    const speed = 10;


    const LightMesh = new StaticMesh(gl, lightVsSource, lightFsSource);
    LightMesh.getAttributeLocations([
        { name: 'a_position', size: 2 },
        { name: 'a_texCoord', size: 2 }
    ])
    LightMesh.getUniformLocations(['u_resolution', 'u_translation', 'u_scale']);
    LightMesh.getVAO([
        0, 0, 0, 0,
        200, 0, 1, 0,
        200, 200, 1, 1,
        0, 200, 0, 1
    ], [0, 1, 2, 0, 2, 3]);

    const draw = (x: number, y: number, texture: WebGLTexture) => {
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        {
            gl.disable(gl.BLEND);
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            LightMesh.drawWithAVO([
                { name: 'u_resolution', data: [gl.canvas.width, gl.canvas.height] },
                { name: 'u_translation', data: [x, y] },
                { name: 'u_scale', data: [1] }
            ])
        }

        {
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

            TestRectMesh.drawWithAVO([
                { name: 'u_resolution', data: [gl.canvas.width, gl.canvas.height] },
                { name: 'u_image', data: [0] }
            ], texture);
        }
        {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.DST_COLOR, 0);
            TestRectMesh.drawWithAVO([
                { name: 'u_resolution', data: [gl.canvas.width, gl.canvas.height] },
                { name: 'u_image', data: [0] }
            ], targetTexture);
        }
    }



    const moveLight = (event: KeyboardEvent) => {
        const keyCode = event.key;
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

