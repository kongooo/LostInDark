import * as React from "react";

import BagGrid from "./BagGrid";

import { BagItem, ItemType } from "../../Tools/interface";

import { matchData, woodData, powderBoxData } from "./ItemData";
import EventBus from "../../Tools/Event/EventBus";

interface BagProps {
  show: boolean;
}

interface BagState {
  items: Array<BagItem>;
  activeIndex: number;
}

const GRID_COUNT = 40;

class Bag extends React.Component<BagProps, BagState> {
  constructor(props: BagProps) {
    super(props);
    this.state = {
      items: new Array(GRID_COUNT).fill({}),
      activeIndex: -1,
    };
  }

  componentDidMount() {
    EventBus.addEventListener("addItemToBag", this.addItem);
    EventBus.addEventListener("deleteItemFromBag", this.deleteItem);
  }

  componentWillUnmount() {
    EventBus.removeEventListener("addItemToBag");
    EventBus.removeEventListener("deleteItemFromBag");
  }

  addItem = (type: ItemType) => {
    const { items } = this.state;
    let index = -1,
      item;
    while (++index < GRID_COUNT) {
      if (!items[index].count) {
        break;
      }
    }

    switch (type) {
      case ItemType.match:
        item = matchData;
        break;
      case ItemType.wood:
        item = woodData;
        break;
      case ItemType.powderBox:
        item = powderBoxData;
        break;
    }

    if (index !== GRID_COUNT - 1) {
      if (item) {
        items[index] = item;
        this.setState({ items });
        EventBus.dispatch("showHint", getSuccessWord(item.description));
        return;
      }
    }
    if (item) EventBus.dispatch("showHint", getFailedWord(item.description));
  };

  deleteItem = () => {
    const { activeIndex, items } = this.state;
    // console.log(activeIndex);
    if (activeIndex > -1 && items[activeIndex]) {
      if (items[activeIndex].count - 1 <= 0) {
        items[activeIndex] = {};
      }
      this.setState({ items });
    }
  };

  onMouseOver = (e: any) => {
    const index = e.target.dataset.index;
    if (index) {
      this.setState({
        activeIndex: Number(index),
      });
    } else {
      this.setState({
        activeIndex: -1,
      });
    }
  };

  onMouseDown = () => {
    const { activeIndex, items } = this.state;
    if (activeIndex > -1 && items[activeIndex].imgSrc) {
      EventBus.dispatch("BagControl");
      EventBus.dispatch("placeItemToScene", items[activeIndex].type);
      EventBus.dispatch("showHint", "按E放置当前选中物体, Esc放弃本次放置。");
    }
  };

  render() {
    const { items, activeIndex } = this.state;
    return (
      <div
        className="bag-box"
        style={{ display: this.props.show ? "flex" : "none" }}
      >
        <div
          className="bag"
          onMouseOver={this.onMouseOver}
          onMouseDown={this.onMouseDown}
        >
          {items.map((item, key) => (
            <BagGrid
              imgSrc={item.imgSrc}
              count={item.count}
              description={item.description}
              active={activeIndex === key}
              index={key}
              key={key}
            ></BagGrid>
          ))}
        </div>
      </div>
    );
  }
}

const getSuccessWord = (item: string) => `捡到了${item}，放入了背包。`;
const getFailedWord = (item: string) =>
  `捡到了${item}，但是背包已经满了，请取出一件物品后再次放置。`;

export default Bag;
