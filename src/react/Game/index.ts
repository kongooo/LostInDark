import PerlinMap from './Map/index';
import Player from './Player/index';
import Light from './Light/index';
import Canvas from './Light/Canvas';
import KeyPress from '../Tools/Event/KeyEvent';

const PLAYER_SPEED = 3;
const CAMERA_SPEED = 1;
const BACK_COLOR = { r: 246, g: 246, b: 246 };

interface Coord {
    x: number;
    y: number;
}

class Game {
    private gl: WebGL2RenderingContext;
    private player: Player;
    private map: PerlinMap;
    private playerLight: Light;
    private lightCanvas: Canvas;

    constructor(gl: WebGL2RenderingContext, seed: number, center: Coord) {
        this.gl = gl;
        this.map = new PerlinMap(gl, seed);
        this.player = new Player(gl);
        this.cameraWorldPos = center;
        this.playerLight = new Light(gl);
        this.lightCanvas = new Canvas(gl);
        this.playerWorldPos = this.map.getEmptyPos(center.x, center.y);
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

        this.drawLight();
        this.drawScene();
        this.drawLightToScene();
    }

    private drawLight = () => {
        const gl = this.gl;
        gl.disable(gl.BLEND);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.playerLight.fBufferInfo.frameBuffer);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.playerLight.draw(this.worldToScreenPos(this.playerWorldPos), 3);
    }

    private drawScene = () => {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.clearColor(BACK_COLOR.r / 255, BACK_COLOR.g / 255, BACK_COLOR.b / 255, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.map.draw(this.cameraWorldPos);
        this.player.draw(this.worldToScreenPos(this.playerWorldPos));
    }

    private drawLightToScene = () => {
        const gl = this.gl;
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
        const cameraToPlayer = CoordSub(this.playerWorldPos, cameraCenterPos);
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

                        this.playerWorldPos = CoordAdd(this.playerWorldPos, offset);
                    }
                }
            }
        }
    }

    //判断两个矩形是否相交，a0、a1分别为左下角、右上角坐标
    private intersected = (a0: Coord, b0: Coord, aSize: number, bSize: number) => {

        const a1 = CoordAdd(a0, { x: aSize, y: aSize });
        const b1 = CoordAdd(b0, { x: bSize, y: bSize });

        return Math.max(a0.x, b0.x) < Math.min(a1.x, b1.x) && Math.max(a0.y, b0.y) < Math.min(a1.y, b1.y);
    }

    //得到两个矩形的相交矩形
    private getInterSectedRect = (a0: Coord, b0: Coord, aSize: number, bSize: number) => {
        const a1 = CoordAdd(a0, { x: aSize, y: aSize });
        const b1 = CoordAdd(b0, { x: bSize, y: bSize });
        const c0 = { x: Math.max(a0.x, b0.x), y: Math.max(a0.y, b0.y) };
        const c1 = { x: Math.min(a1.x, b1.x), y: Math.min(a1.y, b1.y) };

        return { c0, c1 };
    }

    private screenToWorldPos = (screenPos: Coord) => {
        return CoordAdd(screenPos, this.cameraWorldPos);
    }

    private worldToScreenPos = (worldPos: Coord) => {
        return CoordSub(worldPos, this.cameraWorldPos);
    }

    private cameraCornerToCenter = (cornerPos: Coord) => {
        const xCount = this.gl.canvas.width / (this.map.size * 2);
        const yCount = this.gl.canvas.height / (this.map.size * 2);
        const cameraCenterPos = CoordAdd(cornerPos, { x: xCount, y: yCount });
        return cameraCenterPos;
    }

    private cameraCenterToConrner = (centerPos: Coord) => {
        const xCount = this.gl.canvas.width / (this.map.size * 2);
        const yCount = this.gl.canvas.height / (this.map.size * 2);
        const cameraCornerPos = CoordSub(centerPos, { x: xCount, y: yCount });
        return cameraCornerPos;
    }
}

const CoordAdd = (aPos: Coord, bPos: Coord) => {
    return { x: aPos.x + bPos.x, y: aPos.y + bPos.y };
}

const CoordSub = (aPos: Coord, bPos: Coord) => {
    return { x: aPos.x - bPos.x, y: aPos.y - bPos.y };
}

const CoordDivison = (pos: Coord, num: number | Coord) => {
    return { x: Math.floor(pos.x / (typeof num === 'number' ? num : num.x)), y: Math.floor(pos.y / (typeof num === 'number' ? num : num.y)) }
}

const CoordMult = (pos: Coord, num: number | Coord) => {
    return { x: Math.floor(pos.x * (typeof num === 'number' ? num : num.x)), y: Math.floor(pos.y * (typeof num === 'number' ? num : num.y)) }
}

const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
};

const clamp = (num: number, min: number, max: number) => Math.min(Math.max(num, min), max);

const lerp = (a: number, b: number, t: number) => a + t * (b - a);

const getDir = (a: number) => a === 0 ? 0 : (a < 0 ? -1 : 1);

export default Game;
