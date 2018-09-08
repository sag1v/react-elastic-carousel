import styled from "styled-components";

const Flex = styled.div`
  display: flex;
  flex-direction: ${({ direction }) => direction};
`;

export default Flex;
