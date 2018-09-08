import React, { Component } from "react";
import PropTypes from "prop-types";
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
    const { title, img, description } = this.props;
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

ItemContainer.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  title: PropTypes.string,
  img: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func
};

export default ItemContainer;
