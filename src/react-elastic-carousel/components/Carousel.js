import React from "react";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill";
import Only from "react-only-when";
import Track from "./Track";
import Arrow from "./Arrow";
import consts from "../consts";
import { firstItemReducer } from "../reducers/items";
import { nextItemAction, prevItemAction } from "../actions/itemsActions";
import {
  SliderContainer,
  Slider,
  StyledCarousel,
  CarouselWrapper
} from "./styled";
import { noop, cssPrefix } from "../utils/helpers";
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
    const { width } = sliderContainerNode.contentRect;
    // update slider container width
    this.setState({ sliderContainerWidth: width }, () => {
      /* based on slider container's width, get num of items to show
      * and calculate child's width (and update it in state)
      */
      let visibleItems = this.getNumOfVisibleItems();
      const childWidth = width / visibleItems;
      this.setState(
        state => ({ childWidth: childWidth }),
        () => {
          /* Based on all of the above new data:
          * update slider position
          * get the new current breakpoint
          * pass the current breakpoint to the consumer's callback
          */
          this.updateSliderPosition();
          const currentBreakPoint = this.getCurrentBreakpoint();
          onResize(currentBreakPoint);
        }
      );
    });
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

  onNextStart = () => {
    const { onNextStart } = this.props;
    const { firstItem } = this.state;
    const nextItemObj = this.getNextItemObj();
    const prevItemObj = this.convertChildToCbObj(firstItem);
    onNextStart(prevItemObj, nextItemObj);
    this.slideNext();
  };

  onPrevStart = () => {
    const { onPrevStart } = this.props;
    const { firstItem } = this.state;
    const nextItemObj = this.getNextItemObj(true);
    const prevItemObj = this.convertChildToCbObj(firstItem);
    onPrevStart(prevItemObj, nextItemObj);
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

  onNextEnd = () => {
    const { onNextEnd } = this.props;
    const { firstItem } = this.state;
    const nextItemObj = this.convertChildToCbObj(firstItem);
    this.removeSliderTransitionHook(this.onNextEnd);
    this.updateActivePage();
    this.setState({ transitioning: false });
    onNextEnd(nextItemObj);
  };

  onPrevEnd = () => {
    const { onPrevEnd } = this.props;
    const { firstItem } = this.state;
    const nextItemObj = this.convertChildToCbObj(firstItem);
    this.removeSliderTransitionHook(this.onPrevEnd);
    this.updateActivePage();
    this.setState({ transitioning: false });
    onPrevEnd(nextItemObj);
  };

  generatePositionUpdater = (direction, nextItemId, rest) => state => {
    const { sliderPosition, childWidth, firstItem } = state;
    let newSliderPosition = 0;
    if (direction === consts.NEXT) {
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
    const { children } = this.props;
    const { firstItem } = this.state;
    const isPrev = firstItem > nextItemId;
    const nextAvailbaleItem = this.getNextItemIndex(firstItem, isPrev);
    const itemsToshow = this.getNumOfVisibleItems();
    const noChange = nextAvailbaleItem === firstItem;
    const outOfBoundry = nextItemId + itemsToshow >= children.length;
    if (noChange) {
      return;
    }
    if (outOfBoundry) {
      nextItemId = children.length - itemsToshow;
    }
    let direction = consts.NEXT;
    let positionEndCb = this.onNextEnd;
    if (isPrev) {
      direction = consts.PREV;
      positionEndCb = this.onPrevEnd;
    }
    const stateUpdater = this.generatePositionUpdater(direction, nextItemId, {
      transitioning: true
    });

    this.setState(stateUpdater, () => {
      // callback
      this.onSliderTransitionEnd(positionEndCb);
    });
  };

  getNumOfPages = () => {
    const { children } = this.props;
    const numOfVisibleItems = this.getNumOfVisibleItems();
    const numOfPages = Math.ceil(children.length / numOfVisibleItems);
    return numOfPages || 1;
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
    const {
      childWidth,
      activePage,
      isSwiping,
      sliderPosition,
      swipedSliderPosition,
      rootHeight
    } = this.state;
    const {
      className,
      style,
      isRTL,
      easing,
      tiltEasing,
      transitionMs,
      children,
      focusOnSelect,
      itemPosition,
      itemPadding,
      enableSwipe,
      enableMouseSwipe,
      pagination,
      showArrows,
      renderArrow
    } = this.props;
    const onSwipedLeft = isRTL ? this.onPrevStart : this.onNextStart;
    const onSwipedRight = isRTL ? this.onNextStart : this.onPrevStart;
    const numOfPages = this.getNumOfPages();

    return (
      <CarouselWrapper
        isRTL={isRTL}
        className={`${cssPrefix("carousel-wrapper")} ${className}`}
        style={style}
      >
        <StyledCarousel className={cssPrefix("carousel")} height={rootHeight}>
          <Only when={showArrows}>
            {renderArrow ? (
              renderArrow({ type: consts.PREV, onClick: this.onPrevStart })
            ) : (
              <Arrow onClick={this.onPrevStart} direction="left" />
            )}
          </Only>
          <SliderContainer
            className={cssPrefix("slider-container")}
            innerRef={this.setRef("sliderContainer")}
          >
            <Slider
              isRTL={isRTL}
              easing={easing}
              sliderPosition={sliderPosition}
              swipedSliderPosition={swipedSliderPosition}
              isSwiping={isSwiping}
              transitionMs={transitionMs}
              tiltEasing={tiltEasing}
              className={cssPrefix("slider")}
              innerRef={this.setRef("slider")}
            >
              <Track
                children={children}
                childWidth={childWidth}
                itemPosition={itemPosition}
                itemPadding={itemPadding}
                enableSwipe={enableSwipe}
                enableMouseSwipe={enableMouseSwipe}
                onSwipedLeft={onSwipedLeft}
                onSwipedRight={onSwipedRight}
                onItemClick={focusOnSelect ? this.goTo : undefined}
              />
            </Slider>
          </SliderContainer>
          <Only when={showArrows}>
            {renderArrow ? (
              renderArrow({ type: consts.NEXT, onClick: this.onNextStart })
            ) : (
              <Arrow onClick={this.onNextStart} direction="right" />
            )}
          </Only>
        </StyledCarousel>
        <Only when={pagination}>
          <Pagination
            numOfPages={numOfPages}
            activePage={activePage}
            onClick={this.onIndicatorClick}
          />
        </Only>
      </CarouselWrapper>
    );
  }
}

Carousel.defaultProps = {
  className: "",
  style: {},
  isRTL: false,
  initialFirstItem: 0,
  showArrows: true,
  pagination: true,
  easing: "cubic-bezier(.76,.57,.73,1)",
  tiltEasing: "cubic-bezier(.58,0,.81,1.32)",
  transitionMs: 500,
  enableTilt: true,
  enableSwipe: true,
  enableMouseSwipe: true,
  focusOnSelect: false,
  itemsToShow: 1,
  itemsToScroll: 1,
  itemPosition: consts.CENTER,
  itemPadding: [0, 0, 0, 0],
  enableAutoPlay: false,
  autoPlaySpeed: 2000,

  // callbacks
  onNextEnd: noop,
  onPrevEnd: noop,
  onNextStart: noop,
  onPrevStart: noop,
  onResize: noop
};

Carousel.propTypes = {
  /** The css class for the root element */
  className: PropTypes.string,

  /** The style object for the root element */
  style: PropTypes.object,

  /** Items to render */
  children: PropTypes.node.isRequired,

  /** Flip right to left */
  isRTL: PropTypes.bool,

  /** Show dots for paging */
  pagination: PropTypes.bool,

  /** Animation speed */
  transitionMs: PropTypes.number,

  /** transition easing pattern */
  easing: PropTypes.string,

  /** transition easing pattern for the tilt */
  tiltEasing: PropTypes.string,

  /** The "bump" animation when reaching the last item */
  enableTilt: PropTypes.bool,

  /** Number of visible items  */
  itemsToShow: PropTypes.number,

  /** Number of items to scroll */
  itemsToScroll: PropTypes.number,

  /** Collection of objects with a width, itemsToShow and itemsToScroll  */
  breakPoints: PropTypes.arrayOf(
    PropTypes.shape({
      width: PropTypes.number,
      itemsToShow: PropTypes.number,
      itemsToScroll: PropTypes.number
    })
  ),

  /** The first items when the component mounts */
  initialFirstItem: PropTypes.number,

  /** Show the arrow buttons */
  showArrows: PropTypes.bool,

  /** Go to item on click */
  focusOnSelect: PropTypes.bool,

  /** A render prop for the arrow component
   * - ({type, onClick}) => <div onClick={onClick}>{type === 'prev' ? '<-' : '->'}</div>
   */
  renderArrow: PropTypes.func,

  /** Position the element relative to it's wrapper (use the consts object) - consts.START | consts.CENTER | consts.END */
  itemPosition: PropTypes.oneOf([consts.START, consts.CENTER, consts.END]),

  /** A padding for each element  */
  itemPadding: PropTypes.array,

  // swipe
  /** Enable or disable swipe */
  enableSwipe: PropTypes.bool,
  /** Enable or disable mouse swipe */
  enableMouseSwipe: PropTypes.bool,

  // auto play
  /** Enable or disable auto play */
  enableAutoPlay: PropTypes.bool,
  /** Set auto play speed (ms) */
  autoPlaySpeed: PropTypes.number,

  // callbacks
  /** A callback for the begining of the next transition
   * - onNextStart(prevItemObj, nextItemObj) => {} */
  onNextStart: PropTypes.func,

  /** A callback for the begining of the prev transition
   * - onPrevStart(prevItemObj, nextItemObj) => {} */
  onPrevStart: PropTypes.func,

  /** A callback for the end of the next transition
   * - onNextEnd(nextItemObj) => {} */
  onNextEnd: PropTypes.func,

  /** A callback for the end of the prev transition
   * - onPrevEnd(nextItemObj) => {} */
  onPrevEnd: PropTypes.func,

  /** A callback for the "slider-container" resize
   * - onResize(currentBreakPoint) => {} */
  onResize: PropTypes.func
};

export default Carousel;
