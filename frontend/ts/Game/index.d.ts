import { Coord } from '../Tools/Tool';
import { ImgType } from '../Tools/interface';
declare class Game {
    private gl;
    private player;
    private player2;
    private map;
    private playerLight;
    private playerLight2;
    private groundCanvas;
    private hardShadow;
    private softShadow;
    private softShadow2;
    private ws;
    private imgs;
    private camera;
    private lights;
    private itemManager;
    private hint;
    private placeHintRect;
    constructor(gl: WebGL2RenderingContext, seed: number, center: Coord, imgs: Map<ImgType, HTMLImageElement>, ws?: any);
    private deltaTime;
    private lastTime;
    private playerWorldPos;
    private player2WorldPos;
    private playerDirLevel;
    private player2DirLevel;
    private playerAnimaFrame;
    private player2AnimaFrame;
    private count;
    private mapPos;
    private hintPos;
    private placeItem;
    private brightNess;
    private fire;
    private playerLightScale;
    private playerLight2Scale;
    private player2BrightNess;
    start: () => void;
    private update;
    private draw;
    private drawHardShadowTexture;
    private drawSoftShadowTexture;
    private drawSoftShadow;
    private drawLightTexture;
    private drawScene;
    private getPlaceColor;
    private brighten;
    private dim;
    private brightNessController;
    private playerController;
    private cameraController;
    private itemController;
    private enablePlaceState;
    private disablePlaceState;
    private CollisionDetection;
    private intersected;
    private getInterSectedRect;
    private blit;
    private initWs;
    private get3DDefaultUniform;
    private get2DDefaultUniform;
    private get3DDefaultLightUniform;
    private getLight;
    private arrayToColor;
}
export default Game;
