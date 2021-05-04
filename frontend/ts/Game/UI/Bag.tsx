import * as React from "react";

import BagGrid from "./BagGrid";

import { BagItem, ComposeItem, ItemType } from "../../Tools/interface";

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
  constructor(props: BagProps) {
    super(props);
    this.state = {
      items: new Array(GRID_COUNT).fill({}),
      activeIndex: -1,
      conbindActiveIndex: -1,
      conbinaItems: [
        ItemData.fireWoodData(),
        ItemData.firePileData(),
        ItemData.transmitData(),
        ItemData.receiveData(),
      ],
    };
    // this.addItem(ItemType.firePile);
    // this.addItem(ItemType.wood);
    // this.addItem(ItemType.powderBox);
    // this.addItem(ItemType.fireWoods);
    // this.addItem(ItemType.wire);
    // this.addItem(ItemType.wire);
    // this.addItem(ItemType.wire);
    // this.addItem(ItemType.battery);
    // this.addItem(ItemType.battery);
    // this.addItem(ItemType.battery);
    // this.addItem(ItemType.battery);
    // this.addItem(ItemType.circuitBoard);
    // this.addItem(ItemType.circuitBoard);
    // this.addItem(ItemType.match);
    // // this.addItem(ItemType.transmit);
    // // this.addItem(ItemType.receive);
    // this.addItem(ItemType.toast);
    // this.addItem(ItemType.sandwich);
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
        item = ItemData.fireWoodData();
        break;
      case ItemType.firePile:
        item = ItemData.firePileData();
        break;
      case ItemType.battery:
        item = ItemData.batteryData();
        break;
      case ItemType.wire:
        item = ItemData.wireData();
        break;
      case ItemType.circuitBoard:
        item = ItemData.circuitData();
        break;
      case ItemType.receive:
        item = ItemData.receiveData();
        break;
      case ItemType.transmit:
        item = ItemData.transmitData();
        break;
      case ItemType.sandwich:
        item = ItemData.sandwichData();
        break;
      case ItemType.toast:
        item = ItemData.toastData();
        break;
    }

    if (index !== GRID_COUNT) {
      if (item) {
        items[index] = item;
        this.setState({ items });
        if (
          item.type !== ItemType.firePile &&
          item.type !== ItemType.fireWoods
        ) {
          EventBus.dispatch("showHint", getSuccessWord(item.name));
        }
        return true;
      }
    }
    if (item) {
      EventBus.dispatch("showHint", getFailedWord(item.name));
      return false;
    }
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
        case ItemType.receive:
          hintWord =
            "装备了无线电接收设备，从现在开始5分钟内可以接收到对方发射设备的电波啦~";
          break;
        case ItemType.sandwich:
          hintWord = "吃掉了鸡肉三明治，恢复了50生命值o(*°▽°*)o";
          break;
        case ItemType.toast:
          hintWord = "吃掉了鸡蛋吐司，恢复了30生命值( •̀ ω •́ )✧";
          break;
        case ItemType.transmit:
          hintWord =
            "按E放置无线电发射设备, Esc放弃本次放置，特别注意：设备放置后不可移动哦~";
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
      let materialItems: Array<ComposeItem> = [];
      let materailItemsDescrib: string;
      switch (conbinaItems[conbindActiveIndex].type) {
        case ItemType.firePile:
          materialItems.push(
            {
              type: ItemType.fireWoods,
              count: 1,
            },
            {
              type: ItemType.wood,
              count: 3,
            }
          );
          materailItemsDescrib = "一根火把和三块木头";
          break;

        case ItemType.fireWoods:
          materialItems.push(
            {
              type: ItemType.match,
              count: 1,
            },
            {
              type: ItemType.wood,
              count: 1,
            }
          );
          materailItemsDescrib = "一根火柴和一块木头";
          break;

        case ItemType.receive:
          materialItems.push(
            {
              type: ItemType.battery,
              count: 2,
            },
            {
              type: ItemType.wire,
              count: 1,
            },
            {
              type: ItemType.circuitBoard,
              count: 1,
            }
          );
          materailItemsDescrib = "两节电池、一捆电线和一块电路板";
          break;

        case ItemType.transmit:
          materialItems.push(
            {
              type: ItemType.battery,
              count: 2,
            },
            {
              type: ItemType.wire,
              count: 2,
            },
            {
              type: ItemType.circuitBoard,
              count: 1,
            }
          );
          materailItemsDescrib = "两节电池、两捆电线和一块电路板";
          break;
      }

      this.conbinaItem(
        materialItems,
        conbinaItems[conbindActiveIndex].type,
        conbinaItems[conbindActiveIndex].name,
        materailItemsDescrib
      );
    }
  };

  /**
   *
   * @param conbinaItems 合成所需材料
   * @param aimItem 合成目标
   * @param aimItemName 合成目标名称
   * @param failedWord 合成所需材料描述
   */
  private conbinaItem = (
    conbinaItems: Array<ComposeItem>,
    aimItem: ItemType,
    aimItemName: string,
    failedWord: string
  ) => {
    const { items } = this.state;
    let itemsIndex: Array<Array<number>> = conbinaItems.map(() => []);

    for (let index = 0; index < items.length; index++) {
      let enough = true;
      conbinaItems.forEach((item, i) => {
        if (items[index].type === item.type) {
          if (itemsIndex[i].length < item.count) {
            itemsIndex[i].push(index);
          }
        }
        if (itemsIndex[i].length < item.count) {
          enough = false;
        }
      });

      if (enough) {
        break;
      }
    }

    let enough = true;
    itemsIndex.forEach((itemIndex, i) => {
      if (itemIndex.length < conbinaItems[i].count) {
        console.log(itemIndex);
        enough = false;
      }
    });

    if (enough) {
      itemsIndex.map((itemIndex) => {
        itemIndex.map((index) => {
          items[index] = {};
        });
      });
      this.setState({ items });
      this.addItem(aimItem);
      EventBus.dispatch("showHint", `合成了${aimItemName}，放入了背包。`);
    } else {
      EventBus.dispatch("showHint", `材料不足，无法合成，需要${failedWord}哦~`);
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
