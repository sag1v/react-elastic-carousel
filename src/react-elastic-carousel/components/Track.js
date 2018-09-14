import React from "react";
import PropTypes from "prop-types";
import Swipeable from "react-swipeable";
import { cssPrefix } from "../utils/helpers";
import ItemWrapperContainer from "./ItemWrapperContainer";

const Track = ({
  children,
  childWidth,
  enableSwipe,
  enableMouseSwipe,
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
    const item = (
      <ItemWrapperContainer
        id={idx}
        itemPosition={itemPosition}
        child={child}
        style={{ width, padding: paddingStyle }}
        key={`${child.key}${idx}`}
        onClick={onItemClick}
      />
    );
    if (enableSwipe) {
      return (
        <Swipeable
          stopPropagation
          preventDefaultTouchmoveEvent
          trackMouse={enableMouseSwipe}
          onSwipedLeft={onSwipedLeft}
          onSwipedRight={onSwipedRight}
          onSwipedUp={onSwipedUp}
          onSwipedDown={onSwipedDown}
          className={cssPrefix(`swipable-${child.key}`)}
        >
          {item}
        </Swipeable>
      );
    } else {
      return item;
    }
  });
  return <React.Fragment>{originalChildren}</React.Fragment>;
};

Track.propTypes = {
  children: PropTypes.array.isRequired,
  itemPosition: PropTypes.string,
  itemPadding: PropTypes.array,
  childWidth: PropTypes.number,
  enableSwipe: PropTypes.bool,
  enableMouseSwipe: PropTypes.bool,
  onSwipedLeft: PropTypes.func,
  onSwipedRight: PropTypes.func,
  onSwipedUp: PropTypes.func,
  onSwipedDown: PropTypes.func,
  onItemClick: PropTypes.func
};

export default Track;
