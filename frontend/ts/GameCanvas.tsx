import * as React from "react";

import Game from "./Game/index";
import Bag from "./Game/UI/Bag";

import { randomInt } from "./Tools/Tool";

import Loading from "./Loading";
import { LoadImage } from "./Tools/LoadImage";

import playerImg from "../../image/mikasa.png";
import obstacleImg from "../../image/free.png";
import groundImg from "../../image/back1.png";

import matchFront from "../../image/match/front.png";
import matchUp from "../../image/match/up.png";

import woodFront from "../../image/wood/front.png";
import woodUp from "../../image/wood/up.png";

import powderBoxFront from "../../image/powderBox/front.png";
import powderBoxUp from "../../image/powderBox/up.png";
import powderBoxSide from "../../image/powderBox/side.png";

import hintImg from "../../image/hint.png";
import bagImg from "../../image/bag.png";

import { ImgType, ItemType } from "./Tools/interface";
import EventBus from "./Tools/Event/EventBus";

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

class GameCanvas extends React.Component<GLProps, GLState> {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  constructor(props: GLProps) {
    super(props);
    this.state = {
      loading: true,
      animaDisplay: "flex",
      showBag: false,
      hintShow: false,
      hintWord: "",
    };
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
    // this.initWithWs(gl);
    this.init(gl);
    EventBus.addEventListener("showHint", this.showHint);
  }

  componentWillUnmount() {
    EventBus.removeEventListener("showHint");
  }

  private loadImages = async () => {
    const images: Map<ImgType, string | HTMLImageElement> = new Map();
    const imgMap: Map<ImgType, HTMLImageElement> = new Map();
    images.set(ImgType.player, playerImg);
    images.set(ImgType.player1, playerImg);
    images.set(ImgType.ground, groundImg);
    images.set(ImgType.obstable, obstacleImg);

    images.set(ImgType.matchFront, matchFront);
    images.set(ImgType.matchUp, matchUp);

    images.set(ImgType.woodFront, woodFront);
    images.set(ImgType.woodUp, woodUp);

    images.set(ImgType.powderFront, powderBoxFront);
    images.set(ImgType.powderSide, powderBoxSide);
    images.set(ImgType.powderUp, powderBoxUp);

    images.set(ImgType.hint, hintImg);

    await LoadImage(images, imgMap);
    return imgMap;
  };

  private initWithWs = (gl: WebGL2RenderingContext) => {
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
        const game = new Game(gl, data.seed, data.pos, imgs, ws);
        game.start();
        this.setState({ loading: false });
        const timer = setTimeout(() => {
          this.setState({ animaDisplay: "none" });
          clearTimeout(timer);
        }, 500);
      }
    };
  };

  private init = async (gl: WebGL2RenderingContext) => {
    const imgs = await this.loadImages();
    const game = new Game(gl, randomInt(0, 10000), { x: 1000, y: 1000 }, imgs);
    game.start();
    this.setState({ loading: false });
    const timer = setTimeout(() => {
      this.setState({ animaDisplay: "none" });
      clearTimeout(timer);
    }, 500);
  };

  private bagControl = () => {
    this.setState({ showBag: !this.state.showBag });
  };

  private showHint = (word: string) => {
    this.setState({
      hintShow: true,
      hintWord: word,
    });
    let timer = setTimeout(() => {
      this.setState({
        hintShow: false,
        // hintWord: "",
      });
      clearTimeout(timer);
    }, 1000);
  };

  render() {
    const { loading, animaDisplay, showBag, hintShow, hintWord } = this.state;
    const { width, height } = this.props;
    return (
      <React.Fragment>
        <div
          className={`load-anima ${loading ? "" : "load-anima-disappear"}`}
          style={{ display: animaDisplay }}
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
        <Bag show={showBag}></Bag>
        <img src={bagImg} className="bag-icon" onClick={this.bagControl}></img>
        <div
          className={`hint-box ${
            hintShow ? "hint-box-show" : "hint-box-disappear"
          }`}
        >
          <p>{hintWord}</p>
        </div>
      </React.Fragment>
    );
  }
}
