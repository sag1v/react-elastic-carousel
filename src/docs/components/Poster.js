import styled from "styled-components";

const Poster = styled.div.attrs(({ src }) => {
  return {
    style: {
      backgroundImage: `url(${src})`
    }
  };
})`
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 200px;
`;

export default Poster;
