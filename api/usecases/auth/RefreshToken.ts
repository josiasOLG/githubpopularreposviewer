import { User } from "../../entities/User";
import { UserRepository } from "../../adapters/repositories/UserRepository";
import jwt from "jsonwebtoken";

export class RefreshToken {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute(refreshToken: string): Promise<string | null> {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as { userId: string };

      const user = await this.userRepository.getById(decoded.userId);
      if (!user) {
        return null;
      }

      const newAccessToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET as string, // Use JWT_SECRET for access token
        {
          expiresIn: "15m",
        }
      );
      return newAccessToken;
    } catch (error) {
      console.error("Error in RefreshToken.execute:", error);
      return null;
    }
  }
}
