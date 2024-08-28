import { Barber } from "../../entities/Barber";
import { BarberRepository } from "../../adapters/repositories/BarberRepository";

export class GetBarberById {
  constructor(private barberRepository: BarberRepository) {}

  async execute(barberId: string): Promise<Barber | null> {
    return this.barberRepository.getById(barberId);
  }
}
