import { Appointment } from "../../entities/Appointment";
import { AppointmentRepository } from "../../adapters/repositories/AppointmentRepository";

export class GetAllAppointments {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(): Promise<Appointment[]> {
    return this.appointmentRepository.getAll();
  }
}
