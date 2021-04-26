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
    private itemChuncks;
    private noise;
    constructor(player1: Client, player2: Client, id: string, seed: number);
    private init;
    setPlayer1: (player: Client) => void;
    setPlayer2: (player: Client) => void;
    private player2WsSetting;
    private player1WsSetting;
    private generateItems;
    private getChunckIndexByPos;
    private getChunckPosByIndex;
    private randomChunckItem;
    obstacled: (x: number, y: number) => boolean;
    private randomItem;
    getPlayer2: () => Client;
    getPlayer1: () => Client;
}
export { Client, ClientSocket };
