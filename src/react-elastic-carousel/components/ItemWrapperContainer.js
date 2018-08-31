import React from "react";
import PropTypes from "prop-types";
import { ItemWrapper } from './styled';
import { noop } from "../utils/helpers";

class ItemWrapperContainer extends React.Component {
  onClick = () => {
    const { onClick, id } = this.props;
    onClick(id);
  }
  render() {
    const { child, style } = this.props;
    return (
      <ItemWrapper onClick={this.onClick} className="rec-child-wrapper" style={style}>
        {child}
      </ItemWrapper>
    );
  }
}

ItemWrapperContainer.defaultProps = {
  style: {},
  onClick: noop,
};

ItemWrapperContainer.propTypes = {
  child: PropTypes.element.isRequired,
  style: PropTypes.object,
  onClick: PropTypes.func
};

export default ItemWrapperContainer;
