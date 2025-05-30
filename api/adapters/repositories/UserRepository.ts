import { Types } from 'mongoose';
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
    if (agendaConfig.weeklySchedule) {
      const dayMapping: Record<string, string> = {
        Segunda: 'segunda',
        Terça: 'terca',
        Quarta: 'quarta',
        Quinta: 'quinta',
        Sexta: 'sexta',
        Sábado: 'sabado',
        Domingo: 'domingo',
        segunda: 'segunda',
        terca: 'terca',
        quarta: 'quarta',
        quinta: 'quinta',
        sexta: 'sexta',
        sabado: 'sabado',
        domingo: 'domingo',
      };
      const normalizedWeeklySchedule: Record<string, any> = {};
      for (const [day, config] of Object.entries(agendaConfig.weeklySchedule)) {
        const normalizedDay = dayMapping[day];
        if (normalizedDay) {
          normalizedWeeklySchedule[normalizedDay] = config;
        }
      }
      agendaConfig.weeklySchedule = normalizedWeeklySchedule;
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { agendaConfig },
      { new: true, runValidators: true },
    );
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

  async getWeeklyScheduleByDay(userId: string, dayOfWeek: string): Promise<any | null> {
    const validDays = [
      'segunda',
      'terca',
      'quarta',
      'quinta',
      'sexta',
      'sabado',
      'domingo',
    ] as const;
    type ValidDay = (typeof validDays)[number];

    const normalizedDay = dayOfWeek.toLowerCase() as ValidDay;

    if (!validDays.includes(normalizedDay)) {
      throw new Error(
        'Dia da semana inválido. Use: segunda, terca, quarta, quinta, sexta, sabado, domingo',
      );
    }

    const user = await UserModel.findById(userId)
      .select(
        `agendaConfig.weeklySchedule.${normalizedDay} agendaConfig.useSameHoursEveryday agendaConfig.startTime agendaConfig.endTime agendaConfig.lunchStartTime agendaConfig.lunchEndTime`,
      )
      .lean();

    if (!user || !user.agendaConfig) {
      return null;
    }

    const { agendaConfig } = user;

    // Se usa os mesmos horários todos os dias, retorna a configuração geral
    if (agendaConfig.useSameHoursEveryday) {
      return {
        dayOfWeek: normalizedDay,
        startTime: agendaConfig.startTime,
        endTime: agendaConfig.endTime,
        lunchStartTime: agendaConfig.lunchStartTime,
        lunchEndTime: agendaConfig.lunchEndTime,
        isWorkingDay: true,
        useSameHoursEveryday: true,
      };
    }

    // Caso contrário, retorna a configuração específica do dia
    const dayConfig = agendaConfig.weeklySchedule?.[normalizedDay];

    if (!dayConfig) {
      return {
        dayOfWeek: normalizedDay,
        isWorkingDay: false,
        message: 'Dia não configurado ou não é dia de trabalho',
      };
    }

    return {
      dayOfWeek: normalizedDay,
      ...dayConfig,
      useSameHoursEveryday: false,
    };
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

  async getAll(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map(user => user.toObject());
  }

  async getAllWithDetails(): Promise<any[]> {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'addresses',
            localField: '_id',
            foreignField: 'idUser',
            as: 'addresses',
          },
        },
        {
          $lookup: {
            from: 'barberservices',
            localField: '_id',
            foreignField: 'userId',
            as: 'barberServices',
          },
        },
        {
          $addFields: {
            formattedAddresses: {
              $map: {
                input: '$addresses',
                as: 'address',
                in: {
                  id: '$$address._id',
                  street: '$$address.street',
                  number: '$$address.number',
                  complement: '$$address.complement',
                  zipCode: '$$address.zipCode',
                  city: '$$address.city',
                  state: '$$address.state',
                  country: '$$address.country',
                  cpf: '$$address.cpf',
                  phoneNumber: '$$address.phoneNumber',
                  locality: '$$address.locality',
                },
              },
            },
            formattedBarberServices: {
              $map: {
                input: '$barberServices',
                as: 'service',
                in: {
                  id: '$$service._id',
                  name: '$$service.name',
                  points: '$$service.points',
                  maney: '$$service.maney',
                },
              },
            },
          },
        },
        {
          $project: {
            id: '$_id',
            name: 1,
            email: 1,
            image: 1,
            service: 1,
            certificacoes: 1,
            descricao: 1,
            active: 1,
            points: 1,
            role: 1,
            code: 1,
            startTime: 1,
            endTime: 1,
            lunchStartTime: 1,
            lunchEndTime: 1,
            addresses: '$formattedAddresses',
            barberServices: '$formattedBarberServices',
          },
        },
      ];

      const users = await UserModel.aggregate(pipeline);
      return users;
    } catch (error: any) {
      throw new Error(`Error getting all users with details: ${error.message}`);
    }
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

  async getByIdWithDetails(userId: string): Promise<any | null> {
    try {
      const pipeline = [
        {
          $match: { _id: new Types.ObjectId(userId) },
        },
        {
          $lookup: {
            from: 'addresses',
            localField: '_id',
            foreignField: 'idUser',
            as: 'addresses',
          },
        },
        {
          $lookup: {
            from: 'barberservices',
            localField: '_id',
            foreignField: 'userId',
            as: 'barberServices',
          },
        },
        {
          $addFields: {
            formattedAddresses: {
              $map: {
                input: '$addresses',
                as: 'address',
                in: {
                  id: '$$address._id',
                  street: '$$address.street',
                  number: '$$address.number',
                  complement: '$$address.complement',
                  zipCode: '$$address.zipCode',
                  city: '$$address.city',
                  state: '$$address.state',
                  country: '$$address.country',
                  cpf: '$$address.cpf',
                  phoneNumber: '$$address.phoneNumber',
                  locality: '$$address.locality',
                },
              },
            },
            formattedBarberServices: {
              $map: {
                input: '$barberServices',
                as: 'service',
                in: {
                  id: '$$service._id',
                  name: '$$service.name',
                  points: '$$service.points',
                  maney: '$$service.maney',
                },
              },
            },
          },
        },
        {
          $project: {
            id: '$_id',
            name: 1,
            email: 1,
            image: 1,
            service: 1,
            certificacoes: 1,
            descricao: 1,
            active: 1,
            points: 1,
            role: 1,
            code: 1,
            startTime: 1,
            endTime: 1,
            lunchStartTime: 1,
            lunchEndTime: 1,
            addresses: '$formattedAddresses',
            barberServices: '$formattedBarberServices',
          },
        },
      ];

      const users = await UserModel.aggregate(pipeline);
      return users.length > 0 ? users[0] : null;
    } catch (error: any) {
      throw new Error(`Error getting user by ID with details: ${error.message}`);
    }
  }

  async updateWeeklySchedule(
    userId: string,
    weeklySchedule: Record<string, any>,
  ): Promise<User | null> {
    const validDays = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

    // Validar se apenas dias válidos estão sendo atualizados
    const providedDays = Object.keys(weeklySchedule);
    const invalidDays = providedDays.filter(day => !validDays.includes(day));

    if (invalidDays.length > 0) {
      throw new Error(`Dias inválidos fornecidos: ${invalidDays.join(', ')}`);
    }

    const updateObject: Record<string, any> = {};

    // Construir o objeto de atualização dinamicamente
    for (const [day, config] of Object.entries(weeklySchedule)) {
      updateObject[`agendaConfig.weeklySchedule.${day}`] = config;
    }

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateObject },
      { new: true, runValidators: true },
    ).lean();

    return user ? (user as any) : null;
  }
}
