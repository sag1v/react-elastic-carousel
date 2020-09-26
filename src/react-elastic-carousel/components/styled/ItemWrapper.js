import styled from "styled-components";
import PropTypes from "prop-types";
import { cssPrefix } from "../../utils/helpers";
import consts from "../../consts";

const ItemWrapper = styled.div.attrs(({ style }) => ({
  style,
  className: cssPrefix("item-wrapper")
}))`
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
  user-select: none;
  justify-content: ${({ itemPosition }) => itemPosition};
`;

ItemWrapper.defaultProps = {
  style: {},
  itemPosition: consts.CENTER
};

ItemWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  style: PropTypes.object,
  itemPosition: PropTypes.oneOf([consts.START, consts.CENTER, consts.END])
};

export default ItemWrapper;
