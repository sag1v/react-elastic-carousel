import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: ${({ height }) => `${height}px`};
`;
