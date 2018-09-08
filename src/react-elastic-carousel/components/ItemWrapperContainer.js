import React from "react";
import PropTypes from "prop-types";
import { ItemWrapper } from "./styled";
import consts from '../consts';
import { noop, cssPrefix } from "../utils/helpers";

class ItemWrapperContainer extends React.Component {
  onClick = () => {
    const { onClick, id } = this.props;
    onClick(id);
  };
  render() {
    const { child, style, itemPosition } = this.props;
    return (
      <ItemWrapper
        onClick={this.onClick}
        className={cssPrefix("child-wrapper")}
        itemPosition={itemPosition}
        style={style}
      >
        {child}
      </ItemWrapper>
    );
  }
}

ItemWrapperContainer.defaultProps = {
  style: {},
  itemPosition: consts.CENTER,
  onClick: noop
};

ItemWrapperContainer.propTypes = {
  child: PropTypes.element.isRequired,
  itemPosition: PropTypes.oneOf([consts.START, consts.CENTER, consts.END]),
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  style: PropTypes.object,
  onClick: PropTypes.func
};

export default ItemWrapperContainer;
