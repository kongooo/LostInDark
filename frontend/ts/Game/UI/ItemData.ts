import match from "../../../../image/bagImage/match.png";
import wood from "../../../../image/bagImage/wood.png";
import powderBox from "../../../../image/bagImage/powderBox.png";

import { ItemType } from "../../Tools/interface";

const matchData = {
    imgSrc: match,
    count: 1,
    type: ItemType.match,
    description: "火柴",
}

const woodData = {
    imgSrc: wood,
    count: 1,
    type: ItemType.wood,
    description: "木头",
}

const powderBoxData = {
    imgSrc: powderBox,
    count: 1,
    type: ItemType.powderBox,
    description: "粉末盒",
}

export { matchData, woodData, powderBoxData };