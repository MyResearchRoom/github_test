import React from "react";

const Button = ({ children, onClick, disabled, className, style, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={style}
      className={`rounded-md p-1 ${className || "w-[100px]"}`}
    >
      {children}
    </button>
  );
};

export default Button;
