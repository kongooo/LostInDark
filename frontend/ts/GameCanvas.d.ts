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
    death: boolean;
    success: boolean;
    showLastImg: boolean;
    showLastWord: boolean;
    showLashWordBox: boolean;
    loadStart: boolean;
}
declare class GameCanvas extends React.Component<GLProps, GLState> {
    private canvasRef;
    private id;
    private game;
    private time;
    private timeInterval;
    constructor(props: GLProps);
    componentDidMount(): void;
    componentWillUnmount(): void;
    private loadImages;
    private showStartPanel;
    private initWithWs;
    private reconnect;
    private bagControl;
    private showHint;
    private controlOverlay;
    private showDeathBox;
    private end;
    render(): JSX.Element;
}
