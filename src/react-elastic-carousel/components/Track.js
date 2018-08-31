import React from "react";
import PropTypes from "prop-types";
import Swipeable from "react-swipeable";
import ItemWrapperContainer from "./ItemWrapperContainer";

const Track = ({
  children,
  childWidth,
  enableSwipe,
  enableMouseSwipe,
  itemPadding,
  onSwipedLeft,
  onSwipedRight,
  onItemClick,
}) => {
  const width = `${childWidth}px`;
  const paddingStyle = `${itemPadding.join("px ")}px`;
  let originalChildren = React.Children.map(children, (child, idx) => {
    const item = (
      <ItemWrapperContainer
        id={idx}
        child={child}
        style={{ width, padding: paddingStyle }}
        key={`${child.key}${idx}`}
        onClick={onItemClick}
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
