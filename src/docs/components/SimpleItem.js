import styled from "styled-components";
import Item from "./Item";

const SimpleItem = styled(Item)`
  display: flex;
  min-height: 100px;
  justify-content: center;
  align-items: center;
  font-size: 2.5em;
  max-width: ${({ maxWidth }) => maxWidth};
`;

export default SimpleItem;
