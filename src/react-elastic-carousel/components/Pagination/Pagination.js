import React, { useMemo } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import Dot from "./Dot";
import { numberToArray, cssPrefix, noop } from "../../utils/helpers";

const Indicators = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 15px;
`;

function Pagination(props) {
  const { numOfPages, activePage, onClick } = props;
  const pages = useMemo(() => numberToArray(numOfPages), [numOfPages]);
  return (
    <Indicators className={cssPrefix("pagination")}>
      {pages.map((_, i) => (
        <Dot key={i} id={i} active={i === activePage} onClick={onClick} />
      ))}
    </Indicators>
  );
}

Pagination.defaultProps = {
  onClick: noop
};

Pagination.propTypes = {
  numOfPages: PropTypes.number.isRequired,
  activePage: PropTypes.number.isRequired,
  onClick: PropTypes.func
};

export default Pagination;
