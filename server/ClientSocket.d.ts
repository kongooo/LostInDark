declare class Client {
    private ws;
    constructor(ws: any);
    getWs: () => any;
}
declare class ClientSocket {
    private player1;
    private player2;
    private seed;
    private id;
    constructor(player1: Client, player2: Client, id: string, seed: number);
    private init;
    getPlayer2: () => Client;
    getPlayer1: () => Client;
}
export { Client, ClientSocket };
