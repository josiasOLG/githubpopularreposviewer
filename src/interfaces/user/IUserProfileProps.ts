import { Repository } from "../../models/repository/Repository";
import { User } from "../../models/user/User";

export interface IUserProfileProps {
  user?: User;
  repos: Repository[];
  handleSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  sortOptions: { value: string; label: string }[];
}
