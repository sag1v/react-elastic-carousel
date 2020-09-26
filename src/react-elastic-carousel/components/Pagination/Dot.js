import React, { useCallback } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { cssPrefix, noop } from "../../utils/helpers";

const boxShadow = "0 0 1px 2px rgba(0, 0, 0, 0.5)";
const activeBoxShadow = "0 0 1px 3px rgba(103,58,183,1)";
const hoveredBoxShadow = "0 0 1px 3px rgba(103,58,183,.5)";

const Dot = styled.button.attrs(({ type, active }) => ({
  type,
  tabIndex: active ? -1 : 0,
  className: cssPrefix("dot", active ? "dot_active" : "")
}))`
  transition: all 250ms ease;
  border: none;
  margin: 5px;
  background-color: ${({ active }) =>
    active ? "rgba(103,58,183,.5)" : "transparent"};
  font-size: 1.3em;
  content: "";
  height: 10px;
  width: 10px;
  box-shadow: ${({ active }) => (active ? activeBoxShadow : boxShadow)};
  border-radius: 50%;
  outline: none;
  &:hover,
  &:focus {
    cursor: pointer;
    box-shadow: ${({ active }) =>
      active ? activeBoxShadow : hoveredBoxShadow};
  }
`;

Dot.defaultProps = {
  type: "button"
};

Dot.propTypes = {
  type: PropTypes.string,
  active: PropTypes.bool
};

function DotContainer(props) {
  const { onClick, id, ...restOfProps } = props;

  const _onClick = useCallback(
    () => {
      onClick(id);
    },
    [onClick, id]
  );

  return <Dot {...restOfProps} onClick={_onClick} />;
}

DotContainer.defaultProps = {
  onClick: noop
};

DotContainer.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onClick: PropTypes.func
};

export default DotContainer;
