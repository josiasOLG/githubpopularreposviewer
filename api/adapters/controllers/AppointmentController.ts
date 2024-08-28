import { Request, Response } from "express";
import { CreateAppointment } from "../../usecases/appointment/CreateAppointment";
import { GetAllAppointments } from "../../usecases/appointment/GetAllAppointments";
import { GetAppointmentById } from "../../usecases/appointment/GetAppointmentById";
import { UpdateAppointment } from "../../usecases/appointment/UpdateAppointment";
import { DeleteAppointment } from "../../usecases/appointment/DeleteAppointment";
import { AppointmentRepository } from "../repositories/AppointmentRepository";
import { Router } from "express";
import { Availability } from "../../frameworks/orm/models/Availability";
import { Appointment } from "../../frameworks/orm/models/Appointment";
import { User } from "../../frameworks/orm/models/User";
import { Types } from "mongoose";

const appointmentRepository = new AppointmentRepository();
const router = Router();

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { barberId, date, time, service, notes, userId } = req.body;

    // Verificar disponibilidade
    // const availability = await Availability.findOne({ barberId, date });
    // console.log(availability);
    // if (!availability) {
    //   return res
    //     .status(404)
    //     .json({ error: "No availability found for this date" });
    // }

    // const timeSlot = availability.timeSlots.find(
    //   (slot) => slot.time === time && slot.available
    // );
    // if (!timeSlot) {
    //   return res.status(400).json({ error: "Time slot not available" });
    // }

    // Marcar o horário como indisponível
    // timeSlot.available = false;
    // await availability.save();

    const createAppointment = new CreateAppointment(appointmentRepository);
    const appointment = await createAppointment.execute({
      userId,
      barberId,
      date,
      time,
      status: "pending",
      statusAprovacao: "",
      service,
      notes,
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

export const checkExistingAppointment = async (req: Request, res: Response) => {
  try {
    const { userId, date } = req.body;
    const existingAppointment = await Appointment.findOne({ userId, date });
    res.json({ exists: existingAppointment });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to check appointment" });
  }
};

export const approveAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentRepository.update(id, {
      status: "aprovado",
      statusAprovacao: "aprovado",
    });
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to approve appointment" });
  }
};

export const rejectAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;
    console.log(id);
    console.log(cancelReason);
    const appointment = await appointmentRepository.update(id, {
      status: "rejeitado",
      statusAprovacao: "rejeitado",
      statusMensage: cancelReason,
    });
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to reject appointment" });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const getAllAppointments = new GetAllAppointments(appointmentRepository);
    const appointments = await getAllAppointments.execute();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to get appointments" });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const getAppointmentById = new GetAppointmentById(appointmentRepository);
    const appointment = await getAppointmentById.execute(req.params.id);
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get appointment" });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const updateAppointment = new UpdateAppointment(appointmentRepository);
    const appointment = await updateAppointment.execute(
      req.params.id,
      req.body
    );
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update appointment" });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const deleteAppointment = new DeleteAppointment(appointmentRepository);
    await deleteAppointment.execute(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete appointment" });
  }
};

export const getAllAppointmentsByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const appointments = await Appointment.find({
      userId,
    });
    console.log(appointments);
    const formattedAppointments = await Promise.all(
      appointments.map(async (appointment: any) => {
        const barber = await User.findById(appointment.barberId, "name email");
        return {
          id: appointment._id,
          barberId: barber?.id,
          barberName: barber?.name || "Unknown Barber",
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          statusAprovacao: appointment.statusAprovacao,
          statusMensage: appointment.statusMensage,
          service: appointment.service,
          notes: appointment.notes,
          statusPoint: appointment.statusPoint,
        };
      })
    );

    console.log(formattedAppointments);
    res.json(formattedAppointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to get appointments by user ID" });
  }
};

export const getAllAppointmentsByBarberId = async (
  req: Request,
  res: Response
) => {
  try {
    const { barberId } = req.params;
    const { filter } = req.query;

    let startDate: Date = new Date();
    let endDate: Date = new Date(); // Default endDate to now

    switch (filter) {
      case "today":
        startDate.setHours(0, 0, 0, 0); // Start of today
        endDate.setDate(startDate.getDate() + 1); // End of today
        break;
      case "week":
        startDate.setDate(startDate.getDate() - startDate.getDay()); // Start of the week (Sunday)
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7); // End of the week (Saturday)
        break;
      case "month":
        startDate.setHours(0, 0, 0, 0); // Start from today
        endDate = new Date(
          startDate.getFullYear(),
          startDate.getMonth() + 1,
          1
        ); // Start of the next month
        break;
      default:
        startDate.setHours(0, 0, 0, 0); // Default to today
        endDate.setDate(startDate.getDate() + 1); // End of today
        break;
    }

    const appointments = await Appointment.find({
      barberId,
      date: { $gte: startDate, $lt: endDate },
    });

    // Fetch user details for each appointment
    const formattedAppointments = await Promise.all(
      appointments.map(async (appointment: any) => {
        const user = await User.findById(appointment.userId, "name email");
        return {
          id: appointment._id,
          userId: user?.id,
          userName: user?.name || "Unknown User",
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          statusAprovacao: appointment.statusAprovacao,
          statusMensage: appointment.statusMensage,
          service: appointment.service,
          notes: appointment.notes,
          statusPoint: appointment.statusPoint,
        };
      })
    );

    res.json(formattedAppointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to get appointments by barber ID" });
  }
};

export const addPoints = async (req: Request, res: Response) => {
  try {
    const { appointmentId, userId, barberId, barberName } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!Array.isArray(user.points)) {
      user.points = [];
    } else {
      user.points = user.points.filter(
        (point) => typeof point === "object" && point !== null
      );
    }

    const pointsEntry = user.points.find((point) => {
      return point.barberId && point.barberId.toString() === barberId;
    });

    if (pointsEntry) {
      pointsEntry.qtd += 10;
      pointsEntry.barberName = barberName; // Atualiza o nome do barbeiro se necessário
    } else {
      const newPoint = {
        barberId: new Types.ObjectId(barberId),
        barberName,
        qtd: 10,
      };
      user.points.push(newPoint);
    }

    await user.save();

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { statusPoint: true },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({
      message: "Points added successfully",
      appointment,
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add points" });
  }
};

export const getPoints = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Obtém o userId dos parâmetros da URL

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      message: "Points retrieved successfully",
      points: user.points,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve points" });
  }
};

router.post("/", createAppointment);
router.post("/check-appointment", checkExistingAppointment);
router.get("/", getAllAppointments);
router.get("/user/:userId", getAllAppointmentsByUserId);
router.get("/barber/:barberId", getAllAppointmentsByBarberId);
router.get("/:id", getAppointmentById);
router.get("/points/:id", getPoints);
router.put("/:id", updateAppointment);
router.delete("/:id", deleteAppointment);
router.put("/:id/approve", approveAppointment);
router.put("/:id/reject", rejectAppointment);
router.post("/add-points", addPoints);

export default router;
