/// <reference types="react" />
export { GameCanvas };
interface GLProps {
    children?: JSX.Element[];
    width: number;
    height: number;
}
declare function GameCanvas(props: GLProps): JSX.Element;
