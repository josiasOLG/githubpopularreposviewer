import React from "react";
import RepoListItem from "../../components/molecules/RepoListItem";
import { Repository } from "../../models/repository/Repository";

interface RepoListProps {
  repos: Repository[];
}

const RepoList: React.FC<RepoListProps> = ({ repos }) => {
  return (
    <div className="divide-y divide-gray-200">
      {repos.map((repo) => (
        <RepoListItem
          key={repo.id}
          name={repo.name}
          description={repo.description}
          stargazers_count={repo.stargazers_count}
          isPrivate={repo.isPrivate}
          owner={repo.owner}
        />
      ))}
    </div>
  );
};

export default RepoList;
