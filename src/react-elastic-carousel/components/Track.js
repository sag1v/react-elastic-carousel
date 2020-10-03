import React from "react";
import PropTypes from "prop-types";
import { Swipeable } from "react-swipeable";
import { cssPrefix } from "../utils/helpers";
import ItemWrapperContainer from "./ItemWrapperContainer";

const Track = ({
  children,
  childWidth,
  enableSwipe,
  enableMouseSwipe,
  preventDefaultTouchmoveEvent,
  itemsToShow,
  currentItem,
  itemPosition,
  itemPadding,
  onSwiped,
  onSwiping,
  onItemClick
}) => {
  const width = `${childWidth}px`;
  const paddingStyle = `${itemPadding.join("px ")}px`;
  const originalChildren = React.Children.map(children, (child, idx) => {
    const min = currentItem;
    const max = currentItem + itemsToShow;
    const isVisible = idx >= min && idx < max;
    return (
      <div
        className={cssPrefix("carousel-item", `carousel-item-${idx}`)}
        tabIndex={isVisible ? 0 : -1}
      >
        <ItemWrapperContainer
          id={idx}
          itemPosition={itemPosition}
          style={{ width, padding: paddingStyle }}
          key={idx}
          onClick={onItemClick}
        >
          {child}
        </ItemWrapperContainer>
      </div>
    );
  });
  return (
    <Swipeable
      style={{ display: "flex" }}
      stopPropagation
      preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
      trackMouse={enableMouseSwipe}
      onSwiped={onSwiped}
      onSwiping={onSwiping}
      className={cssPrefix("swipable")}
    >
      {originalChildren}
    </Swipeable>
  );
};

Track.propTypes = {
  children: PropTypes.array.isRequired,
  itemsToShow: PropTypes.number.isRequired,
  currentItem: PropTypes.number.isRequired,
  itemPosition: PropTypes.string,
  itemPadding: PropTypes.array,
  childWidth: PropTypes.number,
  enableSwipe: PropTypes.bool,
  enableMouseSwipe: PropTypes.bool,
  preventDefaultTouchmoveEvent: PropTypes.bool,
  onSwiped: PropTypes.func,
  onSwiping: PropTypes.func,
  onItemClick: PropTypes.func
};

export default Track;
