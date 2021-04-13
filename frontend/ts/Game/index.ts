import PerlinMap from './Map/index';
import Player from './Player/index';
import Light from './Light/light';
import HardShadow from './Light/HardShadow';
import SoftShadow from './Light/SoftShadow';
import Canvas from './Light/Canvas';
import GroundCanvas from './Map/GroundCanvas';
import KeyPress from '../Tools/Event/KeyEvent';
import { Coord, CoordUtils } from '../Tools/Tool';

import rectVsSource from '../../shaders/RectShader/vsSource.glsl';
import rectFsSource from '../../shaders/RectShader/fsSource.glsl';

import mapCanvasVsSource from '../../shaders/MapCanvasShader/vsSource.glsl';
import mapCanvasFsSource from '../../shaders/MapCanvasShader/fsSource.glsl';
import Camera from './Camera';
import { UniformLocationObj } from '../Tools/interface';

const PLAYER_SPEED = 3;
const CAMERA_SPEED = 1;
const BACK_COLOR = [244, 249, 249];
const WALL_COLOR = [170, 170, 170];
const PLAYER_LIGHT_RADIUS = 20;
const PLAYER_COLOR = [164, 235, 243];
const MAP_SIZE = 1;
const PLAYER_SIZE = 0.9;
const LIGHT_SIZE = 0.44;
const ANIMA_SPEED = 8;
const MAP_COUNT = { x: 50, y: 30 };

const DEFAULT_UNIFORM_NAME = ['u_resolution', 'u_cameraWorldPos', 'u_mapSize'];

class Game {
    private gl: WebGL2RenderingContext;
    private player: Player;
    private player2: Player;
    private map: PerlinMap;
    private playerLight: Light;
    private playerLight2: Light;
    private lightCanvas: Canvas;
    private groundCanvas: GroundCanvas;
    private mapCanvas: Canvas;
    private hardShadow: HardShadow;
    private softShadow: SoftShadow;
    private softShadow2: SoftShadow;
    private ws: any;
    private imgs: Array<HTMLImageElement>;
    private camera: Camera;

    constructor(gl: WebGL2RenderingContext, seed: number, center: Coord, imgs: Array<HTMLImageElement>, ws?: any) {
        this.gl = gl;
        this.map = new PerlinMap(gl, seed, MAP_SIZE, imgs[2], MAP_COUNT);
        this.player = new Player(gl, PLAYER_SIZE, DEFAULT_UNIFORM_NAME, imgs[0]);
        this.player2 = new Player(gl, PLAYER_SIZE, DEFAULT_UNIFORM_NAME, imgs[0]);
        // this.cameraWorldPos = center;
        this.playerLight = new Light(gl, PLAYER_LIGHT_RADIUS, DEFAULT_UNIFORM_NAME);
        this.playerLight2 = new Light(gl, PLAYER_LIGHT_RADIUS, DEFAULT_UNIFORM_NAME);
        this.hardShadow = new HardShadow(gl, this.map.size, DEFAULT_UNIFORM_NAME);
        this.softShadow = new SoftShadow(gl, this.map.size, DEFAULT_UNIFORM_NAME);
        this.softShadow2 = new SoftShadow(gl, this.map.size, DEFAULT_UNIFORM_NAME);
        this.lightCanvas = new Canvas(gl, MAP_COUNT);
        this.groundCanvas = new GroundCanvas(gl, imgs[1]);
        // this.mapCanvas = new Canvas(gl, mapCanvasVsSource, mapCanvasFsSource);
        const emptyPos = this.map.getEmptyPos(center.x, center.y);
        // this.playerWorldPos = { x: emptyPos.x, y: emptyPos.y };
        this.playerWorldPos = { x: 1686, y: 1516 };
        this.ws = ws;
        this.imgs = imgs;
        this.camera = new Camera();
    }

    private deltaTime: number = 0;
    private lastTime: number = 0;
    private playerWorldPos: Coord = { x: 0, y: 0 };
    private player2WorldPos: Coord;
    // private cameraWorldPos: Coord;
    private playerDirLevel: number = 3;
    private player2DirLevel: number = 3;
    private playerAnimaFrame: number = 0;
    private player2AnimaFrame: number = 0;
    private count: number = 0;
    private mapPos: Coord;

    start = () => {
        if (this.ws)
            this.initWs();
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
        // this.cameraController();

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


        this.camera.position[0] = this.playerWorldPos.x;
        this.camera.position[2] = this.playerWorldPos.y + 10;

        this.map.generateVerticesAndLines(this.mapPos);

        //shadow必须在light前绘制
        // this.drawHardShadowTexture();
        this.drawSoftShadowTexture();
        this.drawLightTexture();

        this.drawScene();

        // this.drawLightToScene();
    }

    private drawHardShadowTexture = () => {
        const gl = this.gl;
        gl.disable(gl.BLEND);

        const { renderFrameBuffer, textureFrameBuffer } = this.hardShadow.fBufferInfo;

        gl.bindFramebuffer(gl.FRAMEBUFFER, textureFrameBuffer);

        //阴影部分alpha为0，其余部分alpha为1
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const centerPos = CoordUtils.add(this.playerWorldPos, PLAYER_SIZE / 2)
        this.hardShadow.drawHardShadow(this.map.lineVertices, centerPos, PLAYER_LIGHT_RADIUS, this.getDefaultUniform(), this.map.fBufferInfo.targetTexture);

        // this.blit(renderFrameBuffer, textureFrameBuffer);
    }


    private drawSoftShadowTexture = () => {
        const gl = this.gl;
        gl.enable(gl.BLEND);
        //1 - 遮挡率 = 亮度
        gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.disable(gl.CULL_FACE);

        //draw player shadow
        {
            this.drawSoftShadow(this.softShadow, this.playerWorldPos);
        }

        //draw player2shadow
        {
            if (this.player2WorldPos)
                this.drawSoftShadow(this.softShadow2, this.player2WorldPos);
        }

        // this.blit(renderFrameBuffer, textureFrameBuffer);
    }

    private drawSoftShadow = (shadow: SoftShadow, playerPos: Coord) => {
        const gl = this.gl;
        const { renderFrameBuffer, textureFrameBuffer } = shadow.fBufferInfo;

        gl.bindFramebuffer(gl.FRAMEBUFFER, textureFrameBuffer);

        gl.disable(gl.DEPTH_TEST);
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const playerCenterPos = CoordUtils.add(playerPos, PLAYER_SIZE / 2)
        //draw with min line
        shadow.drawSoftShadow(this.map.lineVertices, playerCenterPos, LIGHT_SIZE, PLAYER_LIGHT_RADIUS, this.getDefaultUniform());

        //draw with vertices
        // shadow.drawSoftShadow(this.map.simpleVertices, playerCenterPos, LIGHT_SIZE, PLAYER_LIGHT_RADIUS, this.getDefaultUniform(), this.map.fBufferInfo.targetTexture);
    }


    private drawLightTexture = () => {
        const gl = this.gl;

        const { renderFrameBuffer, textureFrameBuffer } = this.playerLight.fBufferInfo;

        gl.bindFramebuffer(gl.FRAMEBUFFER, textureFrameBuffer);

        gl.disable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.disable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ONE);

        //draw player shadow
        const lightCenter = CoordUtils.add(this.playerWorldPos, PLAYER_SIZE / 2);
        //hard shadow
        // this.playerLight.draw(lightCenter, this.hardShadow.fBufferInfo.targetTexture, this.getDefaultUniform());
        //soft shadow
        this.playerLight.draw(lightCenter, this.softShadow.fBufferInfo.targetTexture, this.getDefaultUniform());


        //draw player2 shadow
        if (this.player2WorldPos) {
            const light2Center = CoordUtils.add(this.player2WorldPos, PLAYER_SIZE / 2);
            this.playerLight2.draw(light2Center, this.softShadow2.fBufferInfo.targetTexture, this.getDefaultUniform());
        }

        // this.blit(renderFrameBuffer, textureFrameBuffer);
    }


    private drawScene = () => {
        const gl = this.gl;

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);


        gl.enable(gl.CULL_FACE);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        // this.mapCanvas.draw(this.map.fBufferInfo.targetTexture, BACK_COLOR, WALL_COLOR);

        const lefDownPos = { x: this.mapPos.x / this.map.mapCount.x, y: this.mapPos.y / this.map.mapCount.y };
        this.groundCanvas.draw(this.mapPos, lefDownPos, MAP_COUNT, this.getDefaultUniform(), this.playerLight.fBufferInfo.targetTexture);
        this.map.draw(this.getDefaultUniform());

        this.player.draw(this.playerWorldPos, this.getDefaultUniform(), this.playerDirLevel, this.playerAnimaFrame);
        // if (this.player2WorldPos) this.player2.draw(this.player2WorldPos, this.getDefaultUniform(), this.player2DirLevel, this.player2AnimaFrame);
    }

    private drawLightToScene = () => {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.DST_COLOR, 0);
        this.lightCanvas.draw(this.mapPos, this.getDefaultUniform(), this.playerLight.fBufferInfo.targetTexture);
    }

    private playerController = () => {
        const distance = PLAYER_SPEED * this.deltaTime;

        if (KeyPress.get('S')) {
            this.playerWorldPos.y += distance;
            this.playerDirLevel = 3;
        }
        if (KeyPress.get('A')) {
            this.playerWorldPos.x -= distance;
            this.playerDirLevel = 0;
        }
        if (KeyPress.get('D')) {
            this.playerWorldPos.x += distance;
            this.playerDirLevel = 2;
        }
        if (KeyPress.get('W')) {
            this.playerWorldPos.y -= distance;
            this.playerDirLevel = 1;
        }

        this.count += ANIMA_SPEED * this.deltaTime;
        this.playerAnimaFrame = Math.floor(this.count % 4);
        if (!KeyPress.get('S') && !KeyPress.get('A') && !KeyPress.get('D') && !KeyPress.get('W')) {
            this.playerAnimaFrame = 0;
        }
        this.mapPos = CoordUtils.sub(this.playerWorldPos, { x: MAP_COUNT.x / 2, y: (MAP_COUNT.y * 2) / 3 });
    }

    // private cameraController = () => {
    //     const cameraCenterPos = this.cameraCornerToCenter(this.cameraWorldPos);
    //     const cameraToPlayer = CoordUtils.sub(this.playerWorldPos, cameraCenterPos);
    //     this.cameraWorldPos.x += cameraToPlayer.x * this.deltaTime * CAMERA_SPEED;
    //     this.cameraWorldPos.y += cameraToPlayer.y * this.deltaTime * CAMERA_SPEED;
    // }

    //碰撞检测
    private CollisionDetection = () => {
        let dir = 1;
        if (KeyPress.get('S')) dir = -1;
        for (let x = this.playerWorldPos.x - 1; x <= this.playerWorldPos.x + 1; x++) {
            for (let y = this.playerWorldPos.y - dir; dir === 1 ? y <= this.playerWorldPos.y + dir : y >= this.playerWorldPos.y + dir; y += dir) {
                if (this.map.obstacled(x, y)) {
                    const obstacleRealPos = { x: Math.floor(x), y: Math.floor(y) };
                    const intersected = this.intersected(obstacleRealPos, this.playerWorldPos, 1, PLAYER_SIZE);
                    if (intersected) {
                        const intersectRect = this.getInterSectedRect(obstacleRealPos, this.playerWorldPos, 1, PLAYER_SIZE);
                        let offset = { x: 0, y: 0 };
                        const threshold = 0.1;

                        if ((KeyPress.get('D') || KeyPress.get('A')) && (KeyPress.get('S') || KeyPress.get('W'))) {

                            if (KeyPress.get('D') && KeyPress.get('S')) {
                                if (this.playerWorldPos.y + PLAYER_SIZE - threshold < obstacleRealPos.y) offset.y = intersectRect.c0.y - intersectRect.c1.y;
                                else offset.x = intersectRect.c0.x - intersectRect.c1.x;
                            }
                            if (KeyPress.get('A') && KeyPress.get('S')) {
                                if (this.playerWorldPos.y + PLAYER_SIZE - threshold < obstacleRealPos.y) offset.y = intersectRect.c0.y - intersectRect.c1.y;
                                else offset.x = intersectRect.c1.x - intersectRect.c0.x;
                            }
                            if (KeyPress.get('D') && KeyPress.get('W')) {
                                if (this.playerWorldPos.y - 1 + threshold > obstacleRealPos.y) offset.y = intersectRect.c1.y - intersectRect.c0.y;
                                else offset.x = intersectRect.c0.x - intersectRect.c1.x;
                            }
                            if (KeyPress.get('A') && KeyPress.get('W')) {
                                if (this.playerWorldPos.y - 1 + threshold > obstacleRealPos.y) offset.y = intersectRect.c1.y - intersectRect.c0.y;
                                else offset.x = intersectRect.c1.x - intersectRect.c0.x;
                            }

                        } else {
                            if (KeyPress.get('D')) offset.x = intersectRect.c0.x - intersectRect.c1.x;
                            if (KeyPress.get('A')) offset.x = intersectRect.c1.x - intersectRect.c0.x;
                            if (KeyPress.get('S')) offset.y = intersectRect.c0.y - intersectRect.c1.y;
                            if (KeyPress.get('W')) offset.y = intersectRect.c1.y - intersectRect.c0.y;

                        }
                        this.playerWorldPos = CoordUtils.add(this.playerWorldPos, offset);
                    }
                }
            }
        }

        if (this.ws && this.ws.readyState === 1)
            this.ws.send(JSON.stringify({ type: 'player', pos: this.playerWorldPos, dir: this.playerDirLevel, frame: this.playerAnimaFrame }));
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

    // private worldToScreenPos = (worldPos: Coord) => {
    //     return CoordUtils.sub(worldPos, this.cameraWorldPos);
    // }

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

    private initWs = () => {
        this.ws.onmessage = (mes: any) => {
            const data = JSON.parse(mes.data);

            switch (data.type) {
                case 'player':
                    this.player2WorldPos = data.pos;
                    this.player2DirLevel = data.dir;
                    this.player2AnimaFrame = data.frame;
                    // console.log(this.player2WorldPos);
                    break;
            }
        }
    }

    private getDefaultUniform = (): Array<UniformLocationObj> => ([
        { name: 'u_resolution', data: [MAP_COUNT.x, MAP_COUNT.y], type: 'vec2' },
        { name: 'u_cameraWorldPos', data: [this.mapPos.x, this.mapPos.y], type: 'vec2' },
        { name: 'u_mapSize', data: [MAP_SIZE], type: 'number' },
        { name: 'u_projectionMatrix', data: this.camera.getProjectionMatrix(this.gl), type: 'matrix' },
        { name: 'u_viewMatrix', data: this.camera.getViewMatrix(), type: 'matrix' }
    ])

    private arrayToColor = (array: Array<number>) => (array.map(a => a / 255));
}

export default Game;
