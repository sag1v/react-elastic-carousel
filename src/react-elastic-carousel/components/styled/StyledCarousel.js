import styled from "styled-components";

export default styled.div.attrs(props => ({
  style: {
    height: props.size.height
  }
}))`
  display: flex;
  flex-direction: row;
  width: 100%;
`;
