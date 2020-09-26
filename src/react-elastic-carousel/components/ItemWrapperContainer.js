import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { ItemWrapper } from "./styled";
import { noop } from "../utils/helpers";

function ItemWrapperContainer(props) {
  const { onClick, id, ...restOfProps } = props;
  const _onClick = useCallback(
    () => {
      onClick(id);
    },
    [onClick, id]
  );
  return <ItemWrapper {...restOfProps} onClick={_onClick} />;
}

ItemWrapperContainer.defaultProps = {
  onClick: noop
};

ItemWrapperContainer.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func
};

export default ItemWrapperContainer;
