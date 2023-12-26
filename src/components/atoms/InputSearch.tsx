import React from "react";
import { IInputSearchProps } from "../../interfaces/atom/IInputSearchProps";

const InputSearch: React.FC<IInputSearchProps> = ({
  value,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border border-gray-300 rounded dark:bg-black dark:text-white  px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
    />
  );
};

export default InputSearch;
