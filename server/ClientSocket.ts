import { GetRandomNum } from './RandomCode';
import { CoordUtils, Coord } from '../frontend/ts/Tools/Tool';
import { ItemType, Item } from '../frontend/ts/Tools/interface';
import perlinNoise3d from 'perlin-noise-3d';

class Client {
    private ws: any;

    constructor(ws: any) {
        this.ws = ws;
    }

    getWs = () => this.ws;
}

const MATCH_MIN_COUNT = 5;
const MATCH_MAX_COUNT = 20;
const WOOD_MIN_COUNT = 10;
const WOOD_MAX_COUNT = 25;
const POWDERBOX_MIN_COUNT = 3;
const POWDERBOX_MAX_COUNT = 7;

const ZOOM = 5;
const THRESHOLD = 0.6;

const MAP_COUNT = { x: 70, y: 50 };
const CHUNCK_SIZE = CoordUtils.mult(MAP_COUNT, 2);

class ClientSocket {
    private player1: Client;
    private player2: Client;
    private seed: number;
    private id: string;
    private itemChuncks: Map<string, Array<Item>> = new Map();
    private noise: any;

    constructor(player1: Client, player2: Client, id: string, seed: number) {
        this.player1 = player1;
        this.player2 = player2;
        this.id = id;
        this.seed = seed;
        const noise = new perlinNoise3d();
        noise.noiseSeed(seed);
        this.noise = noise;
        this.init();
    }

    private init = () => {

        const pos1 = { x: GetRandomNum(1000, 1010), y: GetRandomNum(1000, 1010) };
        const pos2 = { x: pos1.x, y: pos1.y };
        this.player1.getWs().send(JSON.stringify({ type: 'success', id: this.id, seed: this.seed, pos: pos1, mapCount: MAP_COUNT }));
        this.player2.getWs().send(JSON.stringify({ type: 'success', id: this.id, seed: this.seed, pos: pos2, mapCount: MAP_COUNT }));
        this.player1.getWs().on('message', async (mes: any) => {

            const data = JSON.parse(mes);
            if (data.type === 'player') {
                const res = this.generateItems(data.pos);
                this.player1.getWs().send(JSON.stringify(res));
            }

            if (this.player2.getWs().readyState === 1) {
                this.player2.getWs().send(mes);
            } else if (this.player2.getWs().readyState === 2 || this.player2.getWs().readyState === 3) {
                this.player2.getWs().close();
                this.player1.getWs().close();
            }
        });

        this.player2.getWs().on('message', async (mes: any) => {
            const data = JSON.parse(mes);
            if (data.type === 'player') {
                const res = this.generateItems(data.pos);
                this.player2.getWs().send(JSON.stringify(res));
            }

            if (this.player1.getWs().readyState === 1) {
                this.player1.getWs().send(mes);
            } else if (this.player1.getWs().readyState === 2 || this.player1.getWs().readyState === 3) {
                this.player1.getWs().close();
                this.player2.getWs().close();
            }
        });
    }

    private generateItems = (playerPos: Coord) => {
        const mapPos = CoordUtils.floor(CoordUtils.sub(playerPos, { x: MAP_COUNT.x / 2, y: (MAP_COUNT.y * 2) / 3 }));
        const chunckPos = [
            mapPos,
            CoordUtils.add(mapPos, { x: MAP_COUNT.x, y: 0 }),
            CoordUtils.add(mapPos, { x: 0, y: MAP_COUNT.y }),
            CoordUtils.add(mapPos, MAP_COUNT)
        ];
        const chuncksIndex = Array.from(new Set(chunckPos.map(pos => this.getChunckIndexByPos(pos))));
        let sendChuncksIndex: Array<string> = [];
        let newChuncks: Array<Array<Item>> = [];
        chuncksIndex.forEach(chunckIndex => {
            let itemChunck = this.itemChuncks.get(chunckIndex);
            if (!itemChunck) {
                itemChunck = this.randomChunckItem(chunckIndex);
            }
            sendChuncksIndex.push(chunckIndex);
            newChuncks.push(itemChunck);
        })
        return {
            type: 'items',
            chuncksIndex: sendChuncksIndex,
            chuncks: newChuncks
        }
    }

    private getChunckIndexByPos = (pos: Coord) => {
        const chunck = CoordUtils.division(pos, CHUNCK_SIZE);
        return `${Math.floor(chunck.x)},${Math.floor(chunck.y)}`;
    }

    private getChunckPosByIndex = (index: string) => {
        const [x, y] = index.split(',').map(Number);
        return { x, y };
    }

    private randomChunckItem = (chunckIndex: string) => {
        const items: Array<Item> = [];
        const [chunckX, chunckY] = chunckIndex.split(',').map(Number);
        const leftDownPos = CoordUtils.mult({ x: chunckX, y: chunckY }, CHUNCK_SIZE);
        const rightUpPos = CoordUtils.add(leftDownPos, CHUNCK_SIZE);

        let matchCount = GetRandomNum(MATCH_MIN_COUNT, MATCH_MAX_COUNT);
        let woodCount = GetRandomNum(WOOD_MIN_COUNT, WOOD_MAX_COUNT);
        let powderBoxCount = GetRandomNum(POWDERBOX_MIN_COUNT, POWDERBOX_MAX_COUNT);

        this.randomItem(matchCount, items, leftDownPos, rightUpPos, ItemType.match);

        this.randomItem(woodCount, items, leftDownPos, rightUpPos, ItemType.wood);

        this.randomItem(powderBoxCount, items, leftDownPos, rightUpPos, ItemType.powderBox);

        this.itemChuncks.set(chunckIndex, items);
        return items;
    }

    obstacled = (x: number, y: number) => {
        return this.noise.get(Math.floor(x) / ZOOM, Math.floor(y) / ZOOM) > THRESHOLD;
    }

    private randomItem = (count: number, items: Array<Item>, leftDownPos: Coord, rightUpPos: Coord, type: ItemType) => {
        while (count--) {
            const randomX = GetRandomNum(leftDownPos.x, rightUpPos.x);
            const randomY = GetRandomNum(leftDownPos.y, rightUpPos.y);
            if (!this.obstacled(randomX, randomY)) {
                items.push({
                    pos: { x: randomX, y: randomY },
                    type
                })
            }
        }
    }

    getPlayer2 = () => this.player2;

    getPlayer1 = () => this.player1;
}


export { Client, ClientSocket };