import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { cssPrefix } from "../../utils/helpers";

const boxShadow = "0 0 1px 2px rgba(0, 0, 0, 0.5)";
const activeBoxShadow = "0 0 1px 3px rgba(103,58,183,1)";
const hoveredBoxShadow = "0 0 1px 3px rgba(103,58,183,.5)";

const Dot = styled.button.attrs(({ type = "button" }) => ({ type }))`
  box-sizing: border-box;
  padding: 0;
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

class DotContainer extends React.Component {
  onClick = () => {
    const { onClick, id } = this.props;
    onClick(id);
  };
  render() {
    const { active } = this.props;
    return (
      <Dot
        tabIndex={active ? -1 : 0}
        onClick={this.onClick}
        active={active}
        className={`${cssPrefix("dot")} ${
          active ? cssPrefix("dot_active") : ""
        }`}
      />
    );
  }
}

DotContainer.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  active: PropTypes.bool,
  onClick: PropTypes.func
};

export default DotContainer;
