import * as React from "react";
import { useState, useEffect } from "react";
import * as ReactDOM from "react-dom";

import { drawRect } from "./GLFunc/initRect";

export { ReactGL };

interface GLProps {
  children?: JSX.Element[];
  width: number;
  height: number;
}

function ReactGL(props: GLProps) {
  const canvasRef = React.useRef(null);
  useEffect(() => {
    const gl = canvasRef.current.getContext("webgl2") as WebGL2RenderingContext;
    if (!gl) {
      console.error("can't init webgl");
      return;
    }
    drawRect(gl);
  });

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
