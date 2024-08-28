import { User } from "../../entities/User";
import { UserRepository } from "../../adapters/repositories/UserRepository";

export class UpdateUser {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, userData: Partial<User>): Promise<User | null> {
    return this.userRepository.update(userId, userData);
  }
}
