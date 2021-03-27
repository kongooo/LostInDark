import * as React from "react";
import { useEffect } from "react";

import Game from "./Game/index";

import { Coord } from "./Tools/Tool";

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
    if (!gl) {
      console.error("can't init webgl");
      return;
    }
    const game = new Game(gl, randomInt(0, 10000), new Coord(1000));
    game.start();
  });

  const randomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min) + min);
  };

  return (
    <canvas
      className="gl-root"
      width={props.width}
      height={props.height}
      style={{ width: props.width, height: props.height }}
      ref={canvasRef}
    ></canvas>
  );
}
