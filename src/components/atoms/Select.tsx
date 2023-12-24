import React from "react";
import { ISelectProps } from "../../interfaces/atom/ISelectProps";

const Select: React.FC<ISelectProps> = ({ options, onChange }) => {
  return (
    <select onChange={onChange} className="border border-gray-300 rounded p-2">
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
