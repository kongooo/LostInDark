import * as React from "react";
import { useEffect } from "react";

import Game from "./Game/index";

export { GameCanvas };

interface GLProps {
  children?: JSX.Element[];
  width: number;
  height: number;
}

function GameCanvas(props: GLProps) {
  const canvasRef = React.useRef(null);
  useEffect(() => {
    const gl = canvasRef.current.getContext("webgl2") as WebGL2RenderingContext;
    (window as any).gl = gl;
    if (!gl) {
      console.error("can't init webgl");
      return;
    }
    const game = new Game(gl, randomInt(0, 10000), { x: 1000, y: 1000 });
    game.start();
  });

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  return (
    <canvas
      className="gl-root"
      width={props.width * window.devicePixelRatio}
      height={props.height * window.devicePixelRatio}
      style={{ width: props.width, height: props.height }}
      ref={canvasRef}
    ></canvas>
  );
}
