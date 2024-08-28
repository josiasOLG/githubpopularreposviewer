import { Appointment } from "../../entities/Appointment";
import { AppointmentRepository } from "../../adapters/repositories/AppointmentRepository";

export class UpdateAppointment {
  constructor(private appointmentRepository: AppointmentRepository) {}

  async execute(
    appointmentId: string,
    appointmentData: Partial<Appointment>
  ): Promise<Appointment | null> {
    return this.appointmentRepository.update(appointmentId, appointmentData);
  }
}
