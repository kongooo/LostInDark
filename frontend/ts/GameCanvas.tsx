import * as React from "react";
import { useEffect, useState } from "react";

import Game from "./Game/index";

import Loading from "./Loading";

export { GameCanvas };

interface GLProps {
  children?: JSX.Element[];
  width: number;
  height: number;
}

function GameCanvas(props: GLProps) {
  const canvasRef = React.useRef(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gl = canvasRef.current.getContext("webgl2") as WebGL2RenderingContext;
    (window as any).gl = gl;
    if (!gl) {
      console.error("can't init webgl");
      return;
    }
    init(gl);
  });

  const init = (gl: WebGL2RenderingContext) => {
    const path = "ws://" + window.location.host + "/transfer";
    const ws = new WebSocket(path);
    const pos = JSON.stringify({ type: "connect" });
    ws.onopen = (e) => {
      ws.send(pos);
    };
    ws.onmessage = (mes) => {
      const data = JSON.parse(mes.data);
      if (data.type === "success") {
        const game = new Game(gl, data.seed, data.pos, ws);
        game.start();
        setLoading(false);
      }
    };
  };

  return (
    <React.Fragment>
      <div
        className="load-anima"
        style={{ display: loading ? "flex" : "none" }}
      >
        <Loading></Loading>
      </div>
      <canvas
        className="gl-root"
        width={props.width * window.devicePixelRatio}
        height={props.height * window.devicePixelRatio}
        style={{ width: props.width, height: props.height }}
        ref={canvasRef}
      ></canvas>
    </React.Fragment>
  );
}
