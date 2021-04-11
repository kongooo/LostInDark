import * as React from "react";

import Game from "./Game/index";

import Loading from "./Loading";
import { LoadImage } from "./Tools/LoadImage";

import playerImg from "../../image/slime.png";
import backImg from "../../image/back.png";
import groundImg from "../../image/ground1.png";

export { GameCanvas };

interface GLProps {
  children?: JSX.Element[];
  width: number;
  height: number;
}

interface GLState {
  loading: boolean;
}

class GameCanvas extends React.Component<GLProps, GLState> {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  constructor(props: GLProps) {
    super(props);
    this.state = { loading: true };
  }

  componentDidMount() {
    const gl = this.canvasRef.current.getContext(
      "webgl2"
    ) as WebGL2RenderingContext;
    (window as any).gl = gl;
    if (!gl) {
      console.error("can't init webgl");
      return;
    }
    this.init(gl);
  }

  private loadImages = async () => {
    const images: Array<any> = [];
    images.push(playerImg);
    images.push(backImg);
    images.push(groundImg);
    const imgs = await LoadImage(images);
    return imgs;
  };

  private init = (gl: WebGL2RenderingContext) => {
    const path = "ws://" + window.location.host + "/transfer";
    const ws = new WebSocket(path);
    const mes = JSON.stringify({ type: "connect" });
    ws.onopen = (e) => {
      ws.send(mes);
    };
    ws.onmessage = async (mes) => {
      const data = JSON.parse(mes.data);
      if (data.type === "success") {
        console.log("success");
        const imgs = await this.loadImages();
        const game = new Game(gl, data.seed, data.pos, ws, imgs);
        game.start();
        this.setState({ loading: false });
      }
    };
  };

  render() {
    const { loading } = this.state;
    const { width, height } = this.props;
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
          width={width * window.devicePixelRatio}
          height={height * window.devicePixelRatio}
          style={{ width, height }}
          ref={this.canvasRef}
        ></canvas>
      </React.Fragment>
    );
  }
}
