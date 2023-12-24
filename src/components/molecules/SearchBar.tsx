import React, { useState } from "react";
import InputField from "../../components/atoms/InputField";
import Button from "../../components/atoms/Button";
import { ISearchBarProps } from "../../interfaces/atom/ISearchBarProps";

const SearchBar: React.FC<ISearchBarProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    onSearch(searchValue);
  };

  return (
    <div className="flex space-x-4">
      <InputField
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search GitHub user..."
        className="flex-grow"
      />
      <Button onClick={handleSearch}>Search</Button>
    </div>
  );
};

export default SearchBar;
