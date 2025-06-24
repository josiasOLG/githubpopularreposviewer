import { Types } from 'mongoose';
import { IAdvertisement } from '../../entities/Advertisement';
import { Advertisement } from '../../frameworks/orm/models/Advertisement';
import { Appointment } from '../../frameworks/orm/models/Appointment';

export interface IAdvertisementRepository {
  create(advertisementData: Partial<IAdvertisement>): Promise<IAdvertisement>;
  getById(advertisementId: string): Promise<IAdvertisement | null>;
  getByProfessionalId(professionalId: string): Promise<IAdvertisement[]>;
  update(
    advertisementId: string,
    advertisementData: Partial<IAdvertisement>,
  ): Promise<IAdvertisement | null>;
  delete(advertisementId: string): Promise<void>;
  getActiveAdvertisements(): Promise<IAdvertisement[]>;
  getAdvertisementsForUser(userId: string): Promise<IAdvertisement[]>;
}

export class AdvertisementRepository implements IAdvertisementRepository {
  async create(advertisementData: Partial<IAdvertisement>): Promise<IAdvertisement> {
    const advertisement = await Advertisement.create(advertisementData);
    return advertisement.toObject();
  }

  async getById(advertisementId: string): Promise<IAdvertisement | null> {
    if (!Types.ObjectId.isValid(advertisementId)) {
      throw new Error('Invalid advertisement ID format');
    }

    const advertisement = await Advertisement.findById(advertisementId)
      .populate('professionalId', 'name email')
      .populate('userId', 'name email')
      .populate('appointmentId')
      .populate('appServiceId', 'name')
      .lean();

    return advertisement;
  }

  async getByProfessionalId(professionalId: string): Promise<IAdvertisement[]> {
    if (!Types.ObjectId.isValid(professionalId)) {
      throw new Error('Invalid professional ID format');
    }

    const advertisements = await Advertisement.find({
      professionalId,
      active: true,
    })
      .populate('userId', 'name email')
      .populate('appointmentId')
      .populate('appServiceId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return advertisements;
  }

  async update(
    advertisementId: string,
    advertisementData: Partial<IAdvertisement>,
  ): Promise<IAdvertisement | null> {
    if (!Types.ObjectId.isValid(advertisementId)) {
      throw new Error('Invalid advertisement ID format');
    }

    const advertisement = await Advertisement.findByIdAndUpdate(
      advertisementId,
      { ...advertisementData, updatedAt: new Date() },
      { new: true, runValidators: true },
    )
      .populate('professionalId', 'name email')
      .populate('userId', 'name email')
      .populate('appointmentId')
      .populate('appServiceId', 'name')
      .lean();

    return advertisement;
  }

  async delete(advertisementId: string): Promise<void> {
    if (!Types.ObjectId.isValid(advertisementId)) {
      throw new Error('Invalid advertisement ID format');
    }

    await Advertisement.findByIdAndUpdate(advertisementId, {
      active: false,
      updatedAt: new Date(),
    });
  }

  async getActiveAdvertisements(): Promise<IAdvertisement[]> {
    const currentDate = new Date();

    const advertisements = await Advertisement.find({
      active: true,
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    })
      .populate('professionalId', 'name email image')
      .populate('appServiceId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    return advertisements;
  }

  async getAdvertisementsForUser(userId: string): Promise<IAdvertisement[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid user ID format');
    }

    const currentDate = new Date();

    const userAppointments = await Appointment.find({
      userId,
      active: true,
    }).distinct('barberId');

    const advertisements = await Advertisement.aggregate([
      {
        $match: {
          active: true,
          startDate: { $lte: currentDate },
          endDate: { $gte: currentDate },
          $or: [
            { targetType: 'ALL' },
            {
              targetType: 'MY_CLIENTS',
              professionalId: { $in: userAppointments.map(id => new Types.ObjectId(id)) },
            },
            {
              targetType: 'NON_APPOINTMENT_USERS',
              professionalId: { $nin: userAppointments.map(id => new Types.ObjectId(id)) },
            },
          ],
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'professionalId',
          foreignField: '_id',
          as: 'professional',
          pipeline: [{ $project: { name: 1, email: 1, image: 1 } }],
        },
      },
      {
        $lookup: {
          from: 'appservices',
          localField: 'appServiceId',
          foreignField: '_id',
          as: 'appService',
          pipeline: [{ $project: { name: 1 } }],
        },
      },
      {
        $addFields: {
          professional: { $arrayElemAt: ['$professional', 0] },
          appService: { $arrayElemAt: ['$appService', 0] },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return advertisements;
  }
}

export const advertisementRepository = new AdvertisementRepository();
