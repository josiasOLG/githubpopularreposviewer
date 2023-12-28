import React from "react";
import Avatar from "../../components/atoms/Avatar";
import Label from "../../components/atoms/Label";
import Select from "../atoms/Select";
import { IUserDetailsProps } from "../../interfaces/user/IUserDetailsProps";

const UserDetails: React.FC<IUserDetailsProps> = ({
  username,
  avatarUrl,
  followers,
  following,
  bio,
  handleSortChange,
  sortOptions,
}) => {
  return (
    <div className="flex flex-col md:flex-row items-center md:items-start space-x-0 md:space-x-4">
      <Avatar
        imageUrl={avatarUrl}
        altText={`${username}'s avatar`}
        className="w-16 h-16 md:w-24 md:h-24"
      />
      <div className="mt-4 md:mt-0 md:w-2/3">
        <h2 className="text-xl md:text-2xl font-semibold">{username}</h2>
        <p className="text-sm md:text-base text-gray-600">{bio}</p>
        <div className="flex mt-2">
          <Label
            text={`Followers: ${followers}`}
            className="mr-4 dark:text-white"
          />
          <Label text={`Following: ${following}`} className="dark:text-white" />
        </div>
        <div className="flex mt-2">
          <Select options={sortOptions} onChange={handleSortChange} />
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
