import { BarberRepository } from "../../adapters/repositories/BarberRepository";

export class DeleteBarber {
  constructor(private barberRepository: BarberRepository) {}

  async execute(barberId: string): Promise<void> {
    await this.barberRepository.delete(barberId);
  }
}
