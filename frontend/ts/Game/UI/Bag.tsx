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
          EventBus.dispatch("showHint", "?????????????????????~");
        } else {
          EventBus.dispatch(
            "showHint",
            "??????????????????????????????????????????" + items[activeIndex].useCount
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
          hintWord = "???E????????????, Esc?????????????????????";
          break;
        case ItemType.firePile:
          hintWord =
            "???E????????????, Esc??????????????????????????????????????????????????????????????????~";
          break;
        case ItemType.fireWoods:
          hintWord = "?????????????????????????????????~";
          break;
        case ItemType.receive:
          hintWord =
            "????????????????????????????????????????????????5??????????????????????????????????????????????????????~";
          break;
        case ItemType.sandwich:
          hintWord = "????????????????????????????????????50?????????o(*???????*)o";
          break;
        case ItemType.toast:
          hintWord = "?????????????????????????????????30?????????( ????? ?? ????? )???";
          break;
        case ItemType.transmit:
          hintWord =
            "???E???????????????????????????, Esc??????????????????????????????????????????????????????????????????~";
          break;
        default:
          hintWord = "???E????????????????????????, Esc?????????????????????";
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
          materailItemsDescrib = "???????????????????????????";
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
          materailItemsDescrib = "???????????????????????????";
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
          materailItemsDescrib = "?????????????????????????????????????????????";
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
          materailItemsDescrib = "?????????????????????????????????????????????";
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
   * @param conbinaItems ??????????????????
   * @param aimItem ????????????
   * @param aimItemName ??????????????????
   * @param failedWord ????????????????????????
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
      EventBus.dispatch("showHint", `?????????${aimItemName}?????????????????????`);
    } else {
      EventBus.dispatch("showHint", `????????????????????????????????????${failedWord}???~`);
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

const getSuccessWord = (item: string) => `?????????${item}?????????????????????`;
const getFailedWord = (item: string) =>
  `?????????${item}?????????????????????????????????????????????????????????????????????`;

export default Bag;
