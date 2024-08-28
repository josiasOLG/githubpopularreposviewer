import { Barber } from "../../entities/Barber";
import { BarberRepository } from "../../adapters/repositories/BarberRepository";

export class GetAllBarbers {
  constructor(private barberRepository: BarberRepository) {}

  async execute(): Promise<Barber[]> {
    return this.barberRepository.getAll();
  }
}
