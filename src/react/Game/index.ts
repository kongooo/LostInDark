import PerlinMap from './Map/index';
import Player from './Player/index';
import KeyPress from '../Tools/Event/KeyEvent';

const PLAYER_SPEED = 150;
const CAMERA_SPEED = 3;
const BACK_COLOR = { r: 246, g: 246, b: 246 };

interface Coord {
    x: number;
    y: number;
}

class Game {
    private gl: WebGL2RenderingContext;
    private player: Player;
    private map: PerlinMap;
    private CameraInitPos: Coord;

    constructor(gl: WebGL2RenderingContext, seed: number, center: Coord) {
        this.gl = gl;
        const map = new PerlinMap(gl, seed);
        const player = new Player(gl);
        this.map = map;
        this.player = player;
        this.CameraInitPos = center;
        this.playerScreenPos = map.getEmptyPos(center.x, center.y);
        this.xThreshold = this.gl.canvas.width / 3;
        this.yThreshold = this.gl.canvas.height / 3;
    }

    private deltaTime: number = 0;
    private lastTime: number = 0;
    private playerScreenPos: Coord = { x: 0, y: 0 };
    private mapDir: Coord = { x: 0, y: 0 };
    private xThreshold: number;
    private yThreshold: number;

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
        // this.move();
        this.cameraController();
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(BACK_COLOR.r / 255, BACK_COLOR.g / 255, BACK_COLOR.b / 255, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.map.draw(this.CameraInitPos.x + this.mapDir.x, this.CameraInitPos.y + this.mapDir.y);
        this.player.draw(this.playerScreenPos.x, this.playerScreenPos.y);
    }

    private cameraController = () => {
        const distance = PLAYER_SPEED * this.deltaTime;
        // const cameraWordPos = CoordAdd(this.CameraInitPos, this.mapDir);
        // const playerWordPos = CoordAdd(cameraWordPos, this.playerScreenPos);

        if (this.playerScreenPos.y < this.yThreshold && KeyPress.get('s')) {
            this.mapDir.y -= CAMERA_SPEED * this.deltaTime;
        } else if (KeyPress.get('s')) this.playerScreenPos.y -= distance;

        if (this.playerScreenPos.y > this.yThreshold * 2 && KeyPress.get('w')) {
            this.mapDir.y += CAMERA_SPEED * this.deltaTime;
        } else if (KeyPress.get('w')) this.playerScreenPos.y += distance;

        if (this.playerScreenPos.x < this.xThreshold && KeyPress.get('a')) {
            this.mapDir.x -= CAMERA_SPEED * this.deltaTime;
        } else if (KeyPress.get('a')) this.playerScreenPos.x -= distance;

        if (this.playerScreenPos.x > this.xThreshold * 2 && KeyPress.get('d')) {
            this.mapDir.x += CAMERA_SPEED * this.deltaTime;
        } else if (KeyPress.get('d')) this.playerScreenPos.x += distance;
    }
}

const CoordAdd = (aPos: Coord, bPos: Coord) => {
    return { x: aPos.x + bPos.x, y: aPos.y + bPos.y };
}

const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
};

export default Game;
