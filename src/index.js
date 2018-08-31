import React, { Component } from 'react'
import { ResizableBox } from "react-resizable";
import styled from "styled-components";
import Carousel from "./react-elastic-carousel";
import createItems from "./items";

import "./styles.css";

const Poster = styled.div`
  background-image: url(${props => props.src});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 200px;
`;

class Item extends Component {
  onClick = () => {
    const { onClick, id } = this.props;
    onClick(id);
  };
  render() {
    const { title, img, description, active } = this.props;
    return (
      <div
        className={`flex column item ${active ? "active-item" : ""}`}
        onClick={this.onClick}
      >
        <h3 className="item-title">{title}</h3>
        <div className="flex column">
          {img && <Poster src={img} />}
          <div className="item-description">{description}</div>
        </div>
      </div>
    );
  }
}

export default class ExampleComponent extends Component {
  state = {
    numberOfItems: 12,
    items: [],
    currentItem: 0,
    clickedItem: null,
    isRtl: false,
    shouldAutoPlay: false,
    pagination: true,
    showArrows: true,
    customArrows: false,
    viewPort: {
      width: 500,
      height: 250
    }
  };

  componentDidMount() {
    const {
      width,
      height
    } = window.document.documentElement.getBoundingClientRect();
    const items = createItems(this.state.numberOfItems);
    this.setState({ items, viewPort: { width, height } });
  }

  breakpoints = [
    { width: 1, itemsToShow: 1, itemsToScroll: 1 },
    { width: 550, itemsToShow: 2, itemsToScroll: 1 },
    { width: 850, itemsToShow: 3, itemsToScroll: 1 },
    { width: 1150, itemsToShow: 4, itemsToScroll: 1 },
    { width: 1450, itemsToShow: 5, itemsToScroll: 1 },
    { width: 1750, itemsToShow: 6, itemsToScroll: 1 }
  ];

  onItemClick = id => this.setState({ activeItem: id });

  next = () => {
    this.caro.slideNext();
  };

  prev = () => {
    this.caro.slidePrev();
  };

  onItemChange = next => {
    this.setState({ currentItem: next.index });
  };

  setNumberOfItems = ({ target }) => {
    const asNumber = Number(target.value);
    if (Number.isNaN(asNumber) || asNumber < 1) {
      return;
    }
    const items = createItems(asNumber);
    this.setState({ items, numberOfItems: Math.round(asNumber) });
  };

  renderCustomArrow = ({ type, onClick }) => {
    const { isRtl } = this.state;
    let toRender = "";
    if (isRtl) {
      if (type === "prev") {
        toRender = "👉";
      }
      else {
        toRender = "👈";
      }
    } else{
      if (type === "prev") {
        toRender = "👈";
      }
      else {
        toRender = "👉";
      }
    }
    return (
      <div
        style={{ alignSelf: "center", fontSize: "2em", cursor: "pointer" }}
        onClick={onClick}
      >
        {toRender}
      </div>
    );
  };

  toggleState = key => this.setState(({ [key]: value }) => ({ [key]: !value }));

  toggleAutoPlay = () => this.toggleState("shouldAutoPlay");

  toggleRtl = () => this.toggleState("isRtl");

  togglePagination = () => this.toggleState("pagination");

  toggleShowArrows = () => this.toggleState("showArrows");

  toggleCustomArrows = () => this.toggleState("customArrows");

  render() {
    const {
      items,
      numberOfItems,
      currentItem,
      activeItem,
      pagination,
      isRtl,
      shouldAutoPlay,
      showArrows,
      customArrows,
      viewPort
    } = this.state;
    const clickedItem = Number.isNaN(Number(activeItem))
      ? "Not selected"
      : activeItem;
    return (
      <div className={`app flex column`}>
        <div className="flex row props">
          <div className="flex prop-box pointer">
            <input
              className="pointer"
              id="pagination"
              type="checkbox"
              checked={pagination}
              onChange={this.togglePagination}
            />
            <label className="pointer" htmlFor="pagination">
              pagination
            </label>
          </div>
          <div className="flex prop-box">
            <label>{`Number of items `}</label>
            <input
              type="number "
              value={numberOfItems}
              onChange={this.setNumberOfItems}
            />
          </div>
          <div className="flex prop-box pointer">
            <input
              className="pointer"
              id="rtl"
              type="checkbox"
              checked={isRtl}
              onChange={this.toggleRtl}
            />
            <label className="pointer" htmlFor="rtl">
              isRTL
            </label>
          </div>
          <div className="flex prop-box pointer">
            <input
              className="pointer"
              id="autoPlay"
              type="checkbox"
              checked={shouldAutoPlay}
              onChange={this.toggleAutoPlay}
            />
            <label className="pointer" htmlFor="autoPlay">
              autoPlay
            </label>
          </div>
          <div className="flex column prop-box">
            <div>External buttons</div>
            <div className="flex">
              <button onClick={this.prev}>prev</button>|
              <button onClick={this.next}>next</button>
            </div>
          </div>
          <div className="flex prop-box column">
            <div className="flex row">
              <input
                className="pointer"
                id="showArrows"
                type="checkbox"
                checked={showArrows}
                onChange={this.toggleShowArrows}
              />
              <label className="pointer" htmlFor="showArrows">
              show Arrows
              </label>
            </div>
            <div className="flex row">
              <input
                className="pointer"
                id="customArrows"
                type="checkbox"
                checked={customArrows}
                onChange={this.toggleCustomArrows}
              />
              <label className="pointer" htmlFor="customArrows">
                custom arrows
              </label>
            </div>
          </div>
          <div className="flex prop-box">{`Current Index - ${currentItem}`}</div>
          <div className="flex prop-box">{`Clicked index - ${clickedItem}`}</div>
        </div>
        <ResizableBox
          width={viewPort.width - 50}
          height={viewPort.height - 50}
          axis="x"
          maxConstraints={[viewPort.width - 50, viewPort.height]}
          minConstraints={[400, 100]}
        >
          <div className={`flex demo-container ${isRtl && "rtl"}`}>
            <Carousel
              isRTL={isRtl}
              itemPadding={[5]}
              enableAutoPlay={shouldAutoPlay}
              breakPoints={this.breakpoints}
              pagination={pagination}
              initialFirstItem={currentItem}
              onNext={this.onItemChange}
              onPrev={this.onItemChange}
              onUserNext={this.onUserClick}
              onUserPrev={this.onUserClick}
              showArrows={showArrows}
              renderArrow={customArrows ? this.renderCustomArrow : null}
              ref={ref => (this.caro = ref)}
            >
              {items.map(item => (
                <Item
                  key={item.id}
                  {...item}
                  onClick={this.onItemClick}
                  active={item.id === activeItem}
                />
              ))}
            </Carousel>
          </div>
        </ResizableBox>
      </div>
    );
  }
}