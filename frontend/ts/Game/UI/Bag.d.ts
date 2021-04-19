import * as React from "react";
import { BagItem, ItemType } from "../../Tools/interface";
interface BagProps {
    show: boolean;
}
interface BagState {
    items: Array<BagItem>;
    activeIndex: number;
}
declare class Bag extends React.Component<BagProps, BagState> {
    constructor(props: BagProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    addItem: (type: ItemType) => void;
    deleteItem: () => void;
    onMouseOver: (e: any) => void;
    onMouseDown: () => void;
    render(): JSX.Element;
}
export default Bag;
