import { Appointment } from "../../entities/Appointment";
import { AppointmentRepository } from "../../adapters/repositories/AppointmentRepository";

export class CreateAppointment {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(appointmentData: Appointment): Promise<Appointment> {
    return this.appointmentRepository.create(appointmentData);
  }
}
