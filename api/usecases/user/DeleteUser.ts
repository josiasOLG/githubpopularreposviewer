import { UserRepository } from "../../adapters/repositories/UserRepository";

export class DeleteUser {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
