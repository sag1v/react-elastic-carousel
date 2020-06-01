import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: ${({ size }) => `${size.height}px`};
`;
