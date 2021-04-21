import { ItemType } from "../../Tools/interface";
import * as React from "react";

interface BagGridProps {
  imgSrc?: string;
  description?: string;
  name?: string;
  active: boolean;
  index: number;
}

interface BagGridState {
  choose: boolean;
}

class BagGrid extends React.Component<BagGridProps, BagGridState> {
  private imgRef = React.createRef<HTMLImageElement>();
  constructor(props: BagGridProps) {
    super(props);
    this.state = { choose: false };
  }

  componentWillReceiveProps(nextProps: BagGridProps) {
    // console.log(nextProps);
  }

  onMouseOver = () => {
    this.setState({ choose: true });
  };

  onMouseLeave = () => {
    this.setState({ choose: false });
  };

  stopPubbling = (e: any) => {
    e.stopPropagation();
  };

  render() {
    const { imgSrc, active, index, description, name } = this.props;
    const { choose } = this.state;
    const show = imgSrc && active && choose;
    return (
      <div
        className="bag-grid"
        data-index={index}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
        style={{
          backgroundColor: show
            ? "rgba(77, 77, 77, 0.932)"
            : "rgb(79 79 79 / 63%)",
        }}
      >
        {imgSrc && (
          <img
            src={imgSrc}
            width={36}
            height={36}
            onMouseOver={this.stopPubbling}
            onMouseLeave={this.stopPubbling}
            ref={this.imgRef}
          ></img>
        )}
        {show && <p>{name}</p>}
      </div>
    );
  }
}

export default BagGrid;
