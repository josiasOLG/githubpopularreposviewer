import { NextFunction, Request, Response, Router } from 'express';
import moment from 'moment-timezone';
import { Types } from 'mongoose';
import { Appointment } from '../../frameworks/orm/models/Appointment';
import { User } from '../../frameworks/orm/models/User';
import { CreateAppointment } from '../../usecases/appointment/CreateAppointment';
import { UpdateAppointment } from '../../usecases/appointment/UpdateAppointment';
import {
  buildWhatsAppMessageForApproval,
  buildWhatsAppMessageForBusiness,
  buildWhatsAppUrl,
} from '../../utils/utils';
import { addressRepository } from '../repositories/AddressRepository';
import { AppointmentRepository } from '../repositories/AppointmentRepository';

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
      userNumber,
      modality,
      numberBarber,
      nomeUser,
      manual,
      hashuser,
      status,
      statusAprovacao,
      userName,
      userEmail,
      userCpf,
      userAddress,
    } = req.body;

    // Verificar se o profissional está ativo
    const barber = await User.findById(barberId);
    if (!barber || barber.active !== true) {
      return res.status(400).json({
        error: 'O profissional selecionado não está disponível para agendamentos',
      });
    }

    // Preparar dados do agendamento
    const appointmentData: any = {
      userId,
      barberId,
      date,
      time,
      status: status ? status : 'pending',
      statusAprovacao: statusAprovacao ? statusAprovacao : 'pending',
      service,
      notes,
      idServico,
      repete,
      allDay,
      color,
      userNumber,
      modality,
      active: true,
      manual,
      hashuser,
      userName,
      userEmail,
    };

    // Adicionar CPF apenas se fornecido
    if (userCpf && userCpf.trim() !== '') {
      appointmentData.userCpf = userCpf;
    }

    // Adicionar endereço apenas se pelo menos um campo estiver preenchido
    if (
      userAddress &&
      (userAddress.street?.trim() ||
        userAddress.number?.trim() ||
        userAddress.city?.trim() ||
        userAddress.state?.trim() ||
        userAddress.zipCode?.trim() ||
        userAddress.complement?.trim())
    ) {
      appointmentData.userAddress = userAddress;
    }

    const createAppointment = new CreateAppointment(appointmentRepository);
    const appointment = await createAppointment.execute(appointmentData);

    let whatsappUrl = null;

    if (numberBarber) {
      const msg = buildWhatsAppMessageForBusiness({
        nomeUser,
        userNumber,
        service,
        date,
        time,
        modality,
        notes,
        idServico,
        repete,
        userId: '', // Removed from the message
        barberId: '', // Removed from the message
        color,
      });
      whatsappUrl = buildWhatsAppUrl(numberBarber, msg);
    }
    res.status(201).json({
      ...appointment,
      whatsappUrl,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to create appointment' });
  }
};

export const checkExistingAppointment = async (req: Request, res: Response) => {
  try {
    const { userId, date, idServico } = req.body;
    const existingAppointment = await Appointment.findOne({
      userId,
      date,
      idServico,
      active: true, // Verificar apenas agendamentos ativos
    });
    if (existingAppointment) {
      res.status(400).json({
        error:
          'Já existe um agendamento para o dia selecionado! vá no seu status para ver os status de agendamento',
      });
    } else {
      res.status(200).json('');
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Failed to check appointment' });
  }
};

export const approveAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar se o agendamento está ativo antes de aprovar
    const appointmentToApprove = await Appointment.findById(id);
    if (!appointmentToApprove || appointmentToApprove.active !== true) {
      return res.status(404).json({ error: 'Agendamento não encontrado ou inativo' });
    }

    const appointment = await appointmentRepository.update(id, {
      status: 'aprovado',
      statusAprovacao: 'aprovado',
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const fullAppointment = await Appointment.findById(id);
    if (!fullAppointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    const user = await User.findById(fullAppointment.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const addresses = await addressRepository.findByIdUser(String(fullAppointment.userId));
    let phone = '';

    if (addresses && addresses.length > 0 && addresses[0]?.phoneNumber) {
      phone = addresses[0].phoneNumber;
    } else if (fullAppointment.userNumber) {
      phone = fullAppointment.userNumber;
    }

    let whatsappUrl = null;

    if (phone) {
      const msg = buildWhatsAppMessageForApproval({
        nomeUser: user.name,
        userNumber: phone,
        service: fullAppointment.service,
        date: fullAppointment.date,
        time: fullAppointment.time,
        modality: fullAppointment.modality,
        notes: fullAppointment.notes,
        idServico: fullAppointment.idServico,
        repete: fullAppointment.repete,
        userId: fullAppointment.userId,
        barberId: fullAppointment.barberId,
        color: fullAppointment.color,
      });
      whatsappUrl = buildWhatsAppUrl(phone, msg);
    }

    res.json({
      whatsappUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to approve appointment' });
  }
};

export const rejectAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { cancelReason } = req.body;

    // Verificar se o agendamento está ativo antes de rejeitar
    const appointmentToReject = await Appointment.findById(id);
    if (!appointmentToReject || appointmentToReject.active !== true) {
      return res.status(404).json({ error: 'Agendamento não encontrado ou inativo' });
    }

    const appointment = await appointmentRepository.update(id, {
      status: 'rejeitado',
      statusAprovacao: 'rejeitado',
      statusMensage: cancelReason,
    });
    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject appointment' });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    // Modificar o método para buscar apenas agendamentos ativos
    const appointments = await Appointment.find({ active: true });

    const formattedAppointments = await Promise.all(
      appointments.map(async (appointment: any) => {
        const user = await User.findById(appointment.userId, 'name');
        const barber = await User.findById(appointment.barberId, 'name');

        return {
          id: appointment._id,
          userId: appointment.userId,
          userName: user?.name || 'Unknown User',
          barberId: appointment.barberId,
          barberName: barber?.name || 'Unknown Barber',
          date: appointment.date,
          time: appointment.time,
          status: appointment.status,
          statusAprovacao: appointment.statusAprovacao,
          service: appointment.service,
          notes: appointment.notes,
          repete: appointment.repete,
          allDay: appointment.allDay,
          color: appointment.color,
          userNumber: appointment.userNumber,
          modality: appointment.modality,
        };
      }),
    );

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Erro ao buscar todos os agendamentos:', error);
    res.status(500).json({ error: 'Failed to get appointments' });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Buscar apenas agendamentos ativos
    const appointment = await Appointment.findOne({ _id: id, active: true });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found or inactive' });
    }

    // Buscar informações adicionais
    const user = await User.findById(appointment.userId, 'name email');
    const barber = await User.findById(appointment.barberId, 'name');

    const formattedAppointment = {
      id: appointment._id,
      userId: appointment.userId,
      userName: user?.name || 'Unknown User',
      userEmail: user?.email,
      barberId: appointment.barberId,
      barberName: barber?.name || 'Unknown Barber',
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
      userNumber: appointment.userNumber,
      modality: appointment.modality,
    };

    res.json(formattedAppointment);
  } catch (error) {
    console.error('Erro ao buscar agendamento por ID:', error);
    res.status(500).json({ error: 'Failed to get appointment' });
  }
};

export const updateAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar se o agendamento está ativo antes de atualizar
    const appointmentToUpdate = await Appointment.findById(id);
    if (!appointmentToUpdate || appointmentToUpdate.active !== true) {
      return res.status(404).json({ error: 'Agendamento não encontrado ou inativo' });
    }

    const updateAppointment = new UpdateAppointment(appointmentRepository);
    const appointment = await updateAppointment.execute(id, req.body);

    if (appointment) {
      res.json(appointment);
    } else {
      res.status(404).json({ error: 'Appointment not found' });
    }
  } catch (error) {
    console.error('Erro ao atualizar agendamento:', error);
    res.status(500).json({ error: 'Failed to update appointment' });
  }
};

export const deleteAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Em vez de excluir fisicamente, atualizar para active = false
    const appointment = await Appointment.findByIdAndUpdate(id, { active: false }, { new: true });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.status(200).json({ message: 'Appointment deactivated successfully' });
  } catch (error) {
    console.error('Erro ao desativar agendamento:', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
};

export const getAllAppointmentsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { idServico } = req.query;

    // Construir a query base para agendamentos ativos
    const query: any = {
      userId,
      active: true,
    };

    // Adicionar filtro por serviço se fornecido
    if (idServico) {
      query.idServico = idServico;
    }

    const appointments = await Appointment.find(query);

    const formattedAppointments = await Promise.all(
      appointments.map(async (appointment: any) => {
        const barber = await User.findById(appointment.barberId, 'name email role');
        return {
          id: appointment._id,
          barberId: barber?.id,
          role: barber?.role,
          barberName: barber?.name || 'Unknown Barber',
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
      }),
    );
    res.json(formattedAppointments);
  } catch (error) {
    console.error('Erro ao buscar agendamentos por ID de usuário:', error);
    res.status(500).json({ error: 'Failed to get appointments by user ID' });
  }
};

export const getAllAppointmentsByBarberIdManual = async (req: Request, res: Response) => {
  try {
    const { barberId } = req.params;
    const { filter } = req.query;
    const timezone = 'America/Sao_Paulo';

    let query: any = {
      barberId,
      active: true,
      manual: true,
    };

    if (filter && filter !== 'all') {
      let startDate = moment.tz(timezone).startOf('day');
      let endDate = moment.tz(timezone).endOf('day');

      switch (filter) {
        case 'today':
          startDate = moment.tz(timezone).startOf('day');
          endDate = moment.tz(timezone).endOf('day');
          break;
        case 'week':
          startDate = moment.tz(timezone).startOf('isoWeek');
          endDate = moment.tz(timezone).endOf('isoWeek');
          break;
        case 'month':
          startDate = moment.tz(timezone).startOf('month');
          endDate = moment.tz(timezone).endOf('month');
          break;
        default:
          startDate = moment.tz(timezone).startOf('day');
          endDate = moment.tz(timezone).endOf('day');
          break;
      }

      const utcStartDate = startDate.toDate();
      const utcEndDate = endDate.toDate();
      query.create = { $gte: utcStartDate, $lt: utcEndDate };
    }

    // Buscar os agendamentos ativos do profissional
    const appointments = await Appointment.find(query);

    // Extrair todos os userIds para fazer uma única consulta ao banco
    const userIds = appointments.map(appointment => appointment.userId);

    // Buscar apenas usuários ativos
    const users = await User.find(
      {
        _id: { $in: userIds },
        active: true, // Garantir que apenas usuários ativos sejam retornados
      },
      'name email phone image birthDate descricao points',
    ).lean();

    const userMap = new Map();
    users.forEach(user => {
      userMap.set(user._id.toString(), user);
    });

    const formattedAppointments = appointments.map((appointment: any) => {
      const user = userMap.get(appointment.userId.toString()) || {};

      return {
        id: appointment._id,
        userId: appointment.userId,
        userName: appointment.userName,
        userEmail: appointment.userEmail,
        userPhone: appointment.userNumber,
        userAddress: appointment.userAddress,
        userCpf: appointment.userCpf,
        userImage: user.image,
        userBirthDate: user.birthDate,
        userDescription: user.descricao,
        userPoints:
          user.points?.find((p: any) => p.barberId.toString() === barberId.toString())?.qtd || 0,
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
        userNumber: appointment.userNumber,
        modality: appointment.modality,
        hashuser: appointment.hashuser,
      };
    });

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Erro ao buscar agendamentos por ID do profissional:', error);
    res.status(500).json({ error: 'Failed to get appointments by barber ID' });
  }
};

export const getAllAppointmentsByBarberId = async (req: Request, res: Response) => {
  try {
    const { barberId } = req.params;
    const { filter } = req.query;
    const timezone = 'America/Sao_Paulo';

    let query: any = {
      barberId,
      active: true,
      manual: false,
    };

    if (filter && filter !== 'all') {
      let startDate = moment.tz(timezone).startOf('day');
      let endDate = moment.tz(timezone).endOf('day');

      switch (filter) {
        case 'today':
          startDate = moment.tz(timezone).startOf('day');
          endDate = moment.tz(timezone).endOf('day');
          break;
        case 'week':
          startDate = moment.tz(timezone).startOf('isoWeek');
          endDate = moment.tz(timezone).endOf('isoWeek');
          break;
        case 'month':
          startDate = moment.tz(timezone).startOf('month');
          endDate = moment.tz(timezone).endOf('month');
          break;
        default:
          startDate = moment.tz(timezone).startOf('day');
          endDate = moment.tz(timezone).endOf('day');
          break;
      }

      const utcStartDate = startDate.toDate();
      const utcEndDate = endDate.toDate();
      query.create = { $gte: utcStartDate, $lt: utcEndDate };
    }

    // Buscar os agendamentos ativos do profissional
    const appointments = await Appointment.find(query);

    // Extrair todos os userIds para fazer uma única consulta ao banco
    const userIds = appointments.map(appointment => appointment.userId);

    // Buscar apenas usuários ativos
    const users = await User.find(
      {
        _id: { $in: userIds },
        active: true, // Garantir que apenas usuários ativos sejam retornados
      },
      'name email phone image birthDate descricao points',
    ).lean();

    const userMap = new Map();
    users.forEach(user => {
      userMap.set(user._id.toString(), user);
    });

    const formattedAppointments = appointments.map((appointment: any) => {
      const user = userMap.get(appointment.userId.toString()) || {};

      return {
        id: appointment._id,
        userId: appointment.userId,
        userName: user.name || 'Unknown User',
        userEmail: user.email,
        userPhone: user.phone,
        userImage: user.image,
        userBirthDate: user.birthDate,
        userDescription: user.descricao,
        userPoints:
          user.points?.find((p: any) => p.barberId.toString() === barberId.toString())?.qtd || 0,
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
        userNumber: appointment.userNumber,
        modality: appointment.modality,
      };
    });

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Erro ao buscar agendamentos por ID do profissional:', error);
    res.status(500).json({ error: 'Failed to get appointments by barber ID' });
  }
};

export const addPoints = async (req: Request, res: Response) => {
  try {
    const { appointmentId, userId, barberId, barberName } = req.body;

    // Verificar se o agendamento está ativo
    const appointmentToUpdate = await Appointment.findById(appointmentId);
    if (!appointmentToUpdate || appointmentToUpdate.active !== true) {
      return res.status(404).json({ error: 'Agendamento não encontrado ou inativo' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!Array.isArray(user.points)) {
      user.points = [];
    } else {
      user.points = user.points.filter(point => typeof point === 'object' && point !== null);
    }

    const pointsEntry = user.points.find(point => {
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
      { new: true },
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({
      message: 'Points added successfully',
      appointment,
      user,
    });
  } catch (error) {
    console.error('Erro ao adicionar pontos:', error);
    res.status(500).json({ error: 'Failed to add points' });
  }
};

export const getPoints = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Obtém o userId dos parâmetros da URL

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Points retrieved successfully',
      points: user.points,
    });
  } catch (error) {
    console.error('Erro ao recuperar pontos:', error);
    res.status(500).json({ error: 'Failed to retrieve points' });
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ error: 'ID do agendamento é obrigatório' });
    }
    const appointment = await Appointment.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    if (appointment.active === false) {
      return res.status(400).json({ error: 'Este agendamento já está cancelado' });
    }

    appointment.active = false;
    appointment.status = 'cancelado';
    appointment.statusAprovacao = 'cancelado';

    if (req.body.cancelReason) {
      appointment.statusMensage = req.body.cancelReason;
    }
    await appointment.save();
    res.status(200).json({
      message: 'Agendamento cancelado com sucesso',
      appointmentId: appointment._id,
    });
  } catch (error) {
    console.error('Erro ao cancelar agendamento:', error);
    res.status(500).json({ error: 'Falha ao cancelar o agendamento' });
  }
};

export const createException = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { exceptionDate } = req.body;

    if (!exceptionDate) {
      return res.status(400).json({ error: 'Exception date is required' });
    }

    // Verificar se o agendamento está ativo
    const appointment = await Appointment.findOne({ _id: id, active: true });

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found or inactive' });
    }

    if (!appointment.exceptions) {
      appointment.exceptions = [];
    }

    appointment.exceptions.push(new Date(exceptionDate));
    await appointment.save();

    res.json({
      message: 'Exception added successfully',
      appointment,
    });
  } catch (error) {
    console.error('Erro ao criar exceção:', error);
    res.status(500).json({ error: 'Failed to add exception' });
  }
};

export const updateEndRepeat = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { endRepeat } = req.body;

    if (!endRepeat) {
      return res.status(400).json({ error: 'End repeat date is required' });
    }

    // Verificar se o agendamento está ativo
    const appointmentExists = await Appointment.findOne({ _id: id, active: true });
    if (!appointmentExists) {
      return res.status(404).json({ error: 'Appointment not found or inactive' });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { endRepeat: new Date(endRepeat) },
      { new: true },
    );

    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    res.json({
      message: 'End repeat date updated successfully',
      appointment,
    });
  } catch (error) {
    console.error('Erro ao atualizar data de fim da repetição:', error);
    res.status(500).json({ error: 'Failed to update end repeat date' });
  }
};

export const getAllAppointmentsByBarberCalendario = async (req: Request, res: Response) => {
  try {
    const { barberId } = req.params;
    const { filter } = req.query;
    const timezone = 'America/Sao_Paulo';

    let query: any = {
      barberId,
      active: true,
      status: { $ne: 'rejeitado' },
      statusAprovacao: { $ne: 'rejeitado' },
    };

    if (filter && filter !== 'all') {
      let startDate = moment.tz(timezone).startOf('day');
      let endDate = moment.tz(timezone).endOf('day');

      switch (filter) {
        case 'today':
          startDate = moment.tz(timezone).startOf('day');
          endDate = moment.tz(timezone).endOf('day');
          break;
        case 'week':
          startDate = moment.tz(timezone).startOf('isoWeek');
          endDate = moment.tz(timezone).endOf('isoWeek');
          break;
        case 'month':
          startDate = moment.tz(timezone).startOf('month');
          endDate = moment.tz(timezone).endOf('month');
          break;
        default:
          startDate = moment.tz(timezone).startOf('day');
          endDate = moment.tz(timezone).endOf('day');
          break;
      }

      const utcStartDate = startDate.toDate();
      const utcEndDate = endDate.toDate();
      query.create = { $gte: utcStartDate, $lt: utcEndDate };
    }

    const appointments = await Appointment.find(query);

    const userIds = appointments.map(appointment => appointment.userId);

    const users = await User.find(
      {
        _id: { $in: userIds },
        active: true,
      },
      'name email phone image birthDate descricao points',
    ).lean();

    const userMap = new Map();
    users.forEach(user => {
      userMap.set(user._id.toString(), user);
    });

    const formattedAppointments = appointments.map((appointment: any) => {
      const user = userMap.get(appointment.userId.toString()) || {};

      return {
        id: appointment._id,
        userId: appointment.userId,
        userName: user.name || 'Unknown User',
        userEmail: user.email,
        userPhone: user.phone,
        userImage: user.image,
        userBirthDate: user.birthDate,
        userDescription: user.descricao,
        userPoints:
          user.points?.find((p: any) => p.barberId.toString() === barberId.toString())?.qtd || 0,
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
        userNumber: appointment.userNumber,
        modality: appointment.modality,
      };
    });

    res.json(formattedAppointments);
  } catch (error) {
    console.error('Erro ao buscar agendamentos para o calendário:', error);
    res.status(500).json({ error: 'Falha ao buscar agendamentos para o calendário' });
  }
};

export const updateUserIdByHashuser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId, hashuser } = req.body;

    if (!userId || !hashuser) {
      return res.status(400).json({
        error: 'userId e hashuser são obrigatórios',
      });
    }

    // Verificar se o usuário existe e está ativo
    const user = await User.findById(userId);
    if (!user || user.active !== true) {
      return res.status(404).json({
        error: 'Usuário não encontrado ou inativo',
      });
    }

    // Atualizar o agendamento usando o repository
    const updatedAppointment = await appointmentRepository.updateUserIdByHashuser(hashuser, userId);

    if (!updatedAppointment) {
      return res.status(404).json({ error: 'Agendamento não encontrado com o hashuser fornecido' });
    }

    res.status(200).json({
      message: 'Agendamento atualizado com sucesso',
      appointment: updatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

router.post('/', createAppointment);
router.post('/check-appointment', checkExistingAppointment);
router.get('/', getAllAppointments);
router.get('/user/:userId', getAllAppointmentsByUserId);
router.get('/barber/:barberId', getAllAppointmentsByBarberId);
router.get('/barber/manual/:barberId', getAllAppointmentsByBarberIdManual);
router.get('/barber/calendario/:barberId', getAllAppointmentsByBarberCalendario);
router.get('/:id', getAppointmentById);
router.get('/points/:id', getPoints);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);
router.put('/:id/approve', approveAppointment);
router.put('/:id/reject', rejectAppointment);
router.post('/add-points', addPoints);
router.post('/:id/exception', createException);
router.put('/:id/end-repeat', updateEndRepeat);
router.post('/cancel', cancelAppointment);
router.put('/import/agenda', updateUserIdByHashuser);

export default router;
