import {
  BarberServiceModel,
  IBarberService,
} from "../../frameworks/orm/models/BarberService";

export class BarberServiceRepository {
  async create(
    barberServiceData: Partial<IBarberService>
  ): Promise<IBarberService> {
    const barberService = await BarberServiceModel.create(barberServiceData);
    return barberService.toObject();
  }

  async getAll(userId: string): Promise<IBarberService[]> {
    const barberServices = await BarberServiceModel.find({ userId });
    return barberServices.map((service) => service.toObject());
  }

  async getById(serviceId: string): Promise<IBarberService | null> {
    const barberService = await BarberServiceModel.findById(serviceId);
    return barberService ? barberService.toObject() : null;
  }

  async update(
    serviceId: string,
    barberServiceData: Partial<IBarberService>
  ): Promise<IBarberService | null> {
    const barberService = await BarberServiceModel.findByIdAndUpdate(
      serviceId,
      barberServiceData,
      {
        new: true,
      }
    );
    return barberService ? barberService.toObject() : null;
  }

  async delete(serviceId: string): Promise<void> {
    await BarberServiceModel.findByIdAndDelete(serviceId);
  }

  async getAllServicesByBarberId(barberId: string): Promise<IBarberService[]> {
    const barberServices = await BarberServiceModel.find({ userId: barberId });
    return barberServices.map((service) => service.toObject());
  }
}
