import * as React from "react";

interface BagGridProps {
  imgSrc?: string;
  count?: number;
  description?: string;
  active: boolean;
  index: number;
}

interface BagGridState {
  choose: boolean;
}

class BagGrid extends React.Component<BagGridProps, BagGridState> {
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
    const { imgSrc, count, description, active, index } = this.props;
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
          ></img>
        )}
        <span onMouseOver={this.stopPubbling} onMouseLeave={this.stopPubbling}>
          {count}
        </span>
        {show && <p>{description}</p>}
      </div>
    );
  }
}

export default BagGrid;
