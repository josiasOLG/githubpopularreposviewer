import { Request, Response, Router } from 'express';
import { CreateUser } from '../../usecases/user/CreateUser';
import { DeleteUser } from '../../usecases/user/DeleteUser';
import { GetUserById } from '../../usecases/user/GetUserById';
import { UpdateUser } from '../../usecases/user/UpdateUser';
import { AddressRepository } from '../repositories/AddressRepository';
import { appServiceRepository } from '../repositories/AppServiceRepository';
import { UserRepository } from '../repositories/UserRepository';

const userRepository = new UserRepository();
const addressRepository = new AddressRepository();

const router = Router();

export const createUser = async (req: Request, res: Response) => {
  try {
    const createUser = new CreateUser(userRepository);
    const user = await createUser.execute(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao criar usuário' });
  }
};

export const getAgendaConfig = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;

    const agendaConfig = await userRepository.getAgendaConfig(userId);

    if (!agendaConfig) {
      return res.status(404).json({ error: 'Agenda não configurada ou usuário não encontrado' });
    }

    res.status(200).json({ agendaConfig });
  } catch (error) {
    console.error('Erro ao obter agendaConfig:', error);
    res.status(500).json({ error: 'Erro ao obter agendaConfig' });
  }
};

export const getAgendaConfigService = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id as string;
    const service = req.params.service as string;

    const agendaConfig = await userRepository.getAgendaConfigService(userId, service);

    if (!agendaConfig) {
      return res.status(404).json({ error: 'Agenda não configurada ou usuário não encontrado' });
    }

    res.status(200).json({ agendaConfig });
  } catch (error) {
    console.error('Erro ao obter agendaConfig:', error);
    res.status(500).json({ error: 'Erro ao obter agendaConfig' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const getUserById = new GetUserById(userRepository);
    const user = await getUserById.execute(userId);

    if (user) {
      // Buscar o endereço do usuário
      const addresses = await addressRepository.findByIdUser(userId);
      const address = addresses.length > 0 ? addresses[0] : null;

      const filteredUser = {
        id: user._id,
        active: user.active,
        code: user.code,
        email: user.email,
        username: user.name,
        points: user.points,
        type: user.role,
        service: user.service,
        image: user.image,
        certificacoes: user.certificacoes,
        descricao: user.descricao,
        endTime: user.endTime,
        startTime: user.startTime,
        lunchEndTime: user.lunchEndTime,
        lunchStartTime: user.lunchStartTime,
        address: address
          ? {
              street: address.street,
              number: address.number,
              complement: address.complement,
              zipCode: address.zipCode,
              city: address.city,
              state: address.state,
              country: address.country,
              cpf: address.cpf,
              phoneNumber: address.phoneNumber,
              locality: address.locality,
            }
          : null,
      };
      res.json(filteredUser);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Falha ao obter usuário' });
  }
};

export const verifyUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const getUserById = new GetUserById(userRepository);
    const user = await getUserById.execute(userId);

    if (user) {
      if (!user.endTime || !user.startTime) {
        return res.status(400).json({
          error: 'HORAS TRABALHADAS IMCOMPLETO',
          message: 'Por favor, preencha todos os campos obrigatórios de horas trabalhadas.',
        });
      }

      const addresses = await addressRepository.findByIdUser(userId);
      const address = addresses.length > 0 ? addresses[0] : null;

      if (
        !address ||
        !address.street ||
        !address.locality ||
        !address.zipCode ||
        !address.cpf ||
        !address.phoneNumber
      ) {
        return res.status(406).json({
          error: 'Dados de endereço incompletos',
          message:
            'Por favor, preencha todos os campos obrigatórios do endereço (rua, bairro, CEP, CPF e número de telefone).',
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Falha ao obter usuário' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const updateUser = new UpdateUser(userRepository);
    const user = await updateUser.execute(userId, req.body);
    if (user) {
      res.status(200).json({ mensagem: 'Usuário atualizado com sucesso' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Falha ao atualizar usuário' });
  }
};

export const updateAgendaConfig = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const { agendaConfig } = req.body;

    if (!agendaConfig) {
      return res.status(400).json({ error: 'agendaConfig é obrigatório' });
    }

    const updatedUser = await userRepository.updateAgendaConfig(userId, agendaConfig);

    if (updatedUser) {
      res.status(200).json({ mensagem: 'Agenda atualizada com sucesso' });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar agenda' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string; // Acessa o ID do usuário autenticado
    const deleteUser = new DeleteUser(userRepository);
    await deleteUser.execute(userId);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao deletar usuário' });
  }
};

export const getBarbers = async (req: Request, res: Response) => {
  try {
    const barbers = await userRepository.getBarbers();

    const filteredBarbers = barbers.map(barber => ({
      id: barber._id,
      name: barber.name,
      email: barber.email,
      image: barber.image,
      service: barber.service,
      certificacoes: barber.certificacoes,
      descricao: barber.descricao,
      active: barber.active,
      points: barber.points, // Supondo que pontos seja relevante
      startTime: barber.startTime,
      endTime: barber.endTime,
      lunchStartTime: barber.lunchStartTime,
      lunchEndTime: barber.lunchEndTime,
    }));

    res.json(filteredBarbers);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao obter barbeiros' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { service } = req.body;

    const user = await userRepository.updateService(userId, service);

    if (user) {
      const filteredUser = {
        id: user._id,
        name: user.name,
        email: user.email,
        image: user.image,
        service: user.service,
        certificacoes: user.certificacoes,
        descricao: user.descricao,
        active: user.active,
        points: user.points,
      };
      res.json(filteredUser);
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Falha ao atualizar serviço' });
  }
};

export const pesquisar = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const { service } = req.params;

    if (!service) {
      return res.status(400).json({ error: 'Parâmetros de consulta e serviço são necessários' });
    }

    const appService = await appServiceRepository.findById(service);

    if (!appService || !appService.name) {
      return res.status(404).json({ error: 'Serviço não encontrado ou não possui um nome' });
    }

    const users = await userRepository.searchUsers(query as string | undefined, service);

    if (!users || users.length === 0) {
      return res.status(400).json({ error: 'Nenhum usuário encontrado' });
    }
    const usersWithAgendaConfig = users.filter(
      (user: any) => user.agendaConfig && Object.keys(user.agendaConfig.workDays).length > 0,
    );

    const userNames = usersWithAgendaConfig.map((user: any) => ({
      id: user._id,
      name: user.name,
      service: appService.name,
      certificacoes: user.certificacoes,
      descricao: user.descricao,
      email: user.email,
      startTime: user.startTime,
      lunchStartTime: user.lunchStartTime,
      lunchEndTime: user.lunchEndTime,
      endTime: user.endTime,
      interval: user.interval,
      image: user.image,
      role: user.role,
      address: user.address
        ? {
            street: user.address.street,
            number: user.address.number,
            complement: user.address.complement,
            zipCode: user.address.zipCode,
            city: user.address.city,
            state: user.address.state,
            country: user.address.country,
            cpf: user.address.cpf,
            phoneNumber: user.address.phoneNumber,
            locality: user.address.locality,
          }
        : null,
    }));

    res.json({
      service: {
        id: appService._id,
        name: appService.name,
      },
      users: userNames,
    });
  } catch (error) {
    console.error('Falha ao pesquisar usuários:', error);
    res.status(500).json({ error: 'Falha ao pesquisar usuários' });
  }
};

export const getBarberHoursById = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await userRepository.getById(userId);
    if (user) {
      res.json({
        startTime: user.startTime,
        lunchStartTime: user.lunchStartTime,
        lunchEndTime: user.lunchEndTime,
        endTime: user.endTime,
        interval: user.interval,
      });
    } else {
      res.status(404).json({ error: 'Barbeiro não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Falha ao obter horários do barbeiro' });
  }
};

export const getActive = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await userRepository.getById(userId);
    if (user) {
      res.json({
        active: user.active,
      });
    } else {
      res.status(404).json({ error: 'Barbeiro não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Falha ao obter status do barbeiro' });
  }
};

router.post('/', createUser);
router.get('/:id', getUserById);
router.get('/verifyUserById/:id', verifyUserById);
router.get('/:id/hours', getBarberHoursById); // Nova rota para obter horários de barbeiros
router.get('/pesquisar/:service', pesquisar);
router.put('/:id', updateUser);
router.put('/:id/service', updateService);
router.get('/:id/active', getActive);
router.delete('/:id', deleteUser);
router.put('/:id/agenda', updateAgendaConfig);
router.get('/:id/agenda', getAgendaConfig);
router.get('/:id/agenda/:service/service', getAgendaConfig);

export default router;
