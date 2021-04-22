import * as React from "react";

import BagGrid from "./BagGrid";

import { BagItem, ItemType } from "../../Tools/interface";

import ItemData from "./ItemData";
import EventBus from "../../Tools/Event/EventBus";

interface BagProps {
  show: boolean;
}

interface BagState {
  items: Array<BagItem>;
  conbinaItems: Array<BagItem>;
  activeIndex: number;
  conbindActiveIndex: number;
}

const GRID_COUNT = 40;

class Bag extends React.Component<BagProps, BagState> {
  private drag: boolean;
  constructor(props: BagProps) {
    super(props);
    this.state = {
      items: new Array(GRID_COUNT).fill({}),
      activeIndex: -1,
      conbindActiveIndex: -1,
      conbinaItems: [ItemData.fireWoodData(), ItemData.firePileData()],
    };
    this.addItem(ItemType.firePile);
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
      if (!items[index].imgSrc) {
        break;
      }
    }

    switch (type) {
      case ItemType.match:
        item = ItemData.matchData();
        break;
      case ItemType.wood:
        item = ItemData.woodData();
        break;
      case ItemType.powderBox:
        item = ItemData.powderBoxData();
        break;
      case ItemType.fireWoods:
        console.log("火把");
        item = ItemData.fireWoodData();
        break;
      case ItemType.firePile:
        console.log("火堆");
        item = ItemData.firePileData();
        break;
    }

    if (index !== GRID_COUNT - 1) {
      if (item) {
        items[index] = item;
        this.setState({ items });
        if (item.type !== ItemType.firePile && item.type !== ItemType.fireWoods)
          EventBus.dispatch("showHint", getSuccessWord(item.name));
        return;
      }
    }
    if (item) EventBus.dispatch("showHint", getFailedWord(item.name));
  };

  deleteItem = () => {
    const { activeIndex, items } = this.state;
    // console.log(activeIndex);
    if (activeIndex > -1 && items[activeIndex]) {
      if (items[activeIndex].type === ItemType.powderBox) {
        if (--items[activeIndex].useCount <= 0) {
          items[activeIndex] = {};
          EventBus.dispatch("showHint", "这盒粉末用光了~");
        } else {
          EventBus.dispatch(
            "showHint",
            "倒了一次粉末，剩余使用次数：" + items[activeIndex].useCount
          );
        }
      } else {
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

  onConbinaMouseOver = (e: any) => {
    const index = e.target.dataset.index;
    if (index) {
      this.setState({
        conbindActiveIndex: Number(index),
      });
    } else {
      this.setState({
        conbindActiveIndex: -1,
      });
    }
  };

  onClick = () => {
    const { activeIndex, items } = this.state;
    if (activeIndex > -1 && items[activeIndex].imgSrc) {
      EventBus.dispatch("BagControl");
      EventBus.dispatch("placeItemToScene", items[activeIndex].type);
      let hintWord: string;
      switch (items[activeIndex].type) {
        case ItemType.powderBox:
          hintWord = "按E倾倒粉末, Esc放弃本次倾倒。";
          break;
        case ItemType.firePile:
          hintWord =
            "按E放置火堆, Esc放弃本次放置，特别注意：火堆放置后不可移动哦~";
          break;
        case ItemType.fireWoods:
          hintWord = "装备了火把，视野更大了~";
          break;
        default:
          hintWord = "按E放置当前选中物体, Esc放弃本次放置。";
          break;
      }
      EventBus.dispatch("showHint", hintWord);
    }
  };

  onConbinaClick = () => {
    const { conbindActiveIndex, conbinaItems, items } = this.state;
    if (conbindActiveIndex > -1 && conbinaItems[conbindActiveIndex].imgSrc) {
      switch (conbinaItems[conbindActiveIndex].type) {
        case ItemType.firePile:
          let fireWoodIndex: number,
            woodsIndex: Array<number> = [];

          for (let index = 0; index < items.length; index++) {
            if (items[index].type === ItemType.fireWoods) {
              fireWoodIndex = index;
            } else if (items[index].type === ItemType.wood) {
              if (woodsIndex.length < 3) {
                woodsIndex.push(index);
              }
            }
            if (fireWoodIndex !== undefined && woodsIndex.length === 3) {
              break;
            }
          }

          if (fireWoodIndex !== undefined && woodsIndex.length === 3) {
            items[fireWoodIndex] = {};
            woodsIndex.map((index) => (items[index] = {}));
            this.setState({ items });
            this.addItem(ItemType.firePile);
            EventBus.dispatch("showHint", "合成了火堆，放入了背包。");
          } else {
            EventBus.dispatch(
              "showHint",
              "材料不足，无法合成，需要一根火把和三块木头哦~"
            );
          }

          break;

        case ItemType.fireWoods:
          let matchIndex: number, woodIndex: number;
          for (let index = 0; index < items.length; index++) {
            if (items[index].type === ItemType.match) {
              matchIndex = index;
            } else if (items[index].type === ItemType.wood) {
              woodIndex = index;
            }
            if (matchIndex !== undefined && woodIndex !== undefined) {
              break;
            }
          }

          if (matchIndex !== undefined && woodIndex !== undefined) {
            items[matchIndex] = {};
            items[woodIndex] = {};
            this.setState({ items });
            this.addItem(ItemType.fireWoods);
            EventBus.dispatch("showHint", "合成了火把，放入了背包。");
          } else {
            EventBus.dispatch(
              "showHint",
              "材料不足，无法合成，需要一根火柴和一块木头哦~"
            );
          }
          break;
      }
    }
  };

  render() {
    const { items, activeIndex, conbinaItems, conbindActiveIndex } = this.state;
    return (
      <div
        className="bag-box"
        style={{ display: this.props.show ? "flex" : "none" }}
      >
        <div
          className="bag"
          onMouseOver={this.onMouseOver}
          onClick={this.onClick}
        >
          {items.map((item, key) => (
            <BagGrid
              imgSrc={item.imgSrc}
              description={item.description}
              name={item.name}
              active={activeIndex === key}
              index={key}
              key={key}
            ></BagGrid>
          ))}
        </div>

        <div
          className="bag-conbina-box"
          onMouseOver={this.onConbinaMouseOver}
          style={{ right: (document.body.clientWidth - 520) / 2 - 90 }}
          onClick={this.onConbinaClick}
        >
          {conbinaItems.map((item, index) => (
            <BagGrid
              imgSrc={item.imgSrc}
              active={conbindActiveIndex === index}
              index={index}
              name={item.name}
              key={index}
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
