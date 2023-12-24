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
    <div className="flex items-center space-x-4">
      <Avatar
        imageUrl={avatarUrl}
        altText={`${username}'s avatar`}
        className="w-16 h-16"
      />
      <div>
        <h2 className="text-xl font-semibold">{username}</h2>
        <p className="text-sm text-gray-600">{bio}</p>
        <div className="flex mt-2">
          <Label text={`Followers: ${followers}`} className="mr-4" />
          <Label text={`Following: ${following}`} />
        </div>
      </div>
      <div className="flex mt-2">
        <Select options={sortOptions} onChange={handleSortChange} />
      </div>
    </div>
  );
};

export default UserDetails;
