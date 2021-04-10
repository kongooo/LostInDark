import * as React from "react";
import * as ReactDOM from "react-dom";
import { GameCanvas } from "./GameCanvas";
import "../css/main.css";

function DrawCanvas() {
  return (
    <GameCanvas
      width={document.body.clientWidth}
      height={document.body.clientHeight}
    ></GameCanvas>
  );
}

ReactDOM.render(<DrawCanvas />, document.querySelector("#root"));
