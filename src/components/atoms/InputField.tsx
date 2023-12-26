import React from "react";
import { IInputFieldProps } from "../../interfaces/atom/IInputFieldProps";

const InputField: React.FC<IInputFieldProps> = ({
  type,
  value,
  onChange,
  placeholder = "",
  className = "",
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-gray-300 rounded px-4 py-2 dark:bg-black dark:text-black focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export default InputField;
