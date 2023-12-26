import React from "react";
import InputSearch from "../atoms/InputSearch";

interface UserFormSearchProps {
  username: string;
  setUsername: (username: string) => void;
  handleSearch: (e: React.FormEvent<HTMLFormElement>) => void; // Ajuste a tipagem aqui
}

const UserFormSearch: React.FC<UserFormSearchProps> = ({
  username,
  setUsername,
  handleSearch,
}) => {
  return (
    <form onSubmit={handleSearch} data-testid="user-form" className="">
      <InputSearch
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter GitHub username"
        className="md:w-64 p-2"
      />
      <button
        type="submit"
        className="mt-2 md:mt-0 md:ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Search
      </button>
    </form>
  );
};

export default UserFormSearch;
