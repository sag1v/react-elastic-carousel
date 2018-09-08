import React, { Component } from "react";
import Flex from "./Flex";
import Item from "./Item";
import Title from "./Title";
import Poster from "./Poster";
import Description from "./Description";

class ItemContainer extends Component {
  onClick = () => {
    const { onClick, id } = this.props;
    onClick && onClick(id);
  };
  render() {
    const { title, img, description, active } = this.props;
    return (
      <Item onClick={this.onClick}>
        <Flex direction="column">
          <Title>{title}</Title>
          <Flex direction="column">
            {img && <Poster src={img} />}
            <Description>{description}</Description>
          </Flex>
        </Flex>
      </Item>
    );
  }
}

export default ItemContainer;
