import lightVsSource from '../shaders/LightShader/vsSource.glsl';
import lightFsSource from '../shaders/LightShader/fsSource.glsl';
import rectVsSource from '../shaders/RectShader/vsSource.glsl';
import rectFsSource from '../shaders/RectShader/fsSource.glsl';

import imgSource from '../../../image/girl.png';

import { WebGL } from '../Tools/WebGLUtils';
import KeyPress from '../Tools/Event/KeyEvent';

import StaticMesh from '../Tools/Mesh/StaticMesh';
import VaryMesh from '../Tools/Mesh/VaryMesh';

import PerlinMap from './Map/index';
import Player from './Player/index';

export { gameStart };

const BACK_COLOR = { r: 246, g: 246, b: 246 };

const gameStart = (gl: WebGL2RenderingContext) => {

    let deltaTime = 0;

    const map = new PerlinMap(gl, randomInt(0, 1000));
    const player = new Player(gl);

    const fBufferInfo = WebGL.getFBufferAndTexture(gl, gl.canvas.width, gl.canvas.height);

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
    const speed = 50;


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
        move();
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        {
            // gl.disable(gl.BLEND);
            // gl.bindFramebuffer(gl.FRAMEBUFFER, fBufferInfo.frameBuffer);
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            gl.clearColor(BACK_COLOR.r / 255, BACK_COLOR.g / 255, BACK_COLOR.b / 255, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
            map.draw(1000, 1000);
            player.draw(x, y);
            // LightMesh.drawWithAVO([
            //     { name: 'u_resolution', data: [gl.canvas.width, gl.canvas.height] },
            //     { name: 'u_translation', data: [x, y] },
            //     { name: 'u_scale', data: [1] }
            // ])
        }

        // {
        //     gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        //     TestRectMesh.drawWithAVO([
        //         { name: 'u_resolution', data: [gl.canvas.width, gl.canvas.height] },
        //         { name: 'u_image', data: [0] }
        //     ], texture);
        // }
        // {
        //     gl.enable(gl.BLEND);
        //     gl.blendFunc(gl.DST_COLOR, 0);
        //     TestRectMesh.drawWithAVO([
        //         { name: 'u_resolution', data: [gl.canvas.width, gl.canvas.height] },
        //         { name: 'u_image', data: [0] }
        //     ], fBufferInfo.targetTexture);
        // }
    }



    const move = () => {
        const distance = speed * deltaTime;
        if (KeyPress.get('w')) {
            dirY -= distance;
        }
        if (KeyPress.get('s')) {
            dirY += distance;
        }
        if (KeyPress.get('a')) {
            dirX -= distance;
            // console.log(dirX, dirY);
        }
        if (KeyPress.get('d')) {
            dirX += distance;
        }

    }

    const image = new Image();
    image.src = imgSource;
    image.onload = () => {
        const skyTexture = WebGL.getTexture(gl, image);
        let lastTime = 0;
        const update = (now: number) => {
            // console.log(delay);
            deltaTime = (now - lastTime) / 1000;
            // console.log(deltaTime);
            lastTime = now;
            draw(dirX, dirY, skyTexture);
            requestAnimationFrame(update);
        }
        update(0);
        // draw(0, 0, skyTexture);
    }

}

const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
}

