import { Barber } from "../../entities/Barber";
import { Barber as BarberModel } from "../../frameworks/orm/models/Barber";

export class BarberRepository {
  async create(barberData: Barber): Promise<Barber> {
    const barber = await BarberModel.create(barberData);
    return barber.toObject();
  }

  async getAll(): Promise<Barber[]> {
    const barbers = await BarberModel.find();
    return barbers.map((barber) => barber.toObject());
  }

  async getById(barberId: string): Promise<Barber | null> {
    const barber = await BarberModel.findById(barberId);
    return barber ? barber.toObject() : null;
  }

  async update(
    barberId: string,
    barberData: Partial<Barber>
  ): Promise<Barber | null> {
    const barber = await BarberModel.findByIdAndUpdate(barberId, barberData, {
      new: true,
    });
    return barber ? barber.toObject() : null;
  }

  async delete(barberId: string): Promise<void> {
    await BarberModel.findByIdAndDelete(barberId);
  }
}
