import React from "react";
import PropTypes from "prop-types";
import { borderBox, flex, overflowHidden, noSelection } from "./styleRules";
import { noop } from "../utils/helpers";

const wrapperStyle = {
  ...borderBox,
  ...flex,
  ...overflowHidden,
  ...noSelection,
  justifyContent: "center"
};

class ItemWrapper extends React.Component {
  onClick = () => {
    const {onClick, id} = this.props;
    onClick(id);
  }
  render() {
    const { child, style } = this.props;
    return (
      <div onClick={this.onClick} className="c-child-wrapper" style={{ ...wrapperStyle, ...style }}>
        {child}
      </div>
    );
  }
}

ItemWrapper.defaultProps = {
  style: {},
  onClick: noop,
};

ItemWrapper.propTypes = {
  child: PropTypes.element.isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func
};

export default ItemWrapper;
