import React, { Children } from "react";
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
    childWidth: 0,
    childHeight: 0,
    sliderPosition: 0,
    swipedSliderPosition: 0,
    isSwiping: false,
    transitioning: false,
    transitionMs: this.props.transitionMs,
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
    const currentChildrenLength = Children.toArray(children).length;
    const prevChildrenLength = Children.toArray(prevProps.children).length;
    // update pages (for pagination)
    if (
      prevChildrenLength !== currentChildrenLength ||
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

    if (prevChildrenLength !== currentChildrenLength) {
      const {
        itemsToShow: calculatedItemsToShow
      } = this.getDerivedPropsFromBreakPoint();
      // number of items is reduced (we don't care if number of items is increased)
      // we need to check if our current index is not out of boundaries
      // we need to include itemsToShow so we can fill up the slots
      const lastIndex = currentChildrenLength - 1;
      const isOutOfRange = activeIndex + calculatedItemsToShow > lastIndex;
      if (isOutOfRange) {
        // we are out of boundaries, go "back" to last item of the list (respect itemsToShow)
        this.goTo(Math.max(0, currentChildrenLength - calculatedItemsToShow));
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
          // we are using rAF because it fixes the infinite refresh with gatsby (ssr?).
          // TBH, I'm not sure i fully understand why.
          // see https://github.com/sag1v/react-elastic-carousel/issues/107
          window.requestAnimationFrame(() => {
            this.onContainerResize(entry);
          });
        }
        if (entry.target === this.slider) {
          // we are using rAF because it fixes the infinite refresh with gatsby (ssr?).
          // TBH, I'm not sure i fully understand why
          // see https://github.com/sag1v/react-elastic-carousel/issues/107
          window.requestAnimationFrame(() => {
            this.onSliderResize(entry);
          });
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

  getDerivedPropsFromBreakPoint = () => {
    const { breakPoints, ...restOfProps } = this.props;
    const { sliderContainerWidth } = this.state;

    // default breakpoint from individual props
    let currentBreakPoint;
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
    // merge direct props with current breakpoint Props
    return { ...restOfProps, ...currentBreakPoint };
  };

  updateSliderPosition = () => {
    this.setState(state => {
      const {
        children,
        verticalMode,
        itemsToShow,
        transitionMs
      } = this.getDerivedPropsFromBreakPoint();
      const { childWidth, childHeight, activeIndex } = state;
      const totalItems = Children.toArray(children).length;
      const hiddenSlots = totalItems - itemsToShow;
      let moveBy = activeIndex * -1;
      const emptySlots = itemsToShow - (totalItems - activeIndex);
      if (emptySlots > 0 && hiddenSlots > 0) {
        moveBy = emptySlots + activeIndex * -1;
      }
      let sliderPosition = (verticalMode ? childHeight : childWidth) * moveBy;
      const newActiveIndex =
        emptySlots > 0 ? activeIndex - emptySlots : activeIndex;
      // go back from 0ms to whatever set by the user
      // We were at 0ms because we wanted to disable animation on resize
      // see https://github.com/sag1v/react-elastic-carousel/issues/94
      window.requestAnimationFrame(() => this.setState({ transitionMs }));
      return {
        sliderPosition,
        activeIndex: newActiveIndex < 0 ? 0 : newActiveIndex
      };
    });
  };

  onSliderResize = sliderNode => {
    const {
      verticalMode,
      children,
      itemsToShow
    } = this.getDerivedPropsFromBreakPoint();
    const { height: sliderHeight } = sliderNode.contentRect;
    const nextState = {};
    const childrenLength = Children.toArray(children).length;
    if (verticalMode) {
      const childHeight = sliderHeight / childrenLength;
      // We use Math.min because don't want to make the child smaller
      // if number of children is smaller than itemsToShow.
      // Because we will have "empty slots"
      nextState.rootHeight =
        childHeight * Math.min(childrenLength, itemsToShow);
      nextState.childHeight = childHeight;
    } else {
      nextState.rootHeight = sliderHeight;
    }
    this.setState(nextState);
  };

  onContainerResize = sliderContainerNode => {
    const { width: sliderContainerWidth } = sliderContainerNode.contentRect;
    // update slider container width
    // disable animation on resize see https://github.com/sag1v/react-elastic-carousel/issues/94
    const { sidePadding } = this.getDerivedPropsFromBreakPoint();
    const containerWidth = sliderContainerWidth - sidePadding * 2;
    this.setState(
      { sliderContainerWidth: containerWidth, transitionMs: 0 },
      () => {
        // we must get these props inside setState (get future props because its async)
        const {
          onResize,
          verticalMode,
          itemsToShow,
          children
        } = this.getDerivedPropsFromBreakPoint();

        /* based on slider container's width, get num of items to show
        * and calculate child's width (and update it in state)
        */
        const childrenLength = Children.toArray(children).length;
        let childWidth = 0;
        if (verticalMode) {
          childWidth = containerWidth;
        } else {
          // We use Math.min because don't want to make the child smaller
          // if number of children is smaller than itemsToShow.
          // Because we will have "empty slots"
          childWidth = containerWidth / Math.min(childrenLength, itemsToShow);
        }

        this.setState(
          state => ({ childWidth }),
          () => {
            /* Based on all of the above new data:
            * update slider position
            * get the new current breakpoint
            * pass the current breakpoint to the consumer's callback
            */
            this.updateSliderPosition();
            const currentBreakPoint = this.getDerivedPropsFromBreakPoint();
            onResize(currentBreakPoint);
          }
        );
      }
    );
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
    const child = Children.toArray(children)[roundedIdx];
    return { item: child.props, index: roundedIdx };
  };

  getNextItemIndex = (currentIndex, getPrev) => {
    const {
      children,
      itemsToShow,
      itemsToScroll
    } = this.getDerivedPropsFromBreakPoint();
    const childrenLength = Children.toArray(children).length;
    const notEnoughItemsToShow = itemsToShow > childrenLength;
    let limit = getPrev ? 0 : childrenLength - itemsToShow;

    if (notEnoughItemsToShow) {
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
    const asElement = Children.toArray(children)[roundedIdx];
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

    this.setState(state => {
      const {
        rootHeight,
        activeIndex,
        sliderPosition,
        sliderContainerWidth
      } = state;
      const {
        itemsToShow,
        verticalMode,
        children,
        isRTL
      } = this.getDerivedPropsFromBreakPoint();

      // determine how far can user swipe
      const childrenLength = Children.toArray(children).length;
      const isOnStart = activeIndex === 0;
      const isOnEnd = activeIndex === childrenLength - itemsToShow;
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

      const distanceSwipe = verticalMode
        ? rootHeight / divider
        : sliderContainerWidth / divider;

      const horizontalSwipe = dir === "Left" || dir === "Right";
      const verticalSwipe = dir === "Up" || dir === "Down";
      const horizontalMode = !verticalMode;

      const shouldHorizontalSkipUpdate =
        (horizontalMode && verticalSwipe) ||
        (horizontalMode && horizontalSwipe && absX > distanceSwipe);

      const shouldVerticalSkipUpdate =
        (verticalMode && horizontalSwipe) ||
        (verticalMode && verticalSwipe && absY > distanceSwipe);

      if (shouldHorizontalSkipUpdate || shouldVerticalSkipUpdate) {
        // bail out of state update
        return;
      }
      let swipedSliderPosition;
      if (horizontalSwipe) {
        if (isRTL) {
          swipedSliderPosition = sliderPosition + deltaX;
        } else {
          swipedSliderPosition = sliderPosition - deltaX;
        }
      } else {
        swipedSliderPosition = sliderPosition - deltaY;
      }
      return {
        swipedSliderPosition,
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
    const { childWidth, childHeight } = this.state;
    const { verticalMode, isRTL } = this.props;
    let func = this.resetSwipe;
    const minSwipeDistanceHorizontal = childWidth / 3;
    const minSwipeDistanceVertical = childHeight / 3;
    const swipedLeft = dir === "Left";
    const swipedRight = dir === "Right";
    const swipedUp = dir === "Up";
    const swipedDown = dir === "Down";
    const verticalGoSwipe =
      verticalMode &&
      (swipedUp || swipedDown) &&
      absY > minSwipeDistanceVertical;

    const horizontalGoSwipe =
      !verticalMode &&
      (swipedRight || swipedLeft) &&
      absX > minSwipeDistanceHorizontal;

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
    const {
      children,
      verticalMode,
      itemsToShow
    } = this.getDerivedPropsFromBreakPoint();
    const { activeIndex } = this.state;
    const childrenLength = Children.toArray(children).length;
    const isPrev = activeIndex > nextItemId;
    const nextAvailbaleItem = this.getNextItemIndex(activeIndex, isPrev);
    const noChange = nextAvailbaleItem === activeIndex;
    const outOfBoundry = nextItemId + itemsToShow >= childrenLength;
    if (noChange) {
      return;
    }
    if (outOfBoundry) {
      // Either go to last index (respect itemsToShow) or 0 index if we can't fill the slider
      nextItemId = Math.max(0, childrenLength - itemsToShow);
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
    const { children, itemsToShow } = this.getDerivedPropsFromBreakPoint();
    const childrenLength = Children.toArray(children).length;
    const numOfPages = Math.ceil(childrenLength / itemsToShow);
    return numOfPages || 1;
  };

  updateActivePage = () => {
    this.setState(state => {
      const { itemsToShow } = this.getDerivedPropsFromBreakPoint();
      const { activeIndex, activePage } = state;
      const newActivePage = Math.ceil(activeIndex / itemsToShow);
      if (activePage !== newActivePage) {
        return { activePage: newActivePage };
      }
    });
  };

  onIndicatorClick = indicatorId => {
    const { itemsToShow } = this.getDerivedPropsFromBreakPoint();
    const gotoIndex = indicatorId * itemsToShow;
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
      activeIndex,
      transitionMs
    } = this.state;
    const {
      className,
      style,
      itemsToShow,
      verticalMode,
      isRTL,
      easing,
      tiltEasing,
      children,
      focusOnSelect,
      autoTabIndexVisibleItems,
      itemPosition,
      itemPadding,
      sidePadding,
      enableSwipe,
      enableMouseSwipe,
      pagination,
      showArrows,
      disableArrowsOnEnd,
      preventDefaultTouchmoveEvent,
      renderArrow,
      renderPagination
    } = this.getDerivedPropsFromBreakPoint();

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
              sidePadding={sidePadding}
            >
              <Track
                verticalMode={verticalMode}
                children={Children.toArray(children)}
                childWidth={childWidth}
                currentItem={activeIndex}
                autoTabIndexVisibleItems={autoTabIndexVisibleItems}
                itemsToShow={itemsToShow}
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
  sidePadding: 0,
  enableAutoPlay: false,
  autoPlaySpeed: 2000,

  // callbacks
  onChange: noop,
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

  /** A side padding at each side of the carousel */
  sidePadding: PropTypes.number,

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
