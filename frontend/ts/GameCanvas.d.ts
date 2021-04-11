import * as React from "react";
export { GameCanvas };
interface GLProps {
    children?: JSX.Element[];
    width: number;
    height: number;
}
interface GLState {
    loading: boolean;
}
declare class GameCanvas extends React.Component<GLProps, GLState> {
    private canvasRef;
    constructor(props: GLProps);
    componentDidMount(): void;
    private loadImages;
    private init;
    render(): JSX.Element;
}
