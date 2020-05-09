import React from 'react';
import { Button as MaterialButton } from '@material-ui/core';

const Button = (props) => {
  const { type, color, children, endIcon, startIcon, ...restProps } = props;

  return (
    <MaterialButton variant={type} color={color} endIcon={endIcon} startIcon={startIcon} {...restProps}>
      {children}
    </MaterialButton>
  );
};

export default Button;
