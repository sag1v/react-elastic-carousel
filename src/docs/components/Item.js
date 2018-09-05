import styled from 'styled-components';

const Item = styled.div`
    transition: transform 200ms ease;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
    padding: 15px;
    border: 1px solid ${({active}) => active ? '#444' : '#aaa'};
    color: #333;
    background-color: #fff;
    &:hover{
        cursor: pointer;
    }
`;

export default Item;