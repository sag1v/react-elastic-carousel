import React from "react";
import PropTypes from "prop-types";
import Swipeable from "react-swipeable";
import ItemWrapper from "./ItemWrapper";

const Track = ({
  children,
  childWidth,
  enableSwipe,
  enableMouseSwipe,
  onSwipedLeft,
  onSwipedRight,
  itemPadding
}) => {
  const width = `${childWidth}px`;
  const paddingStyle = `${itemPadding.join("px ")}px`;
  let originalChildren = React.Children.map(children, child => {
    const item = (
      <ItemWrapper
        child={child}
        style={{ width, padding: paddingStyle }}
        key={`${child.key}`}
      />
    );
    if (enableSwipe) {
      return (
        <Swipeable
          trackMouse={enableMouseSwipe}
          onSwipedLeft={onSwipedLeft}
          onSwipedRight={onSwipedRight}
          className={`swipable-${child.key}`}
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
  children: PropTypes.array,
  childWidth: PropTypes.number,
  enableSwipe: PropTypes.bool,
  enableMouseSwipe: PropTypes.bool,
  onSwipedLeft: PropTypes.func,
  onSwipedRight: PropTypes.func
};

export default Track;
