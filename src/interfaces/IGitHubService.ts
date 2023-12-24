import { UserDTO } from "../dtos/UserDTO";
import { RepoDTO } from "../dtos/RepoDTO";

export interface IGitHubService {
  getUserDetails(username: string): Promise<UserDTO>;
  getUserRepos(username: string): Promise<RepoDTO[]>;
}
