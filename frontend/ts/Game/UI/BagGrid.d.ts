import * as React from "react";
interface BagGridProps {
    imgSrc?: string;
    count?: number;
    description?: string;
    active: boolean;
    index: number;
}
interface BagGridState {
    choose: boolean;
}
declare class BagGrid extends React.Component<BagGridProps, BagGridState> {
    constructor(props: BagGridProps);
    componentWillReceiveProps(nextProps: BagGridProps): void;
    onMouseOver: () => void;
    onMouseLeave: () => void;
    stopPubbling: (e: any) => void;
    render(): JSX.Element;
}
export default BagGrid;
