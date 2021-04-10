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
                    if (!curFreeClient) {
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
            }
        })
    }
});

app.use(main)
    .use(webSocket())
    .use(mainRoute.routes())
    .use(mainRoute.allowedMethods());

app.listen(3000);