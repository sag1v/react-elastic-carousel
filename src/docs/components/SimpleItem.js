import styled from "styled-components";
import Item from './Item';

const SimpleItem = styled(Item)`
    display: flex;
    min-height: 150px;
    justify-content: center;
    align-items: center;
    font-size: 2.5em;
`;

export default SimpleItem;