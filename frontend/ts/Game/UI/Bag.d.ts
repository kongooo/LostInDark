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
    addItem: (type: ItemType) => void;
    deleteItem: () => void;
    onMouseOver: (e: any) => void;
    onConbinaMouseOver: (e: any) => void;
    onClick: () => void;
    onConbinaClick: () => void;
    render(): JSX.Element;
}
export default Bag;
