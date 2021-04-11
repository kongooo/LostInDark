import { GetRandomNum } from './RandomCode';

class Client {
    private ws: any;

    constructor(ws: any) {
        this.ws = ws;
    }

    getWs = () => this.ws;
}

class ClientSocket {
    private player1: Client;
    private player2: Client;
    private seed: number;
    private id: string;

    constructor(player1: Client, player2: Client, id: string, seed: number) {
        this.player1 = player1;
        this.player2 = player2;
        this.id = id;
        this.seed = seed;
        this.init();
    }

    private init = () => {

        const pos1 = { x: GetRandomNum(1000, 1010), y: GetRandomNum(1000, 1010) };
        const pos2 = { x: pos1.x + 5, y: pos1.y + 5 };
        this.player1.getWs().send(JSON.stringify({ type: 'success', id: this.id, seed: this.seed, pos: pos1 }));
        this.player2.getWs().send(JSON.stringify({ type: 'success', id: this.id, seed: this.seed, pos: pos2 }));
        this.player1.getWs().on('message', async (mes: any) => {
            if (this.player2.getWs().readyState === 1) {
                this.player2.getWs().send(mes);
            } else {
                this.player2.getWs().close();
                this.player1.getWs().close();
            }
        });
        this.player2.getWs().on('message', async (mes: any) => {
            if (this.player1.getWs().readyState === 1) {
                this.player1.getWs().send(mes);
            } else {
                this.player1.getWs().close();
                this.player2.getWs().close();
            }
        });
    }

    getPlayer2 = () => this.player2;

    getPlayer1 = () => this.player1;
}

export { Client, ClientSocket };