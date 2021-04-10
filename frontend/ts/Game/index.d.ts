import { Coord } from '../Tools/Tool';
declare class Game {
    private gl;
    private player;
    private player2;
    private map;
    private playerLight;
    private playerLight2;
    private lightCanvas;
    private mapCanvas;
    private hardShadow;
    private softShadow;
    private softShadow2;
    private ws;
    constructor(gl: WebGL2RenderingContext, seed: number, center: Coord, ws: any);
    private deltaTime;
    private lastTime;
    private playerWorldPos;
    private player2WorldPos;
    private cameraWorldPos;
    start: () => void;
    private update;
    private draw;
    private drawHardShadowTexture;
    private drawSoftShadowTexture;
    private drawSoftShadow;
    private drawLightTexture;
    /**
     * 绘制map贴图，r=0为障碍物，r=1为背景
     */
    private drawMapTexture;
    private drawScene;
    private drawLightToScene;
    private playerController;
    private cameraController;
    private CollisionDetection;
    private intersected;
    private getInterSectedRect;
    private worldToScreenPos;
    private cameraCornerToCenter;
    private cameraCenterToConrner;
    private blit;
    private initWs;
    private getDefaultUniform;
    private arrayToColor;
}
export default Game;
