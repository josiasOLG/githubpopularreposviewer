import { User } from '../../entities/User';
import { User as UserModel } from '../../frameworks/orm/models/User';

export class UserRepository {
  async create(userData: User): Promise<User> {
    const user = await UserModel.create(userData);
    return user.toObject();
  }

  async getById(userId: any): Promise<User | null> {
    const user = await UserModel.findById(userId);
    return user ? user.toObject() : null;
  }

  async updateAgendaConfig(userId: string, agendaConfig: any): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(userId, { agendaConfig }, { new: true });
    return user ? user.toObject() : null;
  }

  async getAgendaConfig(userId: string): Promise<any | null> {
    const user = await UserModel.findById(userId).select('agendaConfig');
    return user ? user.toObject().agendaConfig : null;
  }

  async getAgendaConfigService(userId: string, service: string): Promise<any | null> {
    const user = await UserModel.findOne({
      _id: userId,
      role: service,
    }).select('agendaConfig');

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
    const barbers = await UserModel.find({ role: 'BARBER' });
    return barbers.map(barber => barber.toObject());
  }

  async updateService(userId: any, service: string): Promise<User | null> {
    const user = await UserModel.findByIdAndUpdate(userId, { service }, { new: true });
    return user ? user.toObject() : null;
  }

  async searchUsers(
    query: string | undefined,
    service: string,
    modalities?: string[],
    userState?: string,
    userCity?: string,
  ): Promise<User[]> {
    const pipeline: any[] = [
      {
        $match: {
          $or: [{ role: service }],
          active: true,
        },
      },
      {
        $lookup: {
          from: 'addresses',
          localField: '_id',
          foreignField: 'idUser',
          as: 'address',
        },
      },
      {
        $addFields: {
          address: {
            $cond: {
              if: { $gt: [{ $size: '$address' }, 0] },
              then: { $arrayElemAt: ['$address', 0] },
              else: null,
            },
          },
        },
      },
    ];

    // Filtro por modalidades no agendaConfig
    if (modalities && modalities.length > 0) {
      // Converter modalidades para o formato correto do banco
      const modalityMappings: { [key: string]: string } = {
        online: 'Online',
        presencial: 'Presencial',
        domicilio: 'Domicílio',
      };

      const dbModalities = modalities.map(
        modality => modalityMappings[modality.toLowerCase()] || modality,
      );

      pipeline.push({
        $match: {
          'agendaConfig.modalities': { $in: dbModalities },
        },
      });
    }

    // Se modalidade presencial estiver incluída, filtrar por localização
    if (modalities && modalities.includes('presencial') && userState && userCity) {
      pipeline.push({
        $match: {
          'address.state': userState,
          'address.city': userCity,
        },
      });
    }

    // Filtro por nome ou código (se query fornecida)
    if (query && query.trim() !== '') {
      const regex = new RegExp(query.trim(), 'i');
      pipeline.push({
        $match: {
          $or: [{ name: regex }, { code: regex }],
        },
      });
    }

    const users = await UserModel.aggregate(pipeline);
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
