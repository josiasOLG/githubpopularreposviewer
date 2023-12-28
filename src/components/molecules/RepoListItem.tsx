import React, { useState } from "react";
import StarIcon from "../../components/atoms/StarIcon";
import { Link } from "react-router-dom";
import { Repository } from "../../models/repository/Repository";
import Icon from "../atoms/Icon";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import Text from "../atoms/Text";
import { motion } from "framer-motion";

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
  onSelect,
}) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleSelect = () => {
    setIsSelected(!isSelected);
    if (onSelect) {
      onSelect({ name, description, stargazers_count, isPrivate, owner });
    }
  };

  return (
    <div
      className="
      mt-2 
      p-2 md:p-4 
      border-b border-gray-200 dark:border dark:border-white 
      bg-white dark:bg-gray-900 
      shadow-sm
      flex flex-col md:flex-row justify-between items-start md:items-center"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center">
        {isPrivate && (
          <div className="hidden md:flex mr-2">
            <Icon type="fontAwesome" name={faCoffee} className="fa-lg" />
          </div>
        )}
        <div>
          <Text as="h5" className="text-lg md:text-xl font-semibold">
            {name}
          </Text>
          <Text as="p" className="text-sm md:text-base text-gray-600">
            {description}
          </Text>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <motion.input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelect}
          className="checkbox  md:mb-0"
          initial={false}
          animate={{ scale: isSelected ? 1.5 : 1 }}
        />
        <div className="flex mt-5 items-center">
          {stargazers_count !== undefined
            ? renderStars(stargazers_count)
            : null}
        </div>
      </div>
    </div>
  );
};

export default RepoListItem;
