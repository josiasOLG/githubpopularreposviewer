import { AppointmentRepository } from "../../adapters/repositories/AppointmentRepository";

export class DeleteAppointment {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(appointmentId: string): Promise<void> {
    await this.appointmentRepository.delete(appointmentId);
  }
}
