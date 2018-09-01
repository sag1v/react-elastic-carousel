import styled from "styled-components";

export default styled.button`
  transition: all 0.3s ease;
  font-size: 1.6em;
  background-color: rgba(103, 58, 183, 0.1);
  color: #333;
  box-shadow: 0 0 2px 0px #333;
  border-radius: 50%;
  border: none;
  width: 50px;
  height: 50px;
  align-self: center;
  cursor: pointer;
  outline: none;
  &:hover {
    color: #fff;
    background-color: rgba(103, 58, 183, 1);
    box-shadow: 0 0 2px 0px #333;
  }
`;
