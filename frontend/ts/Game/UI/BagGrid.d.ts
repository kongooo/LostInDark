import * as React from "react";
interface BagGridProps {
    imgSrc?: string;
    description?: string;
    name?: string;
    active: boolean;
    index: number;
}
interface BagGridState {
    choose: boolean;
}
declare class BagGrid extends React.Component<BagGridProps, BagGridState> {
    private imgRef;
    constructor(props: BagGridProps);
    componentWillReceiveProps(nextProps: BagGridProps): void;
    onMouseOver: () => void;
    onMouseLeave: () => void;
    stopPubbling: (e: any) => void;
    render(): JSX.Element;
}
export default BagGrid;
