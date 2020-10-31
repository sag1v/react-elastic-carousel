import React from "react";
import PropTypes from "prop-types";
import { Swipeable } from "react-swipeable";
import { cssPrefix } from "../utils/helpers";
import ItemWrapperContainer from "./ItemWrapperContainer";

const Track = ({
  children,
  childWidth,
  autoTabIndexVisibleItems,
  enableSwipe,
  enableMouseSwipe,
  preventDefaultTouchmoveEvent,
  itemsToShow,
  currentItem,
  itemPosition,
  itemPadding,
  onSwiped,
  onSwiping,
  verticalMode,
  onItemClick
}) => {
  const width = `${childWidth}px`;
  const paddingStyle = `${itemPadding.join("px ")}px`;
  const originalChildren = React.Children.map(children, (child, idx) => {
    const min = currentItem;
    const max = currentItem + itemsToShow;
    const isVisible = idx >= min && idx < max;
    const childToRender = autoTabIndexVisibleItems
      ? React.cloneElement(child, { tabIndex: isVisible ? 0 : -1 })
      : child;
    return (
      <div
        className={cssPrefix("carousel-item", `carousel-item-${idx}`)}
        // tabIndex={isVisible ? 0 : -1}
      >
        <ItemWrapperContainer
          id={idx}
          itemPosition={itemPosition}
          style={{ width, padding: paddingStyle }}
          key={idx}
          onClick={onItemClick}
        >
          {childToRender}
        </ItemWrapperContainer>
      </div>
    );
  });
  const toRender = enableSwipe ? (
    <Swipeable
      style={{
        display: "flex",
        flexDirection: verticalMode ? "column" : "row"
      }}
      stopPropagation
      preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
      trackMouse={enableMouseSwipe}
      onSwiped={onSwiped}
      onSwiping={onSwiping}
      className={cssPrefix("swipable")}
    >
      {originalChildren}
    </Swipeable>
  ) : (
    originalChildren
  );
  return toRender;
};

Track.propTypes = {
  children: PropTypes.array.isRequired,
  itemsToShow: PropTypes.number.isRequired,
  noAutoTabbedItems: PropTypes.bool,
  currentItem: PropTypes.number.isRequired,
  itemPosition: PropTypes.string,
  itemPadding: PropTypes.array,
  childWidth: PropTypes.number,
  verticalMode: PropTypes.bool,
  enableSwipe: PropTypes.bool,
  enableMouseSwipe: PropTypes.bool,
  preventDefaultTouchmoveEvent: PropTypes.bool,
  onSwiped: PropTypes.func,
  onSwiping: PropTypes.func,
  onItemClick: PropTypes.func
};

export default Track;
