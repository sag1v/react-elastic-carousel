import styled from "styled-components";
export default styled.button`
  background: none;
  border: none;
  font-size: 2.5em;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;
  &:disabled {
    cursor: not-allowed;
  }
`;
