import { Barber } from "../../entities/Barber";
import { BarberRepository } from "../../adapters/repositories/BarberRepository";

export class CreateBarber {
  constructor(private barberRepository: BarberRepository) {}

  async execute(barberData: Barber): Promise<Barber> {
    return this.barberRepository.create(barberData);
  }
}
