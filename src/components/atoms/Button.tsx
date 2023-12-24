import React from "react";
import { IButtonProps } from "../../interfaces/atom/IButtonProps";

const Button: React.FC<IButtonProps> = ({
  children,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded text-white bg-blue-500 hover:bg-blue-600 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
