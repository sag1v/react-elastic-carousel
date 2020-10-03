import React from "react";
import Item from "./SimpleItem";

const ItemWithLink = ({ tabIndex, text }) => (
  <Item>
    <a href={`#link${text}`} tabIndex={tabIndex}>
      {text}
    </a>
  </Item>
);

export default ItemWithLink;
