import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import { cssPrefix } from "../utils/helpers";
import { Button } from "./styled";

const directionIcons = {
  left: "❮",
  right: "❯",
  up: "❮",
  down: "❯"
};

const arrowClassname = cssPrefix("arrow");

const rotateStyle = direction => {
  let rotate = {};
  if (direction === Arrow.up || direction === Arrow.down) {
    rotate.transform = "rotate(90deg)";
  }
  return rotate;
};
const Arrow = ({ direction, onClick, icons, style, ...rest }) => {
  const arrows = { ...directionIcons, ...icons };
  const styleObj = {
    ...rotateStyle(direction),
    ...style
  };
  return (
    <Button
      tabIndex={0}
      onClick={onClick}
      className={cx(arrowClassname, `${arrowClassname}-${direction}`)}
      style={styleObj}
      {...rest}
    >
      {arrows[direction]}
    </Button>
  );
};

Arrow.left = "left";
Arrow.right = "right";
Arrow.up = "up";
Arrow.down = "down";

Arrow.propTypes = {
  direction: PropTypes.oneOf(["left", "right", "up", "down"]).isRequired,
  icons: PropTypes.object,
  style: PropTypes.object,
  onClick: PropTypes.func
};

export default Arrow;
