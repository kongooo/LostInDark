import * as React from "react";
import { BagItem, ItemType } from "../../Tools/interface";
interface BagProps {
    show: boolean;
}
interface BagState {
    items: Array<BagItem>;
    conbinaItems: Array<BagItem>;
    activeIndex: number;
    conbindActiveIndex: number;
}
declare class Bag extends React.Component<BagProps, BagState> {
    constructor(props: BagProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    addItem: (type: ItemType) => boolean;
    deleteItem: () => void;
    onMouseOver: (e: any) => void;
    onConbinaMouseOver: (e: any) => void;
    onClick: () => void;
    onConbinaClick: () => void;
    /**
     *
     * @param conbinaItems 合成所需材料
     * @param aimItem 合成目标
     * @param aimItemName 合成目标名称
     * @param failedWord 合成所需材料描述
     */
    private conbinaItem;
    render(): JSX.Element;
}
export default Bag;
