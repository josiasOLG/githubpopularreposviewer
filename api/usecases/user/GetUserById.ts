import { User } from "../../entities/User";
import { UserRepository } from "../../adapters/repositories/UserRepository";

export class GetUserById {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<User | null> {
    return this.userRepository.getById(userId);
  }
}
