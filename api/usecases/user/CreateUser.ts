import { User } from "../../entities/User";
import { UserRepository } from "../../adapters/repositories/UserRepository";

export class CreateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(userData: User): Promise<User> {
    return this.userRepository.create(userData);
  }
}
