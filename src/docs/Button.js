import React from "react";
import PropTypes from "prop-types";

const Button = ({ value }) => <button>{value}</button>;

Button.propTypes = {
  /**@description: dasd */
  value: PropTypes.string
};

export default Button;