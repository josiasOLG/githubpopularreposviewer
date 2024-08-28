import { Appointment } from "../../entities/Appointment";
import { User } from "../../entities/User";
import { Appointment as AppointmentModel } from "../../frameworks/orm/models/Appointment";
import { User as UserModel } from "../../frameworks/orm/models/User";
import { Types } from "mongoose";

export class AppointmentRepository {
  async create(appointmentData: Appointment): Promise<Appointment> {
    const appointment = await AppointmentModel.create(appointmentData);
    return appointment.toObject();
  }

  async getAll(): Promise<Appointment[]> {
    const appointments = await AppointmentModel.find()
      .populate("userId")
      .populate("barberId");
    return appointments.map((appointment) => appointment.toObject());
  }

  async getById(appointmentId: string): Promise<Appointment | null> {
    const appointment = await AppointmentModel.findById(appointmentId)
      .populate("userId")
      .populate("barberId");
    return appointment ? appointment.toObject() : null;
  }

  async update(
    appointmentId: string,
    appointmentData: Partial<Appointment>
  ): Promise<Appointment | null> {
    const appointment = await AppointmentModel.findByIdAndUpdate(
      appointmentId,
      appointmentData,
      { new: true }
    )
      .populate("userId")
      .populate("barberId");
    return appointment ? appointment.toObject() : null;
  }

  async delete(appointmentId: string): Promise<void> {
    await AppointmentModel.findByIdAndDelete(appointmentId);
  }

  async getClientsByBarberId(barberId: string): Promise<any[]> {
    const appointments = await AppointmentModel.find({ barberId }).exec();
    const userIds = appointments.map((appointment) => appointment.userId);

    const users = await UserModel.find({ _id: { $in: userIds } });

    return users.map((user) => user.toObject());
  }

  async getAllAppointmentsByBarberId(barberId: string): Promise<any[]> {
    const appointments = await AppointmentModel.find({ barberId }).exec();
    const userIds = appointments.map((appointment) => appointment.userId);
    const barberIds = appointments.map((appointment) => appointment.barberId);

    const users = await UserModel.find({ _id: { $in: userIds } });
    const barbers = await UserModel.find({ _id: { $in: barberIds } });

    const userMap = users.reduce((acc: any, user) => {
      acc[user._id.toString()] = user;
      return acc;
    }, {});

    const barberMap = barbers.reduce((acc: any, barber) => {
      acc[barber._id.toString()] = barber;
      return acc;
    }, {});

    return appointments.map((appointment) => ({
      ...appointment.toObject(),
      userId: userMap[appointment.userId as string],
      barberId: barberMap[appointment.barberId as string],
    }));
  }
}
