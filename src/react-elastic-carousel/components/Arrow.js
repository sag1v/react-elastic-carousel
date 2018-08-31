import React from "react";
import PropTypes from "prop-types";
import cx from 'classnames';
import { Button } from "./styled";

const directionIcons = {
  left: "❮",
  right: "❯",
  up: "↑",
  down: "↓"
};

const Arrow = ({ direction, onClick, icons, ...rest }) => {
  const arrows = { ...directionIcons, ...icons };
  return (
    <Button onClick={onClick} className={cx("rec-arrow", `rec-arrow-${direction}`)} {...rest}>
      {arrows[direction]}
    </Button>
  );
};

Arrow.propTypes = {
  direction: PropTypes.oneOf(["left", "right", "up", "down"]).isRequired,
  icons: PropTypes.object,
  onClick: PropTypes.func
};

export default Arrow;
