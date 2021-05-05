import PerlinMap from './Map/index';
import Player from './Player/index';
import Light from './Light/light';
import HardShadow from './Light/HardShadow';
import SoftShadow from './Light/SoftShadow';
import Canvas from './Light/Canvas';
import GroundCanvas from './Map/GroundCanvas';
import KeyPress from '../Tools/Event/KeyEvent';
import { Coord, CoordUtils } from '../Tools/Tool';

import Camera from './Camera';
import { ImgType, ItemType, LightInfo, UniformLocationObj, ItemActionInfo } from '../Tools/interface';

import ItemManager from './Item/ItemManager';
import Hint from './UI/Hint';
import EventBus from '../Tools/Event/EventBus';
import PlaceHintRect from './Item/PlaceItem';
import { Arrow } from './Item/Arrow';
import NativePlayer from './Player/NativePlayer';

const PLAYER_SPEED = 3;
const DEFAULT_LIGHT_RADIUS = 10;
const PLAYER_SIZE = 0.9;
const PLAYER_DRAW_SIZE = { x: 0.9, y: 1.7 };
const LIGHT_SIZE = 0.44;
const ANIMA_SPEED = 6;
const CAMERA_OFFSET_Y = 8;
const LIGHT_COLOR = [255, 255, 255];
const banPlace = [224, 36, 51];
const canPlace = [27, 208, 66];
const putOutTime = 60000;
const FIRE_RADIUS = 20;
const FIRE_LIGHT_SCALE = 1;
const RECEIVE_TIME = 300000;

class Game {
    private gl: WebGL2RenderingContext;
    private player: NativePlayer;
    private player2: Player;
    private map: PerlinMap;
    private playerLight: Light;
    private playerLight2: Light;
    private groundCanvas: GroundCanvas;
    private hardShadow: HardShadow;
    private softShadow: SoftShadow;
    private softShadow2: SoftShadow;
    private ws: any;
    private imgs: Map<ImgType, HTMLImageElement>;
    private camera: Camera;
    private playerLights: Array<LightInfo> = [];
    private lights: Array<LightInfo> = [];
    private itemManager: ItemManager;
    private hint: Hint;
    private placeHintRect: PlaceHintRect;
    private arrow: Arrow;

    constructor(gl: WebGL2RenderingContext, seed: number, center: Coord, imgs: Map<ImgType, HTMLImageElement>, mapCount: Coord, mikasa: boolean, ws?: any) {
        this.gl = gl;
        this.map = new PerlinMap(gl, seed, imgs.get(ImgType.obstable), mapCount);
        this.player = new NativePlayer(gl, PLAYER_DRAW_SIZE, mikasa ? imgs.get(ImgType.mikasa) : imgs.get(ImgType.alen));
        this.player2 = new Player(gl, PLAYER_DRAW_SIZE, mikasa ? imgs.get(ImgType.alen) : imgs.get(ImgType.mikasa));
        // this.cameraWorldPos = center;
        this.playerLight = new Light(gl, DEFAULT_LIGHT_RADIUS, LIGHT_COLOR);
        this.playerLight2 = new Light(gl, DEFAULT_LIGHT_RADIUS, LIGHT_COLOR);
        // this.hardShadow = new HardShadow(gl, this.map.size);
        this.softShadow = new SoftShadow(gl);
        this.softShadow2 = new SoftShadow(gl);
        this.groundCanvas = new GroundCanvas(gl, imgs.get(ImgType.ground));
        // this.mapCanvas = new Canvas(gl, mapCanvasVsSource, mapCanvasFsSource);
        const emptyPos = this.map.getEmptyPos(center.x, center.y);
        this.playerWorldPos = { x: emptyPos.x, y: emptyPos.y };
        this.imgs = imgs;
        this.camera = new Camera();
        this.itemManager = ItemManager.getInstance(gl, this.map, imgs);
        this.hint = new Hint(gl, imgs.get(ImgType.hint));
        this.placeHintRect = new PlaceHintRect(gl);
        this.arrow = new Arrow(gl, imgs.get(ImgType.arrow));
        this.setWs(ws);
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
    private hintPos: Coord;
    private placeItem: ItemType;
    private brightNess: number = 0.7;
    private fire: boolean = false;
    private playerLightScale: number = 1;
    private playerLight2Scale: number;
    private player2BrightNess: number;
    private fireFrame: number = 0;
    private firelights2D: Array<Light> = [];
    private fireShadowsTexture: Array<WebGLTexture> = [];
    private chuncksIndex: Array<string> = [];
    private itemsQueue: Array<ItemActionInfo> = [];
    private transmitsPos: Array<Coord> = [];
    private receive: boolean = false;
    private death = false;
    private success = false;
    private receiveDeath = false;
    private receiveLost = false;

    start = () => {
        this.update(0);
        this.showHintWords();
        EventBus.addEventListener('placeItemToScene', this.enablePlaceState);
    }

    setWs = (ws: any) => {
        this.ws = ws;
        this.initWs();
    }

    private showHintWords = () => {
        const timer0 = setTimeout(() => {
            EventBus.dispatch('showHint', 'W A S D 移动~');
            clearTimeout(timer0);
            const timer1 = setTimeout(() => {
                EventBus.dispatch('showHint', 'X拾取道具~');
                clearTimeout(timer1);
                const timer2 = setTimeout(() => {
                    EventBus.dispatch('showHint', '注意左上角！长时间不吃东西会被饿死哦~');
                    clearTimeout(timer2);
                    const timer3 = setTimeout(() => {
                        EventBus.dispatch('showHint', '背包栏最右侧是可合成物品哦，点一下试试吧~');
                        clearTimeout(timer3);

                    }, 3000);
                }, 3000);
            }, 3000);
        }, 1000);
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
        this.animaController();
        this.CollisionDetection();
        this.cameraController();
        this.itemController();
        this.brightNessController();

        this.map.generateVerticesAndLines(this.mapPos);

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        //shadow必须在light前绘制
        // this.drawHardShadowTexture();
        this.drawSoftShadowTexture();
        this.drawLightTexture();

        this.drawScene();
    }

    // private drawHardShadowTexture = () => {
    //     const gl = this.gl;
    //     gl.disable(gl.BLEND);

    //     const { renderFrameBuffer, textureFrameBuffer } = this.hardShadow.fBufferInfo;

    //     gl.bindFramebuffer(gl.FRAMEBUFFER, textureFrameBuffer);

    //     //阴影部分alpha为0，其余部分alpha为1
    //     gl.clearColor(0, 0, 0, 1);
    //     gl.clear(gl.COLOR_BUFFER_BIT);

    //     const centerPos = CoordUtils.add(this.playerWorldPos, PLAYER_SIZE / 2)
    //     this.hardShadow.drawHardShadow(this.map.lineVertices, centerPos, DEFAULT_LIGHT_RADIUS, this.get2DDefaultUniform(), this.map.fBufferInfo.targetTexture);

    //     // this.blit(renderFrameBuffer, textureFrameBuffer);
    // }


    private drawSoftShadowTexture = () => {
        const gl = this.gl;
        gl.enable(gl.BLEND);
        //1 - 遮挡率 = 亮度
        gl.blendEquation(gl.FUNC_REVERSE_SUBTRACT);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.disable(gl.CULL_FACE);

        //draw player shadow
        {
            this.drawSoftShadow(this.softShadow, CoordUtils.add(this.playerWorldPos, PLAYER_SIZE / 2), DEFAULT_LIGHT_RADIUS * this.playerLightScale);
        }

        //draw player2shadow
        {
            if (this.player2WorldPos)
                this.drawSoftShadow(this.softShadow2, CoordUtils.add(this.player2WorldPos, PLAYER_SIZE / 2), DEFAULT_LIGHT_RADIUS * this.playerLight2Scale);
        }

        // this.blit(renderFrameBuffer, textureFrameBuffer);
    }

    private drawSoftShadow = (shadow: SoftShadow, pos: Coord, radius: number) => {
        const gl = this.gl;
        const { textureFrameBuffer } = shadow.fBufferInfo;

        gl.bindFramebuffer(gl.FRAMEBUFFER, textureFrameBuffer);

        gl.disable(gl.DEPTH_TEST);
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        //draw with min line
        shadow.drawSoftShadow(this.map.lineVertices, pos, LIGHT_SIZE, radius, this.get2DDefaultUniform());

        //draw with vertices
        // shadow.drawSoftShadow(this.map.simpleVertices, playerCenterPos, LIGHT_SIZE, DEFAULT_LIGHT_RADIUS, this.getDefaultUniform(), this.map.fBufferInfo.targetTexture);
    }

    private drawFireLightsTexture = () => {
        this.lights.forEach((light, index) => {
            this.firelights2D[index].draw({ x: light.position[0], y: light.position[2] }, this.fireShadowsTexture[index], 1, FIRE_LIGHT_SCALE, this.get2DDefaultUniform(), 1);
        })
    }

    private drawLightTexture = () => {
        const gl = this.gl;

        const { renderFrameBuffer, textureFrameBuffer } = this.playerLight.fBufferInfo;

        gl.bindFramebuffer(gl.FRAMEBUFFER, textureFrameBuffer);

        gl.disable(gl.DEPTH_TEST);
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ONE);

        //draw player shadow
        const lightCenter = CoordUtils.add(this.playerWorldPos, PLAYER_SIZE / 2);
        //hard shadow
        // this.playerLight.draw(lightCenter, this.hardShadow.fBufferInfo.targetTexture, this.getDefaultUniform());
        //soft shadow
        this.playerLight.draw(lightCenter, this.softShadow.fBufferInfo.targetTexture, this.brightNess, this.playerLightScale, this.get2DDefaultUniform(), 0);


        //draw player2 shadow
        if (this.player2WorldPos) {
            const light2Center = CoordUtils.add(this.player2WorldPos, PLAYER_SIZE / 2);
            this.playerLight2.draw(light2Center, this.softShadow2.fBufferInfo.targetTexture, this.player2BrightNess, this.playerLight2Scale, this.get2DDefaultUniform(), 0);
        }

        this.drawFireLightsTexture();

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


        const lefDownPos = { x: this.mapPos.x / this.map.mapCount.x, y: this.mapPos.y / this.map.mapCount.y };
        this.groundCanvas.draw(this.mapPos, lefDownPos, this.map.mapCount, this.get3DDefaultUniform(), this.playerLight.fBufferInfo.targetTexture);
        this.map.draw(this.get3DDefaultLightUniform());

        if (this.placeItem !== undefined) {
            this.placeHintRect.draw(CoordUtils.floor(this.playerWorldPos), this.getPlaceColor(), this.get3DDefaultUniform());
        }

        this.itemManager.drawItems(this.chuncksIndex, this.get3DDefaultLightUniform(), this.lights, this.fireFrame, this.fireShadowsTexture, this.firelights2D);

        if (this.receive) {
            const angle = this.calPlayerToTransmitDir();
            if (angle) {
                // console.log(angle);
                this.arrow.draw(this.playerWorldPos, this.get3DDefaultUniform(), angle);
            }
        }
        this.player.draw(this.playerWorldPos, this.get3DDefaultUniform(), this.playerDirLevel, this.playerAnimaFrame);

        if (this.player2WorldPos) this.player2.draw(this.player2WorldPos, this.get3DDefaultUniform(), this.player2DirLevel, this.player2AnimaFrame);
        if (this.hintPos && this.placeItem === undefined) this.hint.draw(this.hintPos, this.get3DDefaultUniform());
    }

    private getPlaceColor = () => {
        const pos = CoordUtils.floor(this.playerWorldPos);

        if (this.placeItem === ItemType.transmit) {
            for (let x = pos.x; x < pos.x + 2; x++) {
                for (let y = pos.y; y < pos.y + 2; y++) {
                    if (this.map.obstacled(x, y) || this.itemManager.hasItem({ x, y })) {
                        return banPlace;
                    }
                }
            }
            return canPlace;
        } else if (!this.map.obstacled(pos.x, pos.y) && !this.itemManager.hasItem(pos)) {
            return canPlace;
        }

        return banPlace;
    }

    private brighten = () => {
        this.playerLightScale = 1.8;
        this.brightNess = 1;
        this.playerLights[0] = {
            position: [this.playerWorldPos.x + PLAYER_SIZE / 2, 1.5, this.playerWorldPos.y + PLAYER_SIZE / 2],
            color: LIGHT_COLOR,
            linear: 0.14,
            quadratic: 0.07
        }
    }

    private dim = () => {
        this.playerLightScale = 1;
        this.brightNess = 0.7;
        this.playerLights[0] = {
            position: [this.playerWorldPos.x + PLAYER_SIZE / 2, 1.5, this.playerWorldPos.y + PLAYER_SIZE / 2],
            color: LIGHT_COLOR,
            linear: 0.35,
            quadratic: 0.44
        }
    }

    private brightNessController = () => {
        if (this.fire) {
            this.brighten();
        } else {
            this.dim();
        }
    }

    private playerController = () => {
        const distance = PLAYER_SPEED * this.deltaTime;
        if (!this.player.death && !this.success) {
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
        } else if (!this.death && !this.success) {
            this.send({ type: 'death' })
        }
        if (this.player2WorldPos) {
            const dis = CoordUtils.calDistance(this.playerWorldPos, this.player2WorldPos);
            if (dis < 2 && !this.success) {
                this.success = true;
                EventBus.dispatch('end');
            }
        }
    }

    private animaController = () => {
        this.count += ANIMA_SPEED * this.deltaTime;
        if (!this.player.death && !this.success) {
            this.playerAnimaFrame = Math.floor(this.count % 4);
            if (!KeyPress.get('S') && !KeyPress.get('A') && !KeyPress.get('D') && !KeyPress.get('W')) {
                this.playerAnimaFrame = 0;
            }
        }
        this.fireFrame = Math.floor(this.count % 4);
    }

    private cameraController = () => {
        this.camera.position[0] = this.playerWorldPos.x;
        this.camera.position[2] = this.playerWorldPos.y + CAMERA_OFFSET_Y;
    }

    private itemController = () => {
        //pick up
        if (!this.placeItem && this.hintPos && KeyPress.get('X')) {
            const itemType = this.itemManager.getItemType(this.hintPos);
            const success = EventBus.dispatch('addItemToBag', itemType);
            if (success) {
                this.itemManager.deleteItem(this.hintPos);
                this.itemsQueue.push({
                    type: 'delete',
                    pos: this.hintPos
                })
            }
        }
        //place
        else if (this.placeItem !== undefined) {
            if (this.placeItem === ItemType.fireWoods) {
                this.fire = true;
                // console.log('fire');
                this.disablePlaceState();
                EventBus.dispatch('deleteItemFromBag');
                const timer = setTimeout(() => {
                    this.fire = false;
                    EventBus.dispatch('showHint', '火把熄灭了');
                    clearTimeout(timer);
                }, putOutTime);
            }
            if (this.placeItem === ItemType.receive) {
                this.receive = true;
                this.disablePlaceState();
                EventBus.dispatch('deleteItemFromBag');
                const timer = setTimeout(() => {
                    this.receive = false;
                    EventBus.dispatch('showHint', '无线电接收器的电池没电了');
                    clearTimeout(timer);
                }, RECEIVE_TIME);
            }
            if (this.placeItem === ItemType.sandwich || this.placeItem === ItemType.toast) {
                console.log(this.placeItem);
                this.player.eat(this.placeItem);
                this.disablePlaceState();
                EventBus.dispatch('deleteItemFromBag');
            }
            if (KeyPress.get('E')) {
                if (this.getPlaceColor() === canPlace) {
                    const pos = CoordUtils.floor(this.playerWorldPos);
                    this.addItemToScene(pos, this.placeItem);
                    this.itemsQueue.push({
                        type: 'add',
                        itemType: this.placeItem,
                        pos
                    })
                    this.disablePlaceState();
                    EventBus.dispatch('deleteItemFromBag');
                } else {
                    EventBus.dispatch("showHint", "这里不可以放置哦，换一个位置试试吧~");
                }
            } else if (KeyPress.get('Escape')) {
                this.disablePlaceState();
            }
        }
    }

    private addItemToScene = (pos: Coord, type: ItemType) => {
        switch (type) {
            case ItemType.powderBox:
                this.itemManager.addItem(pos, ItemType.powder);
                break;
            default:
                this.itemManager.addItem(pos, type);
                break;
        }
    }

    private enablePlaceState = (itemType: ItemType) => {
        this.placeItem = itemType;
        EventBus.dispatch('mask', true);
    }

    private disablePlaceState = () => {
        this.placeItem = undefined;
        EventBus.dispatch('mask', false);
    }

    private calPlayerToTransmitDir = () => {
        let nearPos, minDis = 100000, angle;
        this.transmitsPos.forEach(pos => {
            let curDis = CoordUtils.calDistance(pos, this.playerWorldPos);
            if (curDis < minDis) {
                nearPos = pos;
                minDis = curDis;
            }
        })

        if (nearPos) {
            const dir = CoordUtils.sub(nearPos, this.playerWorldPos)
            angle = CoordUtils.angle(dir, { x: 0, y: -1 });
            if (dir.x > 0) {
                angle = Math.PI * 2 - angle;
            }
        }
        return angle;
    }

    //碰撞检测
    private CollisionDetection = () => {
        let dir = 1;
        if (KeyPress.get('S')) dir = -1;
        let hint = false;
        for (let x = this.playerWorldPos.x - 1; x <= this.playerWorldPos.x + 1; x++) {
            for (let y = this.playerWorldPos.y - dir; dir === 1 ? y <= this.playerWorldPos.y + dir : y >= this.playerWorldPos.y + dir; y += dir) {
                //如果碰到障碍物或者无线电发射装置
                const pos = CoordUtils.floor({ x, y });
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
                //如果碰到道具
                if (this.itemManager.canPickup(pos)) {
                    this.hintPos = pos;
                    hint = true;
                }
            }
        }

        if (!hint) {
            this.hintPos = undefined;
        }

        this.send({
            type: 'player',
            pos: this.playerWorldPos,
            dir: this.playerDirLevel,
            frame: this.playerAnimaFrame,
            scale: this.playerLightScale,
            brightness: this.brightNess
        });

        this.sendItemsState();

        this.mapPos = CoordUtils.sub(this.playerWorldPos, { x: this.map.mapCount.x / 2, y: (this.map.mapCount.y * 2) / 3 });
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
            // console.log(data);
            switch (data.type) {
                case 'player':
                    this.player2WorldPos = data.pos;
                    this.player2DirLevel = data.dir;
                    this.player2AnimaFrame = data.frame;
                    this.playerLights[1] = {
                        position: [this.player2WorldPos.x + PLAYER_SIZE / 2, 1.5, this.player2WorldPos.y + PLAYER_SIZE / 2],
                        color: LIGHT_COLOR,
                        linear: 0.35,
                        quadratic: 0.44
                    }
                    this.player2BrightNess = data.brightness;
                    this.playerLight2Scale = data.scale;
                    break;
                case 'items':
                    this.chuncksIndex = data.chuncksIndex;
                    this.itemManager.addChunck(data.chuncksIndex, data.chuncks);
                    break;
                case 'delete':
                    this.itemManager.deleteItem(data.pos);
                    this.send({ type: 'ack' });
                    break;
                case 'add':
                    this.addItemToScene(data.pos, data.itemType);
                    this.send({ type: 'ack' });
                    if (data.itemType === ItemType.transmit) {
                        console.log('add');
                        this.transmitsPos.push(data.pos);
                    }
                    break;
                case 'close':
                    if (!this.death && !this.success && !this.receiveLost) {
                        EventBus.dispatch('showHint', '另一位玩家掉线了＞﹏＜');
                        this.receiveLost = true;
                    }
                    break;
                case 'ack':
                    this.itemsQueue.shift();
                    break;
                case 'death':
                    if (!this.death && !this.success && !this.receiveDeath) {
                        EventBus.dispatch('showHint', '另一位玩家被饿死了(。﹏。*)');
                        this.receiveDeath = true;
                    }
                    this.send({ type: 'deathAck' });
                    break;
                case 'deathAck':
                    this.death = true;
                    break;
            }
        }
    }

    private send = (obj: Object) => {
        try {
            if (this.ws && this.ws.readyState === 1) {
                this.ws.send(JSON.stringify(obj));
            }
        } catch (e) {
            console.error('send error', e);
        }

    }

    private sendItemsState = () => {
        const itemInfo = this.itemsQueue[0];
        if (itemInfo) {
            this.send(itemInfo);
        }
    }

    private get3DDefaultUniform = (): Array<UniformLocationObj> => ([
        { name: 'u_projectionMatrix', data: this.camera.getProjectionMatrix(this.gl), type: 'matrix' },
        { name: 'u_viewMatrix', data: this.camera.getViewMatrix(), type: 'matrix' },
    ])

    private get2DDefaultUniform = (): Array<UniformLocationObj> => ([
        { name: 'u_resolution', data: [this.map.mapCount.x, this.map.mapCount.y], type: 'vec2' },
        { name: 'u_cameraWorldPos', data: [this.mapPos.x, this.mapPos.y], type: 'vec2' }
    ]);

    private get3DDefaultLightUniform = (): Array<UniformLocationObj> => {
        const lights = [...this.playerLights, ...this.lights];
        const lightCount = lights.length;
        const defaultUniforms: Array<UniformLocationObj> = [
            { name: 'u_projectionMatrix', data: this.camera.getProjectionMatrix(this.gl), type: 'matrix' },
            { name: 'u_viewMatrix', data: this.camera.getViewMatrix(), type: 'matrix' },
            { name: 'u_lightCount', data: [lightCount], type: 'int' },
            { name: 'u_viewPos', data: this.camera.position, type: 'vec3' },
        ];
        lights.forEach((light, index) => {
            defaultUniforms.push(...this.getLight(light, index))
        })
        return defaultUniforms;
    }

    private getLight = (light: LightInfo, index: number): Array<UniformLocationObj> => ([
        { name: `pointLights[${index}].position`, data: light.position, type: 'vec3' },
        { name: `pointLights[${index}].color`, data: light.color, type: 'vec3' },
        { name: `pointLights[${index}].linear`, data: [light.linear], type: 'float' },
        { name: `pointLights[${index}].quadratic`, data: [light.quadratic], type: 'float' },
    ])

    private arrayToColor = (array: Array<number>) => (array.map(a => a / 255));
}

export default Game;
