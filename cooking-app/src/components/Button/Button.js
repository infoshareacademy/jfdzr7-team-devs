import React from "react";
import { StyledButton } from "./Button.styled";

const Button = ({ children, primary }) => {
  return <StyledButton>{children}</StyledButton>;
};

export default Button;
