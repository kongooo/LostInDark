import match from "../../../../image/bagImage/match.png";
import wood from "../../../../image/bagImage/wood.png";
import powderBox from "../../../../image/bagImage/powderBox.png";
import fireWoodImg from "../../../../image/fire/fireWood.png";
import firePileImg from "../../../../image/fire/firePile.png";


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
}

export default ItemData;