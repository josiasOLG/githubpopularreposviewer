import { User } from "../../entities/User";
import { User as UserModel } from "../../frameworks/orm/models/User";

export class UserRepository {
  async create(userData: User): Promise<User> {
    const user = await UserModel.create(userData);
    return user.toObject();
  }

  async getById(userId: any): Promise<User | null> {
    const user = await UserModel.findById(userId);
    return user ? user.toObject() : null;
  }

  async update(userId: any, userData: Partial<User>): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(userId, userData, {
      new: true,
    });
    return user ? user.toObject() : null;
  }

  async delete(userId: any): Promise<void> {
    await UserModel.findByIdAndDelete(userId);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email });
    return user ? user.toObject() : null;
  }

  async findByEmailAndRole(email: string, role: string): Promise<User | null> {
    const user = await UserModel.findOne({ email, role });
    return user ? user.toObject() : null;
  }

  async getBarbers(): Promise<User[]> {
    const barbers = await UserModel.find({ role: "BARBER" });
    return barbers.map((barber) => barber.toObject());
  }

  async updateService(userId: any, service: string): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { service },
      { new: true }
    );
    return user ? user.toObject() : null;
  }

  async searchUsers(query: string, service: string): Promise<User[]> {
    const regex = new RegExp(query, "i");
    const users = await UserModel.find({
      role: service,
      $or: [{ name: regex }, { code: regex }],
    });
    return users.map((user) => user.toObject());
  }

  async findByRefreshToken(refreshToken: string): Promise<User | null> {
    const user = await UserModel.findOne({ refreshToken });
    return user ? user.toObject() : null;
  }

  async findByAccessToken(accessToken: string): Promise<User | null> {
    const user = await UserModel.findOne({ accessToken });
    return user ? user.toObject() : null;
  }
}
