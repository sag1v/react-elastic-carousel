import React from "react";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill";
import Only from "react-only-when";
import Track from "./Track";
import Arrow from "./Arrow";
import { firstItemReducer } from "../reducers/items";
import { nextItemAction, prevItemAction } from "../actions/itemsActions";
import { flex, row, overflowHidden } from "./styleRules";
import { noop } from "../utils/helpers";
import { Pagination } from "./Pagination";

class Carousel extends React.Component {
  state = {
    rootHeight: 0,
    childWidth: 0,
    sliderPosition: 0,
    swipedSliderPosition: 0,
    isSwiping: false,
    transitioning: false,
    firstItem: this.props.initialFirstItem,
    activePage: 0,
    sliderContainerWidth: 0
  };

  componentDidMount() {
    this.initResizeObserver();
    this.updateActivePage();
  }

  componentDidUpdate(prevProps, prevState) {
    const { enableAutoPlay } = this.props;
    const { firstItem } = this.state;
    const nextItem = this.getNextItemIndex(firstItem, false);

    // pagination update
    if (prevState.firstItem !== firstItem) {
      this.updateActivePage();
    }

    // autoplay update
    if (firstItem === nextItem) {
      this.removeAutoPlay();
    } else if (enableAutoPlay && !this.autoPlayIntervalId) {
      this.setAutoPlay();
    } else if (!enableAutoPlay && this.autoPlayIntervalId) {
      this.removeAutoPlay();
    }
  }

  componentWillUnmount() {
    this.unSubscribeObserver();
  }

  setRef = name => ref => (this[name] = ref);

  initResizeObserver = () => {
    this.ro = new ResizeObserver((entries, observer) => {
      for (const entry of entries) {
        if (entry.target === this.sliderContainer) {
          this.onContainerResize(entry);
        }
        if (entry.target === this.slider) {
          this.onSliderResize(entry);
        }
      }
    });

    this.ro.observe(this.sliderContainer);
    this.ro.observe(this.slider);
  };

  unSubscribeObserver = () => this.ro.disconnect();

  setAutoPlay = () => {
    const { autoPlaySpeed } = this.props;
    this.autoPlayIntervalId = setInterval(() => {
      const { transitioning } = this.state;
      if (!transitioning) {
        this.slideNext();
      }
    }, autoPlaySpeed);
  };

  removeAutoPlay = () => {
    if (this.autoPlayIntervalId) {
      clearInterval(this.autoPlayIntervalId);
      this.autoPlayIntervalId = null;
    }
  };

  onSliderTransitionEnd = fn => {
    this.slider.addEventListener("transitionend", fn);
  };

  removeSliderTransitionHook = fn => {
    this.slider.removeEventListener("transitionend", fn);
  };

  getCurrentBreakpoint = () => {
    const { breakPoints, itemsToShow, itemsToScroll } = this.props;
    const { sliderContainerWidth } = this.state;

    // default breakpoint from individual props
    let currentBreakPoint = { itemsToScroll, itemsToShow };

    // if breakpoints were added as props override the individual props
    if (breakPoints && breakPoints.length > 0) {
      currentBreakPoint = breakPoints
        .slice() // no mutations
        .reverse() // so we can find last match
        .find(bp => bp.width <= sliderContainerWidth);
      if (!currentBreakPoint) {
        /* in case we don't have a lower width than sliderContainerWidth
        * this mostly happens in initilization when sliderContainerWidth is 0
        */
        currentBreakPoint = breakPoints[0];
      }
    }
    return currentBreakPoint;
  };

  getNumOfVisibleItems = () => {
    const { itemsToShow } = this.props;
    let visibleItems = itemsToShow;

    const currentBreakPoint = this.getCurrentBreakpoint();
    if (currentBreakPoint) {
      visibleItems = currentBreakPoint.itemsToShow;
    }
    return visibleItems;
  };

  getItemsToScroll = () => {
    const { itemsToScroll } = this.props;
    const currentBreakPoint = this.getCurrentBreakpoint();
    let effectiveItemsToScroll = itemsToScroll;
    if (currentBreakPoint && currentBreakPoint.itemsToScroll) {
      effectiveItemsToScroll = currentBreakPoint.itemsToScroll;
    }
    return effectiveItemsToScroll;
  };

  updateSliderPosition = () => {
    const { children } = this.props;
    const totalItems = children.length;
    const numOfVisibleItems = this.getNumOfVisibleItems();

    this.setState(state => {
      const { childWidth, firstItem } = state;
      let moveBy = firstItem * -1;
      const emptySlots = numOfVisibleItems - (totalItems - firstItem);
      if (emptySlots > 0) {
        moveBy = emptySlots + firstItem * -1;
      }
      let sliderPosition = childWidth * moveBy;
      const newFirstItem = emptySlots > 0 ? firstItem - emptySlots : firstItem;
      return {
        sliderPosition,
        firstItem: newFirstItem
      };
    });
  };

  onSliderResize = sliderNode => {
    const { height } = sliderNode.contentRect;
    this.setState({ rootHeight: height });
  };

  onContainerResize = sliderContainerNode => {
    const { onResize } = this.props;
    const currentBreakPoint = this.getCurrentBreakpoint();
    const { width } = sliderContainerNode.contentRect;
    let visibleItems = this.getNumOfVisibleItems();
    const childWidth = width / visibleItems;
    this.setState(
      state => ({ childWidth, sliderContainerWidth: width }),
      () => this.updateSliderPosition()
    );

    onResize(currentBreakPoint);
  };

  carouselStyle = () => {
    const { rootHeight } = this.state;
    return {
      ...flex,
      ...row,
      width: "100%",
      height: rootHeight
    };
  };

  sliderContainerStyle = () => ({
    ...overflowHidden,
    position: "relative",
    width: "100%",
    margin: "0 10px"
  });

  baseSliderStyle = () => {
    const { transitionMs, easing, tiltEasing } = this.props;
    const { isSwiping } = this.state;
    const duration = isSwiping ? 250 : transitionMs;
    const effectiveEasing = isSwiping ? tiltEasing : easing;
    return {
      ...flex,
      position: "absolute",
      transition: `all ${duration}ms ${effectiveEasing}`
    };
  };

  sliderStyle = () => {
    const { isRTL } = this.props;
    const { sliderPosition, swipedSliderPosition, isSwiping } = this.state;
    let style = this.baseSliderStyle();
    if (isRTL) {
      style.left = "auto";
      style.right = isSwiping ? swipedSliderPosition : sliderPosition;
    } else {
      style.right = "auto";
      style.left = isSwiping ? swipedSliderPosition : sliderPosition;
    }
    return style;
  };

  tiltMoveMent = (position, distance = 20, duration = 150) => {
    this.setState(state => {
      return {
        isSwiping: true,
        swipedSliderPosition: position - distance
      };
    });
    setTimeout(() => {
      this.setState({
        isSwiping: false,
        swipedSliderPosition: 0
      });
    }, duration);
  };

  convertChildToCbObj = index => {
    const { children } = this.props;
    const child = children[index];
    return { item: child.props, index };
  };

  getNextItemIndex = (currentIndex, getPrev) => {
    const { children } = this.props;
    const itemsToScroll = this.getItemsToScroll();
    const numOfvisibleItems = this.getNumOfVisibleItems();
    const limit = getPrev ? 0 : children.length - numOfvisibleItems;
    const nextAction = getPrev
      ? prevItemAction(0, itemsToScroll)
      : nextItemAction(limit, itemsToScroll);
    const nextItem = firstItemReducer(currentIndex, nextAction);
    return nextItem;
  };

  getNextItemObj = getPrev => {
    const { children } = this.props;
    const { firstItem } = this.state;
    const nextItemIndex = this.getNextItemIndex(firstItem, getPrev);
    const asElement = children[nextItemIndex];
    const asObj = { item: asElement.props, index: nextItemIndex };
    return asObj;
  };

  onUserNext = () => {
    const { onUserNext } = this.props;
    const { firstItem } = this.state;
    const nextItemObj = this.getNextItemObj();
    const prevItemObj = this.convertChildToCbObj(firstItem);
    onUserNext(prevItemObj, nextItemObj);
    this.slideNext();
  };

  onUserPrev = () => {
    const { onUserPrev } = this.props;
    const { firstItem } = this.state;
    const nextItemObj = this.getNextItemObj(true);
    const prevItemObj = this.convertChildToCbObj(firstItem);
    onUserPrev(prevItemObj, nextItemObj);
    this.slidePrev();
  };

  slideNext = () => {
    const { enableTilt } = this.props;
    const { firstItem, sliderPosition } = this.state;
    const nextItem = this.getNextItemIndex(firstItem, false);
    if (firstItem !== nextItem) {
      this.goTo(nextItem);
    } else if (enableTilt) {
      this.tiltMoveMent(sliderPosition, 20, 150);
    }
  };

  slidePrev = () => {
    const { firstItem } = this.state;
    const { enableTilt } = this.props;
    const prevItem = this.getNextItemIndex(firstItem, true);
    if (firstItem !== prevItem) {
      this.goTo(prevItem);
    } else if (enableTilt) {
      this.tiltMoveMent(0, -20, 150);
    }
  };

  onNextCb = () => {
    const { onNext } = this.props;
    const { firstItem } = this.state;
    const nextItemObj = this.convertChildToCbObj(firstItem);
    onNext(nextItemObj);
    this.removeSliderTransitionHook(this.onNextCb);
    this.setState({ transitioning: false });
  };

  onPrevCb = () => {
    const { onPrev } = this.props;
    const { firstItem } = this.state;
    const nextItemObj = this.convertChildToCbObj(firstItem);
    onPrev(nextItemObj);
    this.removeSliderTransitionHook(this.onPrevCb);
    this.setState({ transitioning: false });
  };

  generatePositionUpdater = (direction, nextItemId, rest) => state => {
    const { sliderPosition, childWidth, firstItem } = state;
    let newSliderPosition = 0;
    if (direction === "next") {
      newSliderPosition =
        sliderPosition - childWidth * (nextItemId - firstItem);
    } else {
      newSliderPosition =
        sliderPosition + childWidth * (firstItem - nextItemId);
    }

    return {
      sliderPosition: newSliderPosition,
      firstItem: nextItemId,
      swipedSliderPosition: 0,
      isSwiping: false,
      ...rest
    };
  };

  goTo = nextItemId => {
    const { firstItem } = this.state;
    const isPrev = firstItem > nextItemId;
    const indexToPass = isPrev ? nextItemId + 1 : nextItemId - 1;
    const nextAvailbaleItem = this.getNextItemIndex(indexToPass, isPrev);
    if (nextAvailbaleItem === firstItem) {
      return;
    }
    let direction = "next";
    let cb = this.onNextCb;
    if (isPrev) {
      direction = "prev";
      cb = this.onPrevCb;
    }
    const stateUpdater = this.generatePositionUpdater(
      direction,
      nextAvailbaleItem,
      { transitioning: true }
    );
    this.setState(stateUpdater, () => {
      // callback
      this.onSliderTransitionEnd(cb);
    });
  };

  getNumOfPages = () => {
    const { children } = this.props;
    const numOfVisibleItems = this.getNumOfVisibleItems();
    const numOfPages = Math.ceil(children.length / numOfVisibleItems);
    return numOfPages;
  };

  updateActivePage = () => {
    this.setState(state => {
      const { firstItem, activePage } = state;
      const numOfVisibleItems = this.getNumOfVisibleItems();
      const newActivePage = Math.ceil(firstItem / numOfVisibleItems);
      if (activePage !== newActivePage) {
        return { activePage: newActivePage };
      }
    });
  };

  onIndicatorClick = indicatorId => {
    const numOfVisibleItems = this.getNumOfVisibleItems();
    const gotoIndex = indicatorId * numOfVisibleItems;
    this.setState({ activePage: indicatorId });
    this.goTo(gotoIndex);
  };

  render() {
    const { childWidth, activePage } = this.state;
    const {
      isRTL,
      children,
      focusOnSelect,
      itemPadding,
      enableSwipe,
      enableMouseSwipe,
      pagination,
      showArrows,
      renderArrow
    } = this.props;
    const onSwipedLeft = isRTL ? this.slidePrev : this.slideNext;
    const onSwipedRight = isRTL ? this.slideNext : this.slidePrev;
    const numOfPages = this.getNumOfPages();

    return (
      <React.Fragment>
        <div
          className="c-carousel-wrapper"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%"
          }}
        >
          <div className="c-carousel" style={this.carouselStyle()}>
            <Only when={showArrows}>
              {renderArrow ? (
                renderArrow({ type: "prev", onClick: this.onUserPrev })
              ) : (
                  <Arrow onClick={this.onUserPrev} direction="left" />
                )}
            </Only>
            <div
              className="c-slider-container"
              style={this.sliderContainerStyle()}
              ref={this.setRef("sliderContainer")}
            >
              <div
                ref={this.setRef("slider")}
                className="c-slider"
                style={this.sliderStyle()}
              >
                <Track
                  children={children}
                  childWidth={childWidth}
                  itemPadding={itemPadding}
                  enableSwipe={enableSwipe}
                  enableMouseSwipe={enableMouseSwipe}
                  onSwipedLeft={onSwipedLeft}
                  onSwipedRight={onSwipedRight}
                  onItemClick={focusOnSelect ? this.goTo : undefined}
                />
              </div>
            </div>
            <Only when={showArrows}>
              {renderArrow ? (
                renderArrow({ type: "next", onClick: this.onUserNext })
              ) : (
                  <Arrow onClick={this.onUserNext} direction="right" />
                )}
            </Only>
          </div>
          <Only when={pagination}>
            <Pagination
              numOfPages={numOfPages}
              activePage={activePage}
              onClick={this.onIndicatorClick}
            />
          </Only>
        </div>
      </React.Fragment>
    );
  }
}

Carousel.defaultProps = {
  isRTL: false,
  initialFirstItem: 0,
  showArrows: true,
  easing: "cubic-bezier(.76,.57,.73,1)",
  tiltEasing: "cubic-bezier(.58,0,.81,1.32)",
  transitionMs: 500,
  enableTilt: true,
  enableSwipe: true,
  enableMouseSwipe: true,
  focusOnSelect: false,
  itemsToShow: 1,
  itemsToScroll: 1,
  itemPadding: [0, 0, 0, 0],
  enableAutoPlay: false,
  autoPlaySpeed: 2000,

  //callbacks
  onNext: noop,
  onPrev: noop,
  onUserNext: noop,
  onUserPrev: noop,
  onResize: noop
};

Carousel.propTypes = {
  isRTL: PropTypes.bool,
  easing: PropTypes.string,
  tiltEasing: PropTypes.string,
  transitionMs: PropTypes.number,
  enableTilt: PropTypes.bool,
  itemsToShow: PropTypes.number,
  itemsToScroll: PropTypes.number,
  breakPoints: PropTypes.array,
  initialFirstItem: PropTypes.number,
  showArrows: PropTypes.bool,
  focusOnSelect: PropTypes.bool,
  renderArrow: PropTypes.func,
  // TODO: item position ["start","center","end"]
  itemPadding: PropTypes.array,

  // swipe
  enableSwipe: PropTypes.bool,
  enableMouseSwipe: PropTypes.bool,

  // auto play
  enableAutoPlay: PropTypes.bool,
  autoPlaySpeed: PropTypes.number,

  //callbacks
  onNext: PropTypes.func,
  onPrev: PropTypes.func,
  onUserNext: PropTypes.func,
  onUserPrev: PropTypes.func,
  onResize: PropTypes.func
};

export default Carousel;
