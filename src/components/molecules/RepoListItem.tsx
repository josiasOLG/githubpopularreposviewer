import React from "react";
import StarIcon from "../../components/atoms/StarIcon";
import { Link } from "react-router-dom";
import { Repository } from "../../models/repository/Repository";
import Icon from "../atoms/Icon";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";

const renderStars = (count: number) => {
  const starCount = count > 0 ? count : 1;
  return Array.from({ length: starCount }, (_, i) => (
    <StarIcon key={i} filled />
  ));
};

const RepoListItem: React.FC<Repository> = ({
  name,
  description,
  stargazers_count,
  isPrivate,
  owner,
}) => {
  return (
    <Link
      to={`/repo/${owner.login}/${name}`}
      className="no-underline text-black"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm mt-2">
        <div className="flex items-center">
          {isPrivate && (
            <Icon type="fontAwesome" name={faCoffee} className="fa-lg" />
          )}
          <div className="ml-2">
            <h5 className="text-lg font-semibold">{name}</h5>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex items-center">
          {stargazers_count !== undefined
            ? renderStars(stargazers_count)
            : null}
        </div>
      </div>
    </Link>
  );
};

export default RepoListItem;
