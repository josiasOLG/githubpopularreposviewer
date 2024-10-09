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
import moment from "moment-timezone";

const appointmentRepository = new AppointmentRepository();
const router = Router();

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const {
      barberId,
      date,
      time,
      service,
      notes,
      userId,
      idServico,
      repete,
      allDay,
      color,
    } = req.body;

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
      idServico,
      repete,
      allDay,
      color,
    });

    res.status(201).json(appointment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create appointment" });
  }
};

export const checkExistingAppointment = async (req: Request, res: Response) => {
  try {
    const { userId, date, idServico } = req.body;
    const existingAppointment = await Appointment.findOne({
      userId,
      date,
      idServico,
    });
    if (existingAppointment) {
      res.status(400).json({
        error:
          "Já existe um agendamento para o dia selecionado! vá no seu status para ver os status de agendamento",
      });
    } else {
      res.status(200).json("");
    }
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
    const { idServico } = req.query;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const appointments = await Appointment.find({
      userId,
      idServico,
    });
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
          repete: appointment.repete,
          allDay: appointment.allDay,
          exceptions: appointment.exceptions,
          endRepeat: appointment.endRepeat,
          color: appointment.color,
        };
      })
    );

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
    const timezone = "America/Sao_Paulo"; // Ajuste para o fuso horário correto

    let query: any = { barberId };

    if (filter && filter !== "all") {
      let startDate = moment.tz(timezone).startOf("day");
      let endDate = moment
        .tz(timezone)
        .set({ hour: 23, minute: 59, second: 59, millisecond: 999 });

      switch (filter) {
        case "today":
          startDate = moment.tz(timezone).startOf("day");
          endDate = moment
            .tz(timezone)
            .set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
          break;
        case "week":
          startDate = moment.tz(timezone).startOf("isoWeek");
          endDate = moment.tz(timezone).endOf("isoWeek");
          break;
        case "month":
          startDate = moment.tz(timezone).startOf("month");
          endDate = moment.tz(timezone).endOf("month");
          break;
        default:
          startDate = moment.tz(timezone).startOf("day");
          endDate = moment.tz(timezone).endOf("day");
          break;
      }

      // Ajuste para garantir que o final do dia UTC corresponda ao final do dia no timezone São Paulo
      const utcStartDate = startDate.toDate();
      const utcEndDate = endDate.toDate();

      query.date = { $gte: utcStartDate, $lt: utcEndDate };
    }

    const appointments = await Appointment.find(query);

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
          repete: appointment.repete,
          allDay: appointment.allDay,
          exceptions: appointment.exceptions,
          endRepeat: appointment.endRepeat,
          color: appointment.color,
        };
      })
    );
    console.log("formattedAppointments >>", formattedAppointments);
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

export const createException = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { exceptionDate } = req.body;

    if (!exceptionDate) {
      return res.status(400).json({ error: "Exception date is required" });
    }

    const appointment = await Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    if (!appointment.exceptions) {
      appointment.exceptions = [];
    }

    appointment.exceptions.push(new Date(exceptionDate));
    await appointment.save();

    res.json({
      message: "Exception added successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add exception" });
  }
};

export const updateEndRepeat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { endRepeat } = req.body;

    if (!endRepeat) {
      return res.status(400).json({ error: "End repeat date is required" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { endRepeat: new Date(endRepeat) },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    res.json({
      message: "End repeat date updated successfully",
      appointment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update end repeat date" });
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
router.post("/:id/exception", createException);
router.put("/:id/end-repeat", updateEndRepeat);

export default router;
