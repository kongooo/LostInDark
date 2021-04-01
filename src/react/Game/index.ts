import PerlinMap from './Map/index';
import Player from './Player/index';
import Light from './Light/light';
import Shadow from './Light/shadow';
import Canvas from './Light/Canvas';
import KeyPress from '../Tools/Event/KeyEvent';
import { Coord, CoordUtils } from '../Tools/Tool';

import rectVsSource from '../shaders/RectShader/vsSource.glsl';
import rectFsSource from '../shaders/RectShader/fsSource.glsl';

import mapCanvasVsSource from '../shaders/MapCanvasShader/vsSource.glsl';
import mapCanvasFsSource from '../shaders/MapCanvasShader/fsSource.glsl';

const PLAYER_SPEED = 3;
const CAMERA_SPEED = 1;
const BACK_COLOR = [211, 224, 234];
const WALL_COLOR = [39, 102, 120];
const PLAYER_LIGHT_RADIUS = 15;
const PLAYER_COLOR = [22, 135, 167];
const MAP_SIZE = 50;
const PLAYER_SIZE = 0.9;

class Game {
    private gl: WebGL2RenderingContext;
    private player: Player;
    private map: PerlinMap;
    private playerLight: Light;
    private lightCanvas: Canvas;
    private mapCanvas: Canvas;
    private shadow: Shadow;

    constructor(gl: WebGL2RenderingContext, seed: number, center: Coord) {
        this.gl = gl;
        this.map = new PerlinMap(gl, seed, MAP_SIZE);
        this.player = new Player(gl, PLAYER_SIZE);
        this.cameraWorldPos = center;
        this.playerLight = new Light(gl);
        this.shadow = new Shadow(gl, this.map.size);
        this.lightCanvas = new Canvas(gl, rectVsSource, rectFsSource);
        this.mapCanvas = new Canvas(gl, mapCanvasVsSource, mapCanvasFsSource);
        const emptyPos = this.map.getEmptyPos(center.x, center.y);
        this.playerWorldPos = { x: emptyPos.x, y: emptyPos.y };
    }

    private deltaTime: number = 0;
    private lastTime: number = 0;
    private playerWorldPos: Coord;
    private cameraWorldPos: Coord;

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

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        this.drawMapTexture();
        //shadow必须在light前绘制
        this.drawShadowTexture();
        this.drawLightTexture();

        this.drawScene();

        this.drawLightToScene();
    }

    private drawShadowTexture = () => {
        const gl = this.gl;
        gl.disable(gl.BLEND);

        const { renderFrameBuffer, textureFrameBuffer } = this.shadow.fBufferInfo;

        gl.bindFramebuffer(gl.FRAMEBUFFER, textureFrameBuffer);

        //阴影部分r为0，其余部分r为1
        gl.clearColor(1, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const centerPos = CoordUtils.add(this.playerWorldPos, PLAYER_SIZE / 2)
        this.shadow.draw(this.map.vertics, centerPos, PLAYER_LIGHT_RADIUS, this.cameraWorldPos, this.map.fBufferInfo.targetTexture);

        // this.blit(renderFrameBuffer, textureFrameBuffer);
    }

    private drawLightTexture = () => {
        const gl = this.gl;
        gl.disable(gl.BLEND);

        const { renderFrameBuffer, textureFrameBuffer } = this.playerLight.fBufferInfo;

        gl.bindFramebuffer(gl.FRAMEBUFFER, textureFrameBuffer);

        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.playerLight.draw(CoordUtils.add(this.playerWorldPos, PLAYER_SIZE / 2), PLAYER_LIGHT_RADIUS, this.cameraWorldPos, this.map.size, this.shadow.fBufferInfo.targetTexture);

        // this.blit(renderFrameBuffer, textureFrameBuffer);
    }

    /**
     * 绘制map贴图，r=0为障碍物，r=1为背景
     */
    private drawMapTexture = () => {
        const gl = this.gl;
        gl.disable(gl.BLEND);

        const { renderFrameBuffer, textureFrameBuffer } = this.map.fBufferInfo;

        gl.bindFramebuffer(gl.FRAMEBUFFER, textureFrameBuffer);

        gl.clearColor(1, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.map.draw(this.cameraWorldPos);

        // this.blit(renderFrameBuffer, textureFrameBuffer);
    }

    private drawScene = () => {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.disable(gl.BLEND);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        this.mapCanvas.draw(this.map.fBufferInfo.targetTexture, BACK_COLOR, WALL_COLOR);
        this.player.draw(this.playerWorldPos, this.cameraWorldPos, MAP_SIZE);
    }

    private drawLightToScene = () => {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.DST_COLOR, 0);
        this.lightCanvas.draw(this.playerLight.fBufferInfo.targetTexture);
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
        const cameraToPlayer = CoordUtils.sub(this.playerWorldPos, cameraCenterPos);
        this.cameraWorldPos.x += cameraToPlayer.x * this.deltaTime * CAMERA_SPEED;
        this.cameraWorldPos.y += cameraToPlayer.y * this.deltaTime * CAMERA_SPEED;
    }

    //碰撞检测
    private CollisionDetection = () => {
        let dir = 1;
        if (KeyPress.get('s')) dir = -1;
        for (let x = this.playerWorldPos.x - 1; x <= this.playerWorldPos.x + 1; x++) {
            for (let y = this.playerWorldPos.y - dir; dir === 1 ? y <= this.playerWorldPos.y + dir : y >= this.playerWorldPos.y + dir; y += dir) {
                if (this.map.obstacled(x, y)) {
                    const obstacleRealPos = { x: Math.floor(x), y: Math.floor(y) };
                    const intersected = this.intersected(obstacleRealPos, this.playerWorldPos, 1, PLAYER_SIZE);
                    if (intersected) {
                        const intersectRect = this.getInterSectedRect(obstacleRealPos, this.playerWorldPos, 1, PLAYER_SIZE);
                        let offset = { x: 0, y: 0 };
                        const threshold = 0.1;

                        if ((KeyPress.get('d') || KeyPress.get('a')) && (KeyPress.get('w') || KeyPress.get('s'))) {

                            if (KeyPress.get('d') && KeyPress.get('w')) {
                                if (this.playerWorldPos.y + PLAYER_SIZE - threshold < obstacleRealPos.y) offset.y = intersectRect.c0.y - intersectRect.c1.y;
                                else offset.x = intersectRect.c0.x - intersectRect.c1.x;
                            }
                            if (KeyPress.get('a') && KeyPress.get('w')) {
                                if (this.playerWorldPos.y + PLAYER_SIZE - threshold < obstacleRealPos.y) offset.y = intersectRect.c0.y - intersectRect.c1.y;
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
                        this.playerWorldPos = CoordUtils.add(this.playerWorldPos, offset);
                    }
                }
            }
        }
    }

    //判断两个矩形是否相交，a0、a1分别为左下角、右上角坐标
    private intersected = (a0: Coord, b0: Coord, aSize: number, bSize: number) => {

        const a1 = CoordUtils.add(a0, aSize);
        const b1 = CoordUtils.add(b0, bSize);

        return Math.max(a0.x, b0.x) < Math.min(a1.x, b1.x) && Math.max(a0.y, b0.y) < Math.min(a1.y, b1.y);
    }

    //得到两个矩形的相交矩形
    private getInterSectedRect = (a0: Coord, b0: Coord, aSize: number, bSize: number) => {
        const a1 = CoordUtils.add(a0, aSize);
        const b1 = CoordUtils.add(b0, bSize);
        const c0 = { x: Math.max(a0.x, b0.x), y: Math.max(a0.y, b0.y) };
        const c1 = { x: Math.min(a1.x, b1.x), y: Math.min(a1.y, b1.y) };

        return { c0, c1 };
    }

    private worldToScreenPos = (worldPos: Coord) => {
        return CoordUtils.sub(worldPos, this.cameraWorldPos);
    }

    private cameraCornerToCenter = (cornerPos: Coord) => {
        const xCount = this.gl.canvas.width / (this.map.size * 2);
        const yCount = this.gl.canvas.height / (this.map.size * 2);
        const cameraCenterPos = CoordUtils.add(cornerPos, { x: xCount, y: yCount });
        return cameraCenterPos;
    }

    private cameraCenterToConrner = (centerPos: Coord) => {
        const xCount = this.gl.canvas.width / (this.map.size * 2);
        const yCount = this.gl.canvas.height / (this.map.size * 2);
        const cameraCornerPos = CoordUtils.sub(centerPos, { x: xCount, y: yCount });
        return cameraCornerPos;
    }

    private blit = (renderFrameBuffer: WebGLFramebuffer, textureFrameBuffer: WebGLFramebuffer) => {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, renderFrameBuffer);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, textureFrameBuffer);

        gl.clearBufferfv(gl.COLOR, 0, [0.0, 0.0, 0.0, 1.0]);
        gl.blitFramebuffer(
            0, 0, gl.canvas.width, gl.canvas.height,
            0, 0, gl.canvas.width, gl.canvas.height,
            gl.COLOR_BUFFER_BIT, gl.NEAREST
        )

        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    }
}

export default Game;
