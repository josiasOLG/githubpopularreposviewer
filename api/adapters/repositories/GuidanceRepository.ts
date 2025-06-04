import { Types } from 'mongoose';
import { IGuidance } from '../../entities/Guidance';
import { Guidance } from '../../frameworks/orm/models/Guidance';

export interface IGuidanceRepository {
  create(guidance: IGuidance): Promise<IGuidance>;
  findById(id: string): Promise<IGuidance | null>;
  findAll(): Promise<IGuidance[]>;
  findAllActive(): Promise<IGuidance[]>;
  findByUserId(userId: string): Promise<IGuidance[]>;
  findByProfessionalId(professionalId: string): Promise<IGuidance[]>;
  findByAppointmentId(appointmentId: string): Promise<IGuidance[]>;
  findByAppointmentIdWithCategoryName(appointmentId: string): Promise<any[]>;
  findByAppServiceAndCategory(appServiceId: string, categoryId: string): Promise<IGuidance[]>;
  findByDateRange(startDate: Date, endDate: Date): Promise<IGuidance[]>;
  findActiveByDateRange(startDate: Date, endDate: Date): Promise<IGuidance[]>;
  update(id: string, guidance: Partial<IGuidance>): Promise<IGuidance | null>;
  delete(id: string): Promise<boolean>;
  toggleActive(id: string): Promise<IGuidance | null>;
  addAttachment(id: string, attachment: any): Promise<IGuidance | null>;
  removeAttachment(id: string, attachmentId: string): Promise<IGuidance | null>;
  getExpiredGuidances(): Promise<IGuidance[]>;
  getActiveGuidancesByUser(userId: string): Promise<IGuidance[]>;
}

export class GuidanceRepository implements IGuidanceRepository {
  async create(guidanceData: IGuidance): Promise<IGuidance> {
    try {
      const guidance = new Guidance(guidanceData);
      return await guidance.save();
    } catch (error: any) {
      throw new Error(`Error creating guidance: ${error.message}`);
    }
  }

  async findById(id: string): Promise<IGuidance | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }

      return await Guidance.findById(id)
        .populate('appServiceId', 'name description')
        .populate('userId', 'name email')
        .populate('professionalId', 'name email')
        .lean();
    } catch (error: any) {
      throw new Error(`Error finding guidance by id: ${error.message}`);
    }
  }

  async findAll(): Promise<IGuidance[]> {
    try {
      return await Guidance.find()
        .populate('appServiceId', 'name description')
        .populate('userId', 'name email')
        .populate('professionalId', 'name email')
        .sort({ createdAt: -1 })
        .lean();
    } catch (error: any) {
      throw new Error(`Error finding all guidances: ${error.message}`);
    }
  }

  async findAllActive(): Promise<IGuidance[]> {
    try {
      const now = new Date();
      return await Guidance.find({
        active: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
        .populate('appServiceId', 'name description')
        .populate('userId', 'name email')
        .populate('professionalId', 'name email')
        .sort({ createdAt: -1 })
        .lean();
    } catch (error: any) {
      throw new Error(`Error finding active guidances: ${error.message}`);
    }
  }

  async findByUserId(userId: string): Promise<IGuidance[]> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        return [];
      }

      return await Guidance.find({ userId })
        .populate('appServiceId', 'name description')
        .populate('professionalId', 'name email')
        .sort({ createdAt: -1 })
        .lean();
    } catch (error: any) {
      throw new Error(`Error finding guidances by user: ${error.message}`);
    }
  }

  async findByProfessionalId(professionalId: string): Promise<IGuidance[]> {
    try {
      if (!Types.ObjectId.isValid(professionalId)) {
        return [];
      }

      return await Guidance.find({ professionalId })
        .populate('appServiceId', 'name description')
        .populate('userId', 'name email')
        .sort({ createdAt: -1 })
        .lean();
    } catch (error: any) {
      throw new Error(`Error finding guidances by professional: ${error.message}`);
    }
  }

  async findByAppointmentId(appointmentId: string): Promise<IGuidance[]> {
    try {
      if (!Types.ObjectId.isValid(appointmentId)) {
        return [];
      }

      return await Guidance.find({ appointmentId })
        .populate('appServiceId', 'name description')
        .populate('userId', 'name email')
        .populate('professionalId', 'name email')
        .sort({ createdAt: -1 })
        .lean();
    } catch (error: any) {
      throw new Error(`Error finding guidances by appointment: ${error.message}`);
    }
  }

  async findByAppointmentIdWithCategoryName(appointmentId: string): Promise<any[]> {
    try {
      if (!Types.ObjectId.isValid(appointmentId)) {
        return [];
      }

      // Usar agregação do MongoDB para buscar as orientações com nomes de categorias em uma única consulta
      const guidances = await Guidance.aggregate([
        // Filtrar por appointmentId
        {
          $match: {
            appointmentId: new Types.ObjectId(appointmentId),
          },
        },
        // Buscar informações do serviço relacionado
        {
          $lookup: {
            from: 'appservices',
            localField: 'appServiceId',
            foreignField: '_id',
            as: 'appService',
          },
        },
        // Descompactar o array appService (terá apenas um elemento)
        { $unwind: '$appService' },
        // Adicionar um campo para o nome da categoria
        {
          $addFields: {
            categoryName: {
              $let: {
                vars: {
                  categoryArray: {
                    $filter: {
                      input: '$appService.categories',
                      as: 'category',
                      cond: { $eq: ['$$category._id', { $toObjectId: '$categoryId' }] },
                    },
                  },
                },
                in: {
                  $cond: {
                    if: { $gt: [{ $size: '$$categoryArray' }, 0] },
                    then: { $arrayElemAt: ['$$categoryArray.name', 0] },
                    else: null,
                  },
                },
              },
            },
          },
        },
        // Buscar informações do usuário relacionado
        {
          $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user',
          },
        },
        // Descompactar o array user (terá apenas um elemento)
        { $unwind: '$user' },
        // Buscar informações do profissional relacionado
        {
          $lookup: {
            from: 'users',
            localField: 'professionalId',
            foreignField: '_id',
            as: 'professional',
          },
        },
        // Descompactar o array professional (terá apenas um elemento)
        { $unwind: '$professional' },
        // Selecionar apenas os campos necessários para a resposta
        {
          $project: {
            _id: 1,
            title: 1,
            description: 1,
            startDate: 1,
            endDate: 1,
            active: 1,
            createdAt: 1,
            updatedAt: 1,
            attachments: 1,
            appointmentId: 1,
            categoryId: 1,
            categoryName: 1,
            'appService._id': 1,
            'appService.name': 1,
            'appService.description': 1,
            'user._id': 1,
            'user.name': 1,
            'user.email': 1,
            'professional._id': 1,
            'professional.name': 1,
            'professional.email': 1,
          },
        },
        // Ordenar por data de criação (mais recente primeiro)
        { $sort: { createdAt: -1 } },
      ]);

      return guidances;
    } catch (error: any) {
      throw new Error(
        `Error finding guidances by appointment with category name: ${error.message}`,
      );
    }
  }

  async findByAppServiceAndCategory(
    appServiceId: string,
    categoryId: string,
  ): Promise<IGuidance[]> {
    try {
      if (!Types.ObjectId.isValid(appServiceId)) {
        return [];
      }

      return await Guidance.find({
        appServiceId,
        categoryId,
        active: true,
      })
        .populate('userId', 'name email')
        .populate('professionalId', 'name email')
        .sort({ createdAt: -1 })
        .lean();
    } catch (error: any) {
      throw new Error(`Error finding guidances by service and category: ${error.message}`);
    }
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<IGuidance[]> {
    try {
      return await Guidance.find({
        $or: [
          { startDate: { $gte: startDate, $lte: endDate } },
          { endDate: { $gte: startDate, $lte: endDate } },
          { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
        ],
      })
        .populate('appServiceId', 'name description')
        .populate('userId', 'name email')
        .populate('professionalId', 'name email')
        .sort({ startDate: 1 })
        .lean();
    } catch (error: any) {
      throw new Error(`Error finding guidances by date range: ${error.message}`);
    }
  }

  async findActiveByDateRange(startDate: Date, endDate: Date): Promise<IGuidance[]> {
    try {
      return await Guidance.find({
        active: true,
        $or: [
          { startDate: { $gte: startDate, $lte: endDate } },
          { endDate: { $gte: startDate, $lte: endDate } },
          { startDate: { $lte: startDate }, endDate: { $gte: endDate } },
        ],
      })
        .populate('appServiceId', 'name description')
        .populate('userId', 'name email')
        .populate('professionalId', 'name email')
        .sort({ startDate: 1 })
        .lean();
    } catch (error: any) {
      throw new Error(`Error finding active guidances by date range: ${error.message}`);
    }
  }

  async update(id: string, guidanceData: Partial<IGuidance>): Promise<IGuidance | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }

      return await Guidance.findByIdAndUpdate(
        id,
        { ...guidanceData, updatedAt: new Date() },
        { new: true },
      )
        .populate('appServiceId', 'name description')
        .populate('userId', 'name email')
        .populate('professionalId', 'name email')
        .lean();
    } catch (error: any) {
      throw new Error(`Error updating guidance: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return false;
      }

      const result = await Guidance.findByIdAndDelete(id);
      return !!result;
    } catch (error: any) {
      throw new Error(`Error deleting guidance: ${error.message}`);
    }
  }

  async toggleActive(id: string): Promise<IGuidance | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }

      const guidance = await Guidance.findById(id);
      if (!guidance) {
        return null;
      }

      return await Guidance.findByIdAndUpdate(
        id,
        { active: !guidance.active, updatedAt: new Date() },
        { new: true },
      )
        .populate('appServiceId', 'name description')
        .populate('userId', 'name email')
        .populate('professionalId', 'name email')
        .lean();
    } catch (error: any) {
      throw new Error(`Error toggling guidance active state: ${error.message}`);
    }
  }

  async addAttachment(id: string, attachmentData: any): Promise<IGuidance | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }

      return await Guidance.findByIdAndUpdate(
        id,
        {
          $push: {
            attachments: {
              ...attachmentData,
              uploadedAt: new Date(),
            },
          },
          updatedAt: new Date(),
        },
        { new: true },
      )
        .populate('appServiceId', 'name description')
        .populate('userId', 'name email')
        .populate('professionalId', 'name email')
        .lean();
    } catch (error: any) {
      throw new Error(`Error adding attachment to guidance: ${error.message}`);
    }
  }

  async removeAttachment(id: string, attachmentId: string): Promise<IGuidance | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }

      return await Guidance.findByIdAndUpdate(
        id,
        {
          $pull: { attachments: { _id: attachmentId } },
          updatedAt: new Date(),
        },
        { new: true },
      )
        .populate('appServiceId', 'name description')
        .populate('userId', 'name email')
        .populate('professionalId', 'name email')
        .lean();
    } catch (error: any) {
      throw new Error(`Error removing attachment from guidance: ${error.message}`);
    }
  }

  async getExpiredGuidances(): Promise<IGuidance[]> {
    try {
      const now = new Date();
      return await Guidance.find({
        active: true,
        endDate: { $lt: now },
      })
        .populate('appServiceId', 'name description')
        .populate('userId', 'name email')
        .populate('professionalId', 'name email')
        .sort({ endDate: -1 })
        .lean();
    } catch (error: any) {
      throw new Error(`Error finding expired guidances: ${error.message}`);
    }
  }

  async getActiveGuidancesByUser(userId: string): Promise<IGuidance[]> {
    try {
      if (!Types.ObjectId.isValid(userId)) {
        return [];
      }

      const now = new Date();
      return await Guidance.find({
        userId,
        active: true,
        startDate: { $lte: now },
        endDate: { $gte: now },
      })
        .populate('appServiceId', 'name description')
        .populate('professionalId', 'name email')
        .sort({ startDate: 1 })
        .lean();
    } catch (error: any) {
      throw new Error(`Error finding active guidances by user: ${error.message}`);
    }
  }
}

export const guidanceRepository = new GuidanceRepository();
