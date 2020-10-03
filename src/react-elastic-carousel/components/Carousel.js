import React from "react";
import PropTypes from "prop-types";
import ResizeObserver from "resize-observer-polyfill";
import Only from "react-only-when";
import Track from "./Track";
import Arrow from "./Arrow";
import consts from "../consts";
import { activeIndexReducer } from "../reducers/items";
import { nextItemAction, prevItemAction } from "../actions/itemsActions";
import {
  SliderContainer,
  Slider,
  StyledCarousel,
  CarouselWrapper
} from "./styled";
import { pipe, noop, cssPrefix, numberToArray } from "../utils/helpers";
import { Pagination } from "./Pagination";

class Carousel extends React.Component {
  state = {
    rootHeight: 0,
    rootWidth: 0,
    childWidth: 0,
    childHeight: 0,
    sliderPosition: 0,
    swipedSliderPosition: 0,
    isSwiping: false,
    transitioning: false,
    activeIndex: this.props.initialActiveIndex || this.props.initialFirstItem, // support deprecated  initialFirstItem
    pages: [],
    activePage: 0,
    sliderContainerWidth: 0
  };

  componentDidMount() {
    this.initResizeObserver();
    this.updateActivePage();
    this.setPages();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      enableAutoPlay,
      children,
      itemsToShow,
      itemsToScroll,
      breakPoints
    } = this.props;
    const { activeIndex, sliderContainerWidth } = this.state;
    const nextItem = this.getNextItemIndex(activeIndex, false);

    // update pages (for pagination)
    if (
      prevProps.children !== children ||
      prevProps.itemsToShow !== itemsToShow ||
      prevProps.itemsToScroll !== itemsToScroll ||
      prevProps.breakPoints !== breakPoints ||
      sliderContainerWidth !== prevState.sliderContainerWidth
    ) {
      this.setPages();
    }

    // autoplay update
    if (activeIndex === nextItem) {
      this.removeAutoPlay();
    } else if (enableAutoPlay && !this.autoPlayIntervalId) {
      this.setAutoPlay();
    } else if (!enableAutoPlay && this.autoPlayIntervalId) {
      this.removeAutoPlay();
    }

    if (prevProps.children.length > children.length) {
      // number of items is reduced (we don't care if number of items is increased)
      // we need to check if our current index is not out of boundaries
      // we need to include itemsToShow so we can fill up the slots
      const lastIndex = children.length - 1;
      const isOutOfRange = activeIndex + itemsToShow > lastIndex;
      if (isOutOfRange) {
        // we are out of boundaries, go "back" to last item of the list (respect itemsToShow)
        this.goTo(children.length - itemsToShow);
      }
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

  setPages = () => {
    const numOfPages = this.getNumOfPages();
    const pages = numberToArray(numOfPages);
    this.setState({ pages });
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

  /** We might get itemsToShow as a direct prop
   ** Or we might get it as a prop inside a selected breakpoint.
   ***/
  getCalculatedItemsToShow = () => {
    const { itemsToShow } = this.props;
    let visibleItems = itemsToShow;

    const currentBreakPoint = this.getCurrentBreakpoint();
    if (currentBreakPoint) {
      visibleItems = currentBreakPoint.itemsToShow;
    }
    return visibleItems;
  };

  /** We might get itemsToScroll as a direct prop
   ** Or we might get it as a prop inside a selected breakpoint.
   ***/
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
    this.setState((state, props) => {
      const { children, verticalMode } = props;
      const { childWidth, childHeight, activeIndex } = state;
      const totalItems = children.length;
      const numOfVisibleItems = this.getCalculatedItemsToShow();
      const hiddenSlots = totalItems - numOfVisibleItems;
      let moveBy = activeIndex * -1;
      const emptySlots = numOfVisibleItems - (totalItems - activeIndex);
      if (emptySlots > 0 && hiddenSlots > 0) {
        moveBy = emptySlots + activeIndex * -1;
      }
      let sliderPosition = (verticalMode ? childHeight : childWidth) * moveBy;
      const newActiveIndex =
        emptySlots > 0 ? activeIndex - emptySlots : activeIndex;
      return {
        sliderPosition,
        activeIndex: newActiveIndex < 0 ? 0 : newActiveIndex
      };
    });
  };

  onSliderResize = sliderNode => {
    const { verticalMode, children } = this.props;
    const { height } = sliderNode.contentRect;
    const nextState = {};
    if (verticalMode) {
      const numOfVisibleItems = this.getCalculatedItemsToShow();
      const childHeight = height / children.length;
      nextState.rootHeight = childHeight * numOfVisibleItems;
      nextState.childHeight = childHeight;
    } else {
      nextState.rootHeight = height;
    }
    this.setState(nextState);
  };

  onContainerResize = sliderContainerNode => {
    const { onResize, verticalMode } = this.props;
    const { width } = sliderContainerNode.contentRect;
    // update slider container width
    this.setState({ sliderContainerWidth: width }, () => {
      /* based on slider container's width, get num of items to show
      * and calculate child's width (and update it in state)
      */
      const visibleItems = this.getCalculatedItemsToShow();
      const childWidth = verticalMode ? width : width / visibleItems;
      this.setState(
        state => ({ childWidth }),
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

  tiltMovement = (position, distance = 20, duration = 150) => {
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
    // support decimal itemsToShow
    const roundedIdx = Math.round(index);
    const child = children[roundedIdx];
    return { item: child.props, index: roundedIdx };
  };

  getNextItemIndex = (currentIndex, getPrev) => {
    const { children } = this.props;
    const itemsToScroll = this.getItemsToScroll();
    const numOfvisibleItems = this.getCalculatedItemsToShow();
    const notEnoughItemsToshow = numOfvisibleItems > children.length;
    let limit = getPrev ? 0 : children.length - numOfvisibleItems;

    if (notEnoughItemsToshow) {
      limit = 0; // basically don't move
    }
    const nextAction = getPrev
      ? prevItemAction(0, itemsToScroll)
      : nextItemAction(limit, itemsToScroll);
    const nextItem = activeIndexReducer(currentIndex, nextAction);
    return nextItem;
  };

  getNextItemObj = getPrev => {
    const { children } = this.props;
    const { activeIndex } = this.state;
    const nextItemIndex = this.getNextItemIndex(activeIndex, getPrev);
    // support decimal itemsToShow
    const roundedIdx = Math.round(nextItemIndex);
    const asElement = children[roundedIdx];
    const asObj = { item: asElement.props, index: roundedIdx };
    return asObj;
  };

  resetSwipe = () => {
    this.setState({
      swipedSliderPosition: 0,
      transitioning: false,
      isSwiping: false
    });
  };

  onSwiping = data => {
    const { deltaX, absX, deltaY, absY, dir } = data;

    this.setState((state, props) => {
      const {
        rootHeight,
        activeIndex,
        sliderPosition,
        sliderContainerWidth
      } = state;
      const { verticalMode, children, isRTL } = props;
      const itemsToShow = this.getCalculatedItemsToShow();

      // determine how far can user swipe
      const isOnStart = activeIndex === 0;
      const isOnEnd = activeIndex === children.length - itemsToShow;
      const defaultDivider = 1.5;
      const largeDivider = itemsToShow * 2;
      let divider = defaultDivider;
      const goingNext =
        (!verticalMode && dir === "Left" && !isRTL) ||
        (!verticalMode && dir === "Right" && isRTL) ||
        (verticalMode && dir === "Up");
      const goingBack =
        (!verticalMode && dir === "Right" && !isRTL) ||
        (!verticalMode && dir === "Left" && isRTL) ||
        (verticalMode && dir === "Down");

      if ((isOnStart && goingBack) || (isOnEnd && goingNext)) {
        divider = largeDivider;
      }

      let distanceSwipe = verticalMode
        ? rootHeight / divider
        : sliderContainerWidth / divider;

      const isHorizontalSwipe = dir === "Left" || dir === "Right";

      const shouldHorizontalSkipUpdate =
        isHorizontalSwipe && (!verticalMode && absX > distanceSwipe);
      const shouldVerticalSkipUpdate =
        !isHorizontalSwipe && (verticalMode && absY > distanceSwipe);

      if (shouldHorizontalSkipUpdate || shouldVerticalSkipUpdate) {
        // bail out of state update
        return;
      }
      return {
        swipedSliderPosition: isHorizontalSwipe
          ? sliderPosition - deltaX
          : sliderPosition - deltaY,
        isSwiping: true,
        transitioning: true
      };
    });
  };

  onSwiped = data => {
    // we need to handle all scenarios:
    // 1. Horizontal mode - swipe left or right
    // 2. Horizontal mode with RTL - swipe left or right
    // 3. vertical mode - swipe up or down

    const { absX, absY, dir } = data;
    const { childWidth } = this.state;
    const { verticalMode, isRTL } = this.props;
    let func = this.resetSwipe;
    const minSwipeDistance = childWidth / 3;
    const swipedLeft = dir === "Left";
    const swipedRight = dir === "Right";
    const swipedUp = dir === "Up";
    const swipedDown = dir === "Down";
    const verticalGoSwipe =
      verticalMode && (swipedUp || swipedDown) && absY > minSwipeDistance;

    const horizontalGoSwipe =
      !verticalMode && (swipedRight || swipedLeft) && absX > minSwipeDistance;

    let goodToGo = false;
    if (verticalGoSwipe || horizontalGoSwipe) {
      goodToGo = true;
    }

    if (goodToGo) {
      // we should go to a different item
      // determine what method we need to invoke
      if (verticalMode) {
        // up or down
        if (swipedDown) {
          func = this.onPrevStart;
        }
        if (swipedUp) {
          func = this.onNextStart;
        }
      } else {
        // horizontal mode
        if (isRTL) {
          // flip sides
          if (swipedLeft) {
            func = this.onPrevStart;
          }
          if (swipedRight) {
            func = this.onNextStart;
          }
        } else {
          // normal behavior
          if (swipedLeft) {
            func = this.onNextStart;
          }
          if (swipedRight) {
            func = this.onPrevStart;
          }
        }
      }
    }
    // we are not "tilting" on edges, so we need to reset isSwiping and transitioning.
    // otherwise we wont slide back to edge
    this.setState({ isSwiping: false, transitioning: false });
    func({ skipTilt: true });
  };

  onNextStart = options => {
    const { onNextStart } = this.props;
    const { activeIndex } = this.state;
    const nextItemObj = this.getNextItemObj();
    const prevItemObj = this.convertChildToCbObj(activeIndex);
    onNextStart(prevItemObj, nextItemObj);
    this.slideNext(options);
  };

  onPrevStart = options => {
    const { onPrevStart } = this.props;
    const { activeIndex } = this.state;
    const nextItemObj = this.getNextItemObj(true);
    const prevItemObj = this.convertChildToCbObj(activeIndex);
    onPrevStart(prevItemObj, nextItemObj);
    this.slidePrev(options);
  };

  slideNext = (options = {}) => {
    const { skipTilt } = options;
    const { enableTilt } = this.props;
    const { activeIndex, sliderPosition } = this.state;
    const nextItem = this.getNextItemIndex(activeIndex, false);
    if (activeIndex !== nextItem) {
      this.goTo(nextItem);
    } else if (enableTilt && !skipTilt) {
      this.tiltMovement(sliderPosition, 20, 150);
    }
  };

  slidePrev = (options = {}) => {
    const { skipTilt } = options;
    const { activeIndex } = this.state;
    const { enableTilt } = this.props;
    const prevItem = this.getNextItemIndex(activeIndex, true);
    if (activeIndex !== prevItem) {
      this.goTo(prevItem);
    } else if (enableTilt && !skipTilt) {
      this.tiltMovement(0, -20, 150);
    }
  };

  onNextEnd = () => {
    const { onNextEnd, onChange } = this.props;
    const { activeIndex, activePage } = this.state;
    const nextItemObj = this.convertChildToCbObj(activeIndex);
    this.removeSliderTransitionHook(this.onNextEnd);
    this.setState({ transitioning: false });
    onChange && onChange(nextItemObj, activePage);
    onNextEnd(nextItemObj, activePage);
  };

  onPrevEnd = () => {
    const { onPrevEnd, onChange } = this.props;
    const { activeIndex, activePage } = this.state;
    const nextItemObj = this.convertChildToCbObj(activeIndex);
    this.removeSliderTransitionHook(this.onPrevEnd);
    this.setState({ transitioning: false });
    onChange && onChange(nextItemObj, activePage);
    onPrevEnd(nextItemObj, activePage);
  };

  generatePositionUpdater = (
    direction,
    nextItemId,
    verticalMode,
    rest
  ) => state => {
    const { sliderPosition, childWidth, childHeight, activeIndex } = state;
    let newSliderPosition = 0;
    const childSize = verticalMode ? childHeight : childWidth;
    if (direction === consts.NEXT) {
      newSliderPosition =
        sliderPosition - childSize * (nextItemId - activeIndex);
    } else {
      newSliderPosition =
        sliderPosition + childSize * (activeIndex - nextItemId);
    }

    return {
      sliderPosition: newSliderPosition,
      activeIndex: nextItemId,
      swipedSliderPosition: 0,
      isSwiping: false,
      ...rest
    };
  };

  goTo = nextItemId => {
    const { children, verticalMode } = this.props;
    const { activeIndex } = this.state;
    const isPrev = activeIndex > nextItemId;
    const nextAvailbaleItem = this.getNextItemIndex(activeIndex, isPrev);
    const itemsToshow = this.getCalculatedItemsToShow();
    const noChange = nextAvailbaleItem === activeIndex;
    const outOfBoundry = nextItemId + itemsToshow >= children.length;
    if (noChange) {
      return;
    }
    if (outOfBoundry) {
      if (children.length - itemsToshow > 0) {
        nextItemId = children.length - itemsToshow;
      } else {
        nextItemId = Math.max(
          children.length - 1,
          children.length - itemsToshow
        );
      }
    }
    let direction = consts.NEXT;
    let positionEndCb = this.onNextEnd;
    if (isPrev) {
      direction = consts.PREV;
      positionEndCb = this.onPrevEnd;
    }
    const stateUpdater = this.generatePositionUpdater(
      direction,
      nextItemId,
      verticalMode,
      {
        transitioning: true
      }
    );
    this.setState(stateUpdater, () => {
      // callback
      pipe(
        this.updateActivePage(),
        this.onSliderTransitionEnd(positionEndCb)
      );
    });
  };

  getNumOfPages = () => {
    const { children } = this.props;
    const numOfVisibleItems = this.getCalculatedItemsToShow();
    const numOfPages = Math.ceil(children.length / numOfVisibleItems);
    return numOfPages || 1;
  };

  updateActivePage = () => {
    this.setState(state => {
      const { activeIndex, activePage } = state;
      const numOfVisibleItems = this.getCalculatedItemsToShow();
      const newActivePage = Math.ceil(activeIndex / numOfVisibleItems);
      if (activePage !== newActivePage) {
        return { activePage: newActivePage };
      }
    });
  };

  onIndicatorClick = indicatorId => {
    const numOfVisibleItems = this.getCalculatedItemsToShow();
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
      rootHeight,
      pages,
      activeIndex
    } = this.state;
    const {
      className,
      style,
      verticalMode,
      isRTL,
      easing,
      tiltEasing,
      transitionMs,
      children,
      focusOnSelect,
      autoTabIndexVisibleItems,
      itemPosition,
      itemPadding,
      enableSwipe,
      enableMouseSwipe,
      pagination,
      showArrows,
      disableArrowsOnEnd,
      preventDefaultTouchmoveEvent,
      renderArrow,
      renderPagination
    } = this.props;

    const numOfPages = this.getNumOfPages();

    /** Determine if arrows should be disabled */
    const canSlidePrev =
      activeIndex !== this.getNextItemIndex(activeIndex, true);
    const canSlideNext =
      activeIndex !== this.getNextItemIndex(activeIndex, false);
    const disabledPrevArrow = !canSlidePrev && disableArrowsOnEnd;
    const disabledNextArrow = !canSlideNext && disableArrowsOnEnd;

    return (
      <CarouselWrapper
        isRTL={isRTL}
        className={`${cssPrefix("carousel-wrapper")} ${className}`}
        style={style}
      >
        <StyledCarousel
          className={cssPrefix("carousel")}
          size={{ height: rootHeight }}
        >
          <Only when={showArrows}>
            {renderArrow ? (
              renderArrow({
                type: consts.PREV,
                onClick: this.onPrevStart,
                isEdge: !canSlidePrev
              })
            ) : (
              <Arrow
                onClick={this.onPrevStart}
                direction={verticalMode ? Arrow.up : Arrow.left}
                disabled={disabledPrevArrow}
              />
            )}
          </Only>
          <SliderContainer
            className={cssPrefix("slider-container")}
            ref={this.setRef("sliderContainer")}
          >
            <Slider
              verticalMode={verticalMode}
              isRTL={isRTL}
              easing={easing}
              sliderPosition={sliderPosition}
              swipedSliderPosition={swipedSliderPosition}
              isSwiping={isSwiping}
              transitionMs={transitionMs}
              tiltEasing={tiltEasing}
              className={cssPrefix("slider")}
              ref={this.setRef("slider")}
            >
              <Track
                children={children}
                childWidth={childWidth}
                currentItem={activeIndex}
                autoTabIndexVisibleItems={autoTabIndexVisibleItems}
                itemsToShow={this.getCalculatedItemsToShow()}
                itemPosition={itemPosition}
                itemPadding={itemPadding}
                enableSwipe={enableSwipe}
                enableMouseSwipe={enableMouseSwipe}
                preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
                onSwiped={this.onSwiped}
                onSwiping={this.onSwiping}
                onItemClick={focusOnSelect ? this.goTo : undefined}
              />
            </Slider>
          </SliderContainer>
          <Only when={showArrows}>
            {renderArrow ? (
              renderArrow({
                type: consts.NEXT,
                onClick: this.onNextStart,
                isEdge: !canSlideNext
              })
            ) : (
              <Arrow
                onClick={this.onNextStart}
                direction={verticalMode ? Arrow.down : Arrow.right}
                disabled={disabledNextArrow}
              />
            )}
          </Only>
        </StyledCarousel>
        <Only when={pagination}>
          {renderPagination ? (
            renderPagination({
              pages: pages,
              activePage,
              onClick: this.onIndicatorClick
            })
          ) : (
            <Pagination
              numOfPages={numOfPages}
              activePage={activePage}
              onClick={this.onIndicatorClick}
            />
          )}
        </Only>
      </CarouselWrapper>
    );
  }
}

Carousel.defaultProps = {
  className: "",
  style: {},
  verticalMode: false,
  isRTL: false,
  initialFirstItem: 0,
  initialActiveIndex: 0,
  showArrows: true,
  disableArrowsOnEnd: true,
  pagination: true,
  easing: "ease",
  tiltEasing: "ease",
  transitionMs: 500,
  enableTilt: true,
  enableSwipe: true,
  enableMouseSwipe: true,
  preventDefaultTouchmoveEvent: false,
  focusOnSelect: false,
  autoTabIndexVisibleItems: true,
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
  /** Items to render */
  children: PropTypes.node.isRequired,

  /** The css class for the root element */
  className: PropTypes.string,

  /** The style object for the root element */
  style: PropTypes.object,

  /** Display the Carousel in a vertical layout */
  verticalMode: PropTypes.bool,

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
      width: PropTypes.number.isRequired,
      itemsToShow: PropTypes.number,
      itemsToScroll: PropTypes.number
    })
  ),

  /** The initial active index when the component mounts */
  initialActiveIndex: PropTypes.number,

  /** **DEPRECATED - use initialActiveIndex instead** The first items when the component mounts */
  initialFirstItem: PropTypes.number,

  /** Show the arrow buttons */
  showArrows: PropTypes.bool,

  /** Disables the arrow button when there are no more items */
  disableArrowsOnEnd: PropTypes.bool,

  /** Go to item on click */
  focusOnSelect: PropTypes.bool,

  /** Automatically inject `tabIndex:0` to visible items */
  autoTabIndexVisibleItems: PropTypes.bool,

  /** A render prop for the arrow component
   * - ({type, onClick}) => <div onClick={onClick}>{type === 'prev' ? '<-' : '->'}</div>
   */
  renderArrow: PropTypes.func,

  /** A render prop for the pagination component
   * - ({ pages, activePage, onClick }) =>  <YourComponent/>
   */
  renderPagination: PropTypes.func,

  /** Position the element relative to it's wrapper (use the consts object) - consts.START | consts.CENTER | consts.END */
  itemPosition: PropTypes.oneOf([consts.START, consts.CENTER, consts.END]),

  /** A padding for each element  */
  itemPadding: PropTypes.array,

  // swipe
  /** Enable or disable swipe */
  enableSwipe: PropTypes.bool,

  /** Enable or disable mouse swipe */
  enableMouseSwipe: PropTypes.bool,

  /** Prevent page scroll on touchmove.
   * Use this to stop the browser from scrolling while a user swipes.
   * More details: https://github.com/FormidableLabs/react-swipeable#preventdefaulttouchmoveevent-details
   */
  preventDefaultTouchmoveEvent: PropTypes.bool,

  // auto play
  /** Enable or disable auto play */
  enableAutoPlay: PropTypes.bool,

  /** Set auto play speed (ms) */
  autoPlaySpeed: PropTypes.number,

  // callbacks
  /** A callback for the change of an item
   * - onChange(currentItemObject, currentPageIndex) => {} */
  onChange: PropTypes.func,

  /** A callback for the beginning of the next transition
   * - onNextStart(prevItemObject, nextItemObject) => {} */
  onNextStart: PropTypes.func,

  /** A callback for the beginning of the prev transition
   * - onPrevStart(prevItemObject, nextItemObject) => {} */
  onPrevStart: PropTypes.func,

  /** A callback for the end of the next transition
   * - onNextEnd(nextItemObject, currentPageIndex) => {} */
  onNextEnd: PropTypes.func,

  /** A callback for the end of the prev transition
   * - onPrevEnd(nextItemObject, currentPageIndex) => {} */
  onPrevEnd: PropTypes.func,

  /** A callback for the "slider-container" resize
   * - onResize(currentBreakPoint) => {} */
  onResize: PropTypes.func
};

export default Carousel;
