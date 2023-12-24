import React from "react";
import UserDetails from "../../components/molecules/UserDetails";
import RepoList from "./RepoList";
import { IUserProfileProps } from "../../interfaces/user/IUserProfileProps";

const UserProfile: React.FC<IUserProfileProps> = ({
  user,
  repos,
  handleSortChange,
  sortOptions,
}) => {
  // console.log(repos);
  return (
    <div className="space-y-6">
      <UserDetails
        username={user?.username}
        avatarUrl={user?.avatar_url}
        followers={user?.followers}
        following={user?.following}
        bio={user?.bio}
        handleSortChange={handleSortChange}
        sortOptions={sortOptions}
      />
      <RepoList repos={repos} />
    </div>
  );
};

export default UserProfile;
