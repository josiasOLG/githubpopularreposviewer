import { User } from "../../models/user/User";

export interface IUserService {
  getUser(username: string): Promise<User>;
}
