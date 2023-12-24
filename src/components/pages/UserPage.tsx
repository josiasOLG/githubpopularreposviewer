import React, { useState, useEffect } from "react";
import { GitHubService } from "../../api/services/GitHubService";
import { User } from "../../models/user/User";
import UserPageTemplate from "../templates/UserPageTemplate"; // Importando o UserPageTemplate
import InputSearch from "../atoms/InputSearch";
import useSortableData from "../../api/hooks/useSortableData";
import { SortCriteria } from "../../enums/SortCriteria.enum";

const UserPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { sortedItems, setSortConfig } = useSortableData(repos);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortConfig(event.target.value as SortCriteria);
  };

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      const userDetails = await GitHubService.getUserDetails(username);
      const userRepos = await GitHubService.getUserRepos(username);
      setUser(userDetails);
      setRepos(userRepos);
    } catch (error) {
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  };

  const sortOptions = [
    { value: SortCriteria.NameAscending, label: "Nome (Ascendente)" },
    { value: SortCriteria.NameDescending, label: "Nome (Descendente)" },
    { value: SortCriteria.StarsAscending, label: "Menos Estrelas" },
    { value: SortCriteria.StarsDescending, label: "Mais Estrelas" },
  ];

  return (
    <div className="container mt-3">
      <form onSubmit={handleSearch}>
        <InputSearch
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <UserPageTemplate
            user={user}
            repos={sortedItems}
            handleSortChange={handleSortChange}
            sortOptions={sortOptions}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default UserPage;
