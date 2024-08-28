import { Barber } from "../../entities/Barber";
import { BarberRepository } from "../../adapters/repositories/BarberRepository";

export class UpdateBarber {
  constructor(private barberRepository: BarberRepository) {}

  async execute(
    barberId: string,
    barberData: Partial<Barber>
  ): Promise<Barber | null> {
    return this.barberRepository.update(barberId, barberData);
  }
}
