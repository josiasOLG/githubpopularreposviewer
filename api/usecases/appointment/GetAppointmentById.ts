import { Appointment } from "../../entities/Appointment";
import { AppointmentRepository } from "../../adapters/repositories/AppointmentRepository";

export class GetAppointmentById {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(appointmentId: string): Promise<Appointment | null> {
    return this.appointmentRepository.getById(appointmentId);
  }
}
