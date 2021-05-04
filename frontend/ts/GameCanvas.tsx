import * as React from "react";

import Game from "./Game/index";
import Bag from "./Game/UI/Bag";

import { randomInt } from "./Tools/Tool";

import Loading from "./Loading";
import { LoadImage } from "./Tools/LoadImage";

import mikasaImg from "../../image/mikasa.png";
import alenImg from "../../image/alen.png";
import obstacleImg from "../../image/grass.png";
import groundImg from "../../image/ground.png";

import matchFront from "../../image/match/front.png";
import matchUp from "../../image/match/up.png";

import woodFront from "../../image/wood/front.png";
import woodUp from "../../image/wood/up.png";

import powderBoxFront from "../../image/powderBox/front.png";
import powderBoxUp from "../../image/powderBox/up.png";
import powderBoxSide from "../../image/powderBox/side.png";

import hintImg from "../../image/hint.png";
import bagImg from "../../image/bag.png";

import powderImg from "../../image/powder.png";

import fireImg from "../../image/fire/fire.png";

import batteryImg from "../../image/battery/battery.png";
import batteryUpImg from "../../image/battery/batteryUp.png";
import batteryFrontImg from "../../image/battery/batteryFront.png";

import wireImg from "../../image/wire.png";
import circuitImg from "../../image/circuitBoard.png";

import arrowImg from "../../image/arrow.png";

import toastFront from "../../image/toast/front.png";
import toastUp from "../../image/toast/side.png";

import sandwichFront from "../../image/sandwich/front.png";
import sandwichUp from "../../image/sandwich/side.png";

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
  overlay: boolean;
  death: boolean;
  success: boolean;
  showLastImg: boolean;
  showLastWord: boolean;
  loadStart: boolean;
}

class GameCanvas extends React.Component<GLProps, GLState> {
  private canvasRef = React.createRef<HTMLCanvasElement>();
  private id: string;
  private game: Game;
  private time: number = 0;
  private timeInterval: any;
  constructor(props: GLProps) {
    super(props);
    this.state = {
      loading: true,
      animaDisplay: "flex",
      showBag: false,
      hintShow: false,
      hintWord: "",
      overlay: false,
      death: false,
      success: false,
      showLastImg: false,
      showLastWord: false,
      loadStart: false,
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
    // this.init(gl);
    this.showStartPanel(gl);
    EventBus.addEventListener("showHint", this.showHint);
    EventBus.addEventListener("BagControl", this.bagControl);
    EventBus.addEventListener("mask", this.controlOverlay);
    EventBus.addEventListener("death", this.showDeathBox);
    EventBus.addEventListener("end", this.end);
  }

  componentWillUnmount() {
    EventBus.removeEventListener("showHint");
    EventBus.removeEventListener("BagControl");
    EventBus.removeEventListener("mask");
    EventBus.removeEventListener("death");
    EventBus.removeEventListener("end");
  }

  private loadImages = async () => {
    const images: Map<ImgType, string | HTMLImageElement> = new Map();
    const imgMap: Map<ImgType, HTMLImageElement> = new Map();
    images.set(ImgType.mikasa, mikasaImg);
    images.set(ImgType.alen, alenImg);
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
    images.set(ImgType.powder, powderImg);

    images.set(ImgType.fire, fireImg);

    images.set(ImgType.battery, batteryImg);
    images.set(ImgType.batteryFront, batteryFrontImg);
    images.set(ImgType.batteryUp, batteryUpImg);

    images.set(ImgType.wire, wireImg);

    images.set(ImgType.circuitBoard, circuitImg);

    images.set(ImgType.arrow, arrowImg);

    images.set(ImgType.toastFront, toastFront);
    images.set(ImgType.toastUp, toastUp);

    images.set(ImgType.sandwichFront, sandwichFront);
    images.set(ImgType.sandwichUp, sandwichUp);

    await LoadImage(images, imgMap);
    return imgMap;
  };

  private showStartPanel = (gl: WebGL2RenderingContext) => {
    const word1 = document.querySelector("#load-word-1") as HTMLDivElement;
    const word2 = document.querySelector("#load-word-2") as HTMLDivElement;
    word1.style.opacity = "1";
    const word1Timer = setTimeout(() => {
      word1.style.opacity = "0";
      word2.style.opacity = "1";
      clearTimeout(word1Timer);
      const word2Timer = setTimeout(() => {
        word2.style.opacity = "0";
        const loadTimer = setTimeout(() => {
          this.setState({ loadStart: true });
          this.initWithWs(gl);
          clearTimeout(loadTimer);
        }, 1500);
        clearTimeout(word2Timer);
      }, 2000);
    }, 3000);
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
        this.id = data.id;
        const imgs = await this.loadImages();
        const game = new Game(
          gl,
          data.seed,
          data.pos,
          imgs,
          data.mapCount,
          data.mikasa,
          ws
        );
        game.start();
        this.game = game;
        this.timeInterval = setInterval(() => {
          if (!this.state.death && !this.state.success) this.time += 1;
        }, 1000);
        this.setState({ loading: false });
        const timer = setTimeout(() => {
          this.setState({ animaDisplay: "none" });
          clearTimeout(timer);
        }, 500);
      }
    };
    ws.onclose = () => {
      this.reconnect();
    };
    ws.onerror = () => {
      this.reconnect();
    };
  };

  private reconnect = () => {
    console.log("reconnect");
    const path = "ws://" + window.location.host + "/transfer";
    const ws = new WebSocket(path);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "reconnect",
          id: this.id,
        })
      );
      this.game.setWs(ws);
      console.log("reconnect success");
    };
    ws.onclose = () => {
      this.reconnect();
    };
    ws.onerror = (e) => {
      ws.close();
      console.error(e);
    };
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
    }, 1500);
  };

  private controlOverlay = (show: boolean) => {
    this.setState({ overlay: show });
  };

  private showDeathBox = () => {
    this.setState({ death: true });
  };

  private end = () => {
    this.setState({ success: true });
    const wordTimer = setTimeout(() => {
      this.setState({ showLastWord: true });
      clearTimeout(wordTimer);
      clearInterval(this.timeInterval);
      const sceneTimer = setTimeout(() => {
        this.setState({ showLastImg: true });
        clearTimeout(sceneTimer);
      }, 4000);
    }, 100);
  };

  render() {
    const {
      loading,
      animaDisplay,
      showBag,
      hintShow,
      hintWord,
      overlay,
      death,
      success,
      showLastImg,
      showLastWord,
      loadStart,
    } = this.state;
    const { width, height } = this.props;
    return (
      <React.Fragment>
        <div
          className={`load-anima ${loading ? "" : "load-anima-disappear"}`}
          style={{ display: animaDisplay }}
        >
          <p className={`load-word`} id="load-word-1">
            在这个无边无际的世界中，你唯一需要做的就是
          </p>
          <p className={`load-word`} id="load-word-2">
            找到对方
          </p>
          {loadStart && <Loading></Loading>}
        </div>
        {overlay && <div className="overlay"></div>}
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
        <progress id="blood" max="100" value={100} color="red"></progress>
        {death && (
          <div id="death-box">
            <p>{`很遗憾，经过${this.time}秒，你被饿死了`}</p>
          </div>
        )}
        {success && (
          <div
            className={`last-word-box ${
              showLastWord ? "last-word-box-show" : ""
            }`}
          >
            <p>{`从世界诞生到现在经过${this.time}秒，我终于找到你了。`}</p>
          </div>
        )}
        {success && (
          <div
            className={`last-scene ${showLastImg ? "last-scene-show" : ""}`}
          ></div>
        )}
      </React.Fragment>
    );
  }
}
