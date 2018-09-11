import styled from "styled-components";

export default styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  direction: ${({ isRTL }) => (isRTL ? "rtl" : "ltr")};
`;
