import match from "../../../../image/bagImage/match.png";
import wood from "../../../../image/bagImage/wood.png";
import powderBox from "../../../../image/bagImage/powderBox.png";
import fireWoodImg from "../../../../image/fire/fireWood.png";
import firePileImg from "../../../../image/fire/firePile.png";
import transmitEquip from '../../../../image/transmitEquip.png';
import receiveEquip from '../../../../image/receiveEquip.png';
import battery from '../../../../image/battery/battery.png';
import wire from '../../../../image/wire.png';
import circuit from '../../../../image/circuitBoard.png';
import toast from '../../../../image/toast/toast.png';
import sandwich from '../../../../image/sandwich/sandwich.png';


import { BagItem, ItemType } from "../../Tools/interface";

class ItemData {
    static matchData = (): BagItem => ({
        imgSrc: match,
        type: ItemType.match,
        name: "火柴",
        description: '看起来似乎可以点燃什么东西的火柴'
    })

    static woodData = (): BagItem => ({
        imgSrc: wood,
        type: ItemType.wood,
        name: "木头",
        description: '被削的很整齐的木头'
    })

    static powderBoxData = (): BagItem => ({
        imgSrc: powderBox,
        type: ItemType.powderBox,
        name: "粉末盒",
        description: '一个方形的黑色盒子，不知道里面装了些什么',
        useCount: 10
    })

    static fireWoodData = (): BagItem => ({
        imgSrc: fireWoodImg,
        type: ItemType.fireWoods,
        name: '火把'
    })

    static firePileData = (): BagItem => ({
        imgSrc: firePileImg,
        type: ItemType.firePile,
        name: '火堆'
    })

    static transmitData = (): BagItem => ({
        imgSrc: transmitEquip,
        type: ItemType.transmit,
        name: '无线电发射设备'
    })

    static receiveData = (): BagItem => ({
        imgSrc: receiveEquip,
        type: ItemType.receive,
        name: '无线电接收设备'
    })

    static batteryData = (): BagItem => ({
        imgSrc: battery,
        type: ItemType.battery,
        name: '电池'
    })

    static wireData = (): BagItem => ({
        imgSrc: wire,
        type: ItemType.wire,
        name: '电线'
    })

    static circuitData = (): BagItem => ({
        imgSrc: circuit,
        type: ItemType.circuitBoard,
        name: '电路板'
    })

    static toastData = (): BagItem => ({
        imgSrc: toast,
        type: ItemType.toast,
        name: '鸡蛋吐司'
    })

    static sandwichData = (): BagItem => ({
        imgSrc: sandwich,
        type: ItemType.sandwich,
        name: '鸡肉三明治'
    })
}

export default ItemData;