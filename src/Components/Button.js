import React from 'react';

const Button = ({ children, style, onClick, disabled }) => {
  return (
    <button style={style} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
export default Button;
