import React from "react";
import { IButtonProps } from "../../interfaces/atom/IButtonProps";

const Button: React.FC<IButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded text-white hover:bg-blue-600 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
