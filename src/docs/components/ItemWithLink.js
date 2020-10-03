import React from "react";
import PropTypes from "prop-types";
import Item from "./SimpleItem";

const ItemWithLink = ({ tabIndex, text }) => (
  <Item>
    <a href={`#link${text}`} tabIndex={tabIndex}>
      {text}
    </a>
  </Item>
);

ItemWithLink.propTypes = {
  text: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  tabIndex: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default ItemWithLink;
