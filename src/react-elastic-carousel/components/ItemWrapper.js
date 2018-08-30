import React from "react";
import PropTypes from "prop-types";
import { borderBox, flex, overflowHidden, noSelection } from "./styleRules";

const wrapperStyle = {
  ...borderBox,
  ...flex,
  ...overflowHidden,
  ...noSelection,
  justifyContent: "center"
};

const ItemWrapper = ({ child, style }) => (
  <div className="c-child-wrapper" style={{ ...wrapperStyle, ...style }}>
    {child}
  </div>
);

ItemWrapper.defaultProps = {
  style: {}
};

ItemWrapper.propTypes = {
  child: PropTypes.element.isRequired,
  style: PropTypes.object
};

export default ItemWrapper;
