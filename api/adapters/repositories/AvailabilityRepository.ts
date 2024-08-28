import {
  IAvailability,
  Availability,
} from "../../frameworks/orm/models/Availability";

export class AvailabilityRepository {
  async getAllAvailabilityByBarberId(
    barberId: string
  ): Promise<IAvailability[]> {
    const availabilities = await Availability.find({ barberId }).exec();
    return availabilities.map((availability: any) => availability.toObject());
  }

  async createAvailability(
    availabilityData: IAvailability
  ): Promise<IAvailability> {
    const availability = new Availability(availabilityData);
    await availability.save();
    return availability.toObject();
  }

  async updateAvailability(
    availabilityId: string,
    availabilityData: Partial<IAvailability>
  ): Promise<IAvailability | null> {
    const availability = await Availability.findByIdAndUpdate(
      availabilityId,
      availabilityData,
      { new: true }
    ).exec();
    return availability ? availability.toObject() : null;
  }

  async deleteAvailability(availabilityId: string): Promise<void> {
    await Availability.findByIdAndDelete(availabilityId).exec();
  }
}
