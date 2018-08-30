import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const Dot = styled.div`
  transition: all 250ms ease;
  margin: 5px;
  background-color: ${props => (props.active ? "#673AB7" : "transparent")};
  font-size: 1.3em;
  content: "";
  height: 10px;
  width: 10px;
  box-shadow: ${props =>
    props.active ? "0 0 1px 3px #321b5a" : "0 0 1px 2px rgba(0, 0, 0, 0.5)"};
  border-radius: 50%;
  &:hover {
    cursor: pointer;
  }
`;

class DotContainer extends React.Component {
  onClick = () => {
    const { onClick, id } = this.props;
    onClick(id);
  };
  render() {
    const { id, active } = this.props;
    return <Dot sizeEnhancer={id} onClick={this.onClick} active={active} />;
  }
}

export default DotContainer;
