import * as React from "react";
export { GameCanvas };
interface GLProps {
    children?: JSX.Element[];
    width: number;
    height: number;
}
interface GLState {
    loading: boolean;
    animaDisplay: string;
    showBag: boolean;
    hintShow: boolean;
    hintWord: string;
}
declare class GameCanvas extends React.Component<GLProps, GLState> {
    private canvasRef;
    constructor(props: GLProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    private loadImages;
    private initWithWs;
    private init;
    private bagControl;
    private showHint;
    render(): JSX.Element;
}
