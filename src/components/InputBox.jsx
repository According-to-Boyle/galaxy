import React from "react";

const InputBox = ({ value, name, handleChange, children }) => {
  return (
    <div>
      {children}
      <input type="text" name={name} value={value} onChange={handleChange} />
    </div>
  );
};

export default InputBox;
