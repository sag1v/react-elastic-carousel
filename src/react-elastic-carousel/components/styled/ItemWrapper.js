import styled from "styled-components";

export default styled.div.attrs(({ style }) => ({
  style
}))`
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
  user-select: none;
  justify-content: ${({ itemPosition }) => itemPosition};
`;
