import React from "react";
import { ILabelProps } from "../../interfaces/atom/ILabelProps";

const Label: React.FC<ILabelProps> = ({
  text,
  htmlFor = "",
  className = "",
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-sm font-medium text-gray-700 ${className}`}
    >
      {text}
    </label>
  );
};

export default Label;
