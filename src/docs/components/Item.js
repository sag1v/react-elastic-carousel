import styled from "styled-components";

const Item = styled.div`
  transition: transform 200ms ease;
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: 15px;
  margin: 5px;
  border: 1px solid
    ${({ active }) => (active ? "rgba(0,0,0,.2)" : "rgba(0,0,0,.02)")};
  color: #fff;
  background-color: #673ab7;
  &:hover {
    cursor: pointer;
  }
`;

export default Item;
