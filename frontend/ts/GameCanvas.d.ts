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
    overlay: boolean;
}
declare class GameCanvas extends React.Component<GLProps, GLState> {
    private canvasRef;
    private id;
    private game;
    constructor(props: GLProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    private loadImages;
    private initWithWs;
    private reconnect;
    private init;
    private bagControl;
    private showHint;
    private controlOverlay;
    render(): JSX.Element;
}
