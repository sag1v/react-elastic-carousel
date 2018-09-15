import styled from "styled-components";

export default styled.div`
  cursor: pointer;
  transition: all 250ms ease-in;
  background-color: ${({ active }) => (active ? "#8bc34a" : "transparent")};
  color: ${({ active }) => (active ? "#fff" : "333")};
  transform: scale(${({ active }) => (!active ? 1.1 : 1)});
  box-shadow: 0 0 2px 1px #555;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 20px;
  height: 20px;
  margin: 10px 10px;
`;
