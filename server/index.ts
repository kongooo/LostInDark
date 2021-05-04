import { Client, ClientSocket } from './ClientSocket';
import { GetRandomCode, GetRandomNum } from './RandomCode';

const path = require('path');
const Server = require('koa-static');
const Koa = require('koa');
const Router = require('koa-router');
const webSocket = require('koa-easy-ws');

const app = new Koa();

const srcPath = path.join(__dirname, '../dist');

const main = Server(srcPath);

const mainRoute = new Router();

let curFreeClient: Client | undefined = undefined;

const players: Map<string, ClientSocket> = new Map();

mainRoute.get('/transfer', async (ctx: any) => {
    if (ctx.ws) {
        const ws = await ctx.ws();
        ws.on('message', async (mes: any) => {
            const data = JSON.parse(mes);
            switch (data.type) {
                case 'connect':
                    if (!curFreeClient || curFreeClient.getWs().readyState === 3) {
                        curFreeClient = new Client(ws);
                    } else {
                        const id = GetRandomCode();
                        const seed = GetRandomNum(0, 10000);
                        const curClient = new Client(ws);
                        const playerSocket = new ClientSocket(curFreeClient, curClient, id, seed);
                        players.set(id, playerSocket);
                        curFreeClient = undefined;
                    }
                    break;
                case 'reconnect':
                    const id = data.id;
                    console.log('reconnect');
                    if (players.has(id)) {
                        console.log(id);
                        const socket = players.get(id);
                        const client = new Client(ws);
                        if (!socket.getPlayer1()) {
                            socket.setPlayer1(client);
                        }
                        if (!socket.getPlayer2()) {
                            socket.setPlayer2(client);
                        }
                    }
                    break;
            }
            clearPlayers();
        })
    }
});

const clearPlayers = () => {
    players.forEach((player, key) => {
        if (!player.getPlayer1() && !player.getPlayer2()) {
            const clearTimer = setTimeout(() => {
                if (!player.getPlayer1() && !player.getPlayer2()) {
                    players.delete(key);
                    clearTimeout(clearTimer);
                }
            }, 600000);
        }
    })
}

app.on('error', (e: any) => {
    console.log('app error', e);
})

app.use(main)
    .use(webSocket())
    .use(mainRoute.routes())
    .use(mainRoute.allowedMethods());

app.listen('0.0.0.0:3000');