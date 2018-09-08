import styled from "styled-components";

export default styled.div.attrs({
  style: ({ padding, width }) => ({ padding, width })
})`
  box-sizing: border-box;
  display: flex;
  overflow: hidden;
  user-select: none;
  justify-content: ${({itemPosition}) => itemPosition};
`;
