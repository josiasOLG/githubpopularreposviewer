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

  async updateAgendaConfig(
    userId: string,
    agendaConfig: any
  ): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { agendaConfig },
      { new: true }
    );
    return user ? user.toObject() : null;
  }

  async getAgendaConfig(userId: string): Promise<any | null> {
    const user = await UserModel.findById(userId).select("agendaConfig");
    return user ? user.toObject().agendaConfig : null;
  }

  async getAgendaConfigService(
    userId: string,
    service: string
  ): Promise<any | null> {
    const user = await UserModel.findOne({
      _id: userId,
      role: service,
    }).select("agendaConfig");

    return user ? user.toObject().agendaConfig : null;
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
    const users = await UserModel.aggregate([
      {
        $match: {
          role: service,
          active: true,
          $or: [{ name: regex }, { code: regex }],
          startTime: { $exists: true, $ne: null },
          lunchStartTime: { $exists: true, $ne: null },
          lunchEndTime: { $exists: true, $ne: null },
          endTime: { $exists: true, $ne: null },
        },
      },
      {
        $lookup: {
          from: "addresses", // Nome da coleção de endereços no MongoDB
          localField: "_id",
          foreignField: "idUser",
          as: "address",
        },
      },
      {
        $match: {
          address: { $ne: [] }, // Filtra apenas usuários com endereço
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          code: 1,
          role: 1,
          startTime: 1,
          lunchStartTime: 1,
          lunchEndTime: 1,
          endTime: 1,
          image: 1,
          address: { $arrayElemAt: ["$address", 0] },
        },
      },
    ]);
    console.log(users);
    return users;
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
