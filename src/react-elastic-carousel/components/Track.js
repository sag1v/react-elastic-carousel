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
  onSwipedLeft,
  onSwipedRight,
  onSwipedUp,
  onSwipedDown,
  onItemClick
}) => {
  const width = `${childWidth}px`;
  const paddingStyle = `${itemPadding.join("px ")}px`;
  let originalChildren = React.Children.map(children, (child, idx) => {
    const min = currentItem;
    const max = currentItem + itemsToShow;
    const isVisible = idx >= min && idx < max;
    const item = (
      <ItemWrapperContainer
        id={idx}
        itemPosition={itemPosition}
        child={child}
        style={{ width, padding: paddingStyle }}
        key={idx}
        onClick={onItemClick}
      />
    );
    const toRender = enableSwipe ? (
      <Swipeable
        stopPropagation
        preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
        trackMouse={enableMouseSwipe}
        onSwipedLeft={onSwipedLeft}
        onSwipedRight={onSwipedRight}
        onSwipedUp={onSwipedUp}
        onSwipedDown={onSwipedDown}
        className={cssPrefix(`swipable-${idx}`)}
      >
        {item}
      </Swipeable>
    ) : (
      item
    );
    return <div tabIndex={isVisible ? 0 : -1}>{toRender}</div>;
  });
  return <React.Fragment>{originalChildren}</React.Fragment>;
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
  onSwipedLeft: PropTypes.func,
  onSwipedRight: PropTypes.func,
  onSwipedUp: PropTypes.func,
  onSwipedDown: PropTypes.func,
  onItemClick: PropTypes.func
};

export default Track;
