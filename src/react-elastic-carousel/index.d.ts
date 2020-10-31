import * as React from "react";

export type RenderArrowProps = {
  type: "PREV" | "NEXT";
  onClick: () => void;
  isEdge: boolean;
};

export type RenderPaginationProps = {
  pages: number[];
  activePage: number;
  // The onClick event that sets the state of the carousel and sends
  // it to a specific page.
  onClick: (indicatorId: string) => void;
};

export type ItemObject = {
  // Children's props
  object: any;
  index: number;
};

export type Breakpoint = {
  itemsToScroll: number;
  itemsToShow: number;
};

export interface ReactElasticCarouselProps {
  className?: string;
  // Defaults to 1
  itemsToShow?: number;
  // Defaults to false
  verticalMode?: boolean;
  // Defaults to true
  pagination?: boolean;
  // Defaults to 500
  transitionMs?: number;
  // Defaults to "ease"
  easing?: string;
  // Defaults to "ease"
  tiltEasing?: string;
  // Defaults to true.
  enableTilt?: boolean;
  // Defaults to 1
  itemsToScroll?: number;
  // Collection of objects with a width, itemsToShow and itemsToScroll
  breakPoints?: {
    width: number;
    itemsToShow?: number;
    itemsToScroll?: number;
  }[];
  // Defaults to 0
  initialActiveIndex?: number;
  // Defaults to 0
  initialFirstItem?: number;
  // Defaults to true
  showArrows?: boolean;
  // Defaults to true
  disableArrowsOnEnd?: boolean;
  // Defaults to boolean
  focusOnSelect?: boolean;
  // Function to generate your own navigation arrows.
  renderArrow?: (props: RenderArrowProps) => void;
  // Function to generate your own pagination component.
  renderPagination?: (props: RenderPaginationProps) => JSX.Element;
  // Defaults to "CENTER"
  itemPosition?: "START" | "CENTER" | "END";
  // A padding for each element - Defaults to [0,0,0,0]
  itemPadding?: number[];
  // Enable or disable swipe - Defaults to true
  enableSwipe?: boolean;
  /** Enable or disable mouse swipe */
  enableMouseSwipe?: boolean;
  /** Prevent page scroll on touchmove.
   * Use this to stop the browser from scrolling while a user swipes.
   * More details: https://github.com/FormidableLabs/react-swipeable#preventdefaulttouchmoveevent-details
   */
  preventDefaultTouchmoveEvent?: boolean;
  // Enable or disable auto play - Defaults to true
  enableAutoPlay?: boolean;
  /** Set auto play speed (ms) - Defaults to 2000 */
  autoPlaySpeed?: number;
  // A callback for the change of an item
  onChange?: (currentItemObject: ItemObject, currentPageIndex: number) => void;
  //  A callback for the beginning of the next transition
  onNextStart?: (
    prevItemObject: ItemObject,
    nextItemObject: ItemObject
  ) => void;
  // A callback for the beginning of the prev transition
  onPrevStart?: (
    prevItemObject: ItemObject,
    nextItemObject: ItemObject
  ) => void;
  //  A callback for the end of the next transition
  onNextEnd?: (nextItemObject: ItemObject, currentPageIndex: number) => void;
  //  A callback for the end of the prev transition
  onPrevEnd?: (nextItemObject: ItemObject, currentPageIndex: number) => void;
  // A callback for the "slider-container" resize
  onResize?: (currentBreakpoint: Breakpoint) => void;
}

declare class ReactElasticCarousel extends React.Component<
  ReactElasticCarouselProps
  > { }

export default ReactElasticCarousel;
