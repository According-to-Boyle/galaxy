import React from "react";

const Button = props => {
  const { variant, content, ...others } = props;

  return (
    <button className={variant} {...others}>
      {content}
    </button>
  );
};

export default Button;
