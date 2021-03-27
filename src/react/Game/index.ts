import PerlinMap from './Map/index';
import Player from './Player/index';
import Light from './Light/light';
import Shadow from './Light/shadow';
import Canvas from './Light/Canvas';
import KeyPress from '../Tools/Event/KeyEvent';
import { Coord } from '../Tools/Tool';

import rectVsSource from '../shaders/RectShader/vsSource.glsl';
import rectFsSource from '../shaders/RectShader/fsSource.glsl';
import blurVsSource from '../shaders/BlurShader/vsSource.glsl';
import blurFsSource from '../shaders/BlurShader/fsSource.glsl';

const PLAYER_SPEED = 3;
const CAMERA_SPEED = 1;
const BACK_COLOR = { r: 246, g: 246, b: 246 };
const PLAYER_LIGHT_SCALE = 4;

class Game {
    private gl: WebGL2RenderingContext;
    private player: Player;
    private map: PerlinMap;
    private playerLight: Light;
    private lightCanvas: Canvas;
    private shadowCanvas: Canvas;
    private shadow: Shadow;

    constructor(gl: WebGL2RenderingContext, seed: number, center: Coord) {
        this.gl = gl;
        this.map = new PerlinMap(gl, seed);
        this.player = new Player(gl);
        this.cameraWorldPos = center;
        this.playerLight = new Light(gl);
        this.shadow = new Shadow(gl);
        this.lightCanvas = new Canvas(gl, rectVsSource, rectFsSource);
        this.shadowCanvas = new Canvas(gl, blurVsSource, blurFsSource);
        const emptyPos = this.map.getEmptyPos(center.x, center.y);
        this.playerWorldPos = new Coord(emptyPos.x, emptyPos.y);
    }

    private deltaTime: number = 0;
    private lastTime: number = 0;
    private playerWorldPos: Coord;
    private cameraWorldPos: Coord;
    private cameraOffset: Coord = new Coord(0, 0);

    start = () => {
        this.update(0);
    }

    private update = (now: number) => {
        this.deltaTime = (now - this.lastTime) / 1000;
        this.lastTime = now;
        this.draw();
        requestAnimationFrame(this.update);
    }

    private draw = () => {
        const gl = this.gl;

        this.playerController();
        this.CollisionDetection();
        this.cameraController();
        this.calCameraOffset();

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        this.drawScene();
        this.drawLight();
        this.drawShadow();
        this.drawShadowToScene();
        this.drawLightToScene();
    }

    private drawShadow = () => {
        const gl = this.gl;
        gl.disable(gl.BLEND);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.shadow.fBufferInfo.frameBuffer);
        gl.clearColor(1, 1, 1, 0.05);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.shadow.draw(this.map.vertexWorldPos, new Coord(this.playerWorldPos.x + 0.45, this.playerWorldPos.y + 0.55), this.playerLight.lightRadius * PLAYER_LIGHT_SCALE, this.cameraOffset, this.worldToScreenPixelPos);
    }

    private drawLight = () => {
        const gl = this.gl;
        gl.disable(gl.BLEND);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.playerLight.fBufferInfo.frameBuffer);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.playerLight.draw(this.worldToScreenPos(this.playerWorldPos), PLAYER_LIGHT_SCALE);
    }

    private drawScene = () => {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(BACK_COLOR.r / 255, BACK_COLOR.g / 255, BACK_COLOR.b / 255, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.map.draw(this.cameraWorldPos, this.cameraOffset);
        this.player.draw(this.worldToScreenPos(this.playerWorldPos));
    }

    private drawLightToScene = () => {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.DST_COLOR, 0);
        this.lightCanvas.draw(this.playerLight.fBufferInfo.targetTexture);
    }

    private drawShadowToScene = () => {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        // gl.blendFunc(gl.DST_COLOR, 0);
        this.shadowCanvas.draw(this.shadow.fBufferInfo.targetTexture);
    }

    private playerController = () => {
        const distance = PLAYER_SPEED * this.deltaTime;

        if (KeyPress.get('s')) this.playerWorldPos.y -= distance;
        if (KeyPress.get('w')) this.playerWorldPos.y += distance;
        if (KeyPress.get('a')) this.playerWorldPos.x -= distance;
        if (KeyPress.get('d')) this.playerWorldPos.x += distance;
    }

    private cameraController = () => {
        const cameraCenterPos = this.cameraCornerToCenter(this.cameraWorldPos);
        const cameraToPlayer = this.playerWorldPos.sub(new Coord(cameraCenterPos.x, cameraCenterPos.y));
        this.cameraWorldPos.x += cameraToPlayer.x * this.deltaTime * CAMERA_SPEED;
        this.cameraWorldPos.y += cameraToPlayer.y * this.deltaTime * CAMERA_SPEED;
    }

    private calCameraOffset = () => {
        const startPos = this.cameraWorldPos;
        const FloorX = Math.floor(startPos.x);
        const FloorY = Math.floor(startPos.y);

        const disX = (FloorX - startPos.x) * this.map.size;
        const disY = (FloorY - startPos.y) * this.map.size;

        //最终偏移值
        const offSet = { x: disX !== 0 ? disX : this.cameraOffset.x, y: disY !== 0 ? disY : this.cameraOffset.y };
        this.cameraOffset = new Coord(offSet.x, offSet.y);
    }

    //碰撞检测
    private CollisionDetection = () => {
        let dir = 1;
        if (KeyPress.get('s')) dir = -1;
        for (let x = this.playerWorldPos.x - 1; x <= this.playerWorldPos.x + 1; x++) {
            for (let y = this.playerWorldPos.y - dir; dir === 1 ? y <= this.playerWorldPos.y + dir : y >= this.playerWorldPos.y + dir; y += dir) {
                if (this.map.obstacled(x, y)) {
                    const obstacleRealPos = new Coord(Math.floor(x), Math.floor(y));
                    const intersected = this.intersected(obstacleRealPos, this.playerWorldPos, 1, this.player.getSize());
                    if (intersected) {
                        const intersectRect = this.getInterSectedRect(obstacleRealPos, this.playerWorldPos, 1, this.player.getSize());
                        let offset = { x: 0, y: 0 };
                        const threshold = 0.1;

                        if ((KeyPress.get('d') || KeyPress.get('a')) && (KeyPress.get('w') || KeyPress.get('s'))) {

                            if (KeyPress.get('d') && KeyPress.get('w')) {
                                if (this.playerWorldPos.y + this.player.getSize() - threshold < obstacleRealPos.y) offset.y = intersectRect.c0.y - intersectRect.c1.y;
                                else offset.x = intersectRect.c0.x - intersectRect.c1.x;
                            }
                            if (KeyPress.get('a') && KeyPress.get('w')) {
                                if (this.playerWorldPos.y + this.player.getSize() - threshold < obstacleRealPos.y) offset.y = intersectRect.c0.y - intersectRect.c1.y;
                                else offset.x = intersectRect.c1.x - intersectRect.c0.x;
                            }
                            if (KeyPress.get('d') && KeyPress.get('s')) {
                                if (this.playerWorldPos.y - 1 + threshold > obstacleRealPos.y) offset.y = intersectRect.c1.y - intersectRect.c0.y;
                                else offset.x = intersectRect.c0.x - intersectRect.c1.x;
                            }
                            if (KeyPress.get('a') && KeyPress.get('s')) {
                                if (this.playerWorldPos.y - 1 + threshold > obstacleRealPos.y) offset.y = intersectRect.c1.y - intersectRect.c0.y;
                                else offset.x = intersectRect.c1.x - intersectRect.c0.x;
                            }

                        } else {
                            if (KeyPress.get('d')) offset.x = intersectRect.c0.x - intersectRect.c1.x;
                            if (KeyPress.get('a')) offset.x = intersectRect.c1.x - intersectRect.c0.x;
                            if (KeyPress.get('w')) offset.y = intersectRect.c0.y - intersectRect.c1.y;
                            if (KeyPress.get('s')) offset.y = intersectRect.c1.y - intersectRect.c0.y;

                        }
                        this.playerWorldPos = this.playerWorldPos.add(new Coord(offset.x, offset.y));
                    }
                }
            }
        }
    }

    //判断两个矩形是否相交，a0、a1分别为左下角、右上角坐标
    private intersected = (a0: Coord, b0: Coord, aSize: number, bSize: number) => {

        const a1 = a0.add(aSize);
        const b1 = b0.add(bSize);

        return Math.max(a0.x, b0.x) < Math.min(a1.x, b1.x) && Math.max(a0.y, b0.y) < Math.min(a1.y, b1.y);
    }

    //得到两个矩形的相交矩形
    private getInterSectedRect = (a0: Coord, b0: Coord, aSize: number, bSize: number) => {
        const a1 = a0.add(aSize);
        const b1 = b0.add(bSize);
        const c0 = { x: Math.max(a0.x, b0.x), y: Math.max(a0.y, b0.y) };
        const c1 = { x: Math.min(a1.x, b1.x), y: Math.min(a1.y, b1.y) };

        return { c0, c1 };
    }

    private screenToWorldPos = (screenPos: Coord) => {
        return screenPos.add(this.cameraWorldPos);
    }

    private worldToScreenPos = (worldPos: Coord) => {
        return worldPos.sub(this.cameraWorldPos);
    }

    private worldToScreenPixelPos = (worldPos: Coord) => {
        const screenPos = this.worldToScreenPos(worldPos);
        return screenPos.mult(this.map.size);
    }

    private cameraCornerToCenter = (cornerPos: Coord) => {
        const xCount = this.gl.canvas.width / (this.map.size * 2);
        const yCount = this.gl.canvas.height / (this.map.size * 2);
        const cameraCenterPos = cornerPos.add(new Coord(xCount, yCount));
        return cameraCenterPos;
    }

    private cameraCenterToConrner = (centerPos: Coord) => {
        const xCount = this.gl.canvas.width / (this.map.size * 2);
        const yCount = this.gl.canvas.height / (this.map.size * 2);
        const cameraCornerPos = centerPos.sub(new Coord(xCount, yCount));
        return cameraCornerPos;
    }
}

export default Game;
