import { Request, Response } from "express";
import { CreateUser } from "../../usecases/user/CreateUser";
import { GetUserById } from "../../usecases/user/GetUserById";
import { UpdateUser } from "../../usecases/user/UpdateUser";
import { DeleteUser } from "../../usecases/user/DeleteUser";
import { UserRepository } from "../repositories/UserRepository";
import { Router } from "express";
import { appServiceRepository } from "../repositories/AppServiceRepository";

const userRepository = new UserRepository();
const router = Router();

export const createUser = async (req: Request, res: Response) => {
  try {
    const createUser = new CreateUser(userRepository);
    const user = await createUser.execute(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Falha ao criar usuário" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string; // Acessa o ID do usuário autenticado
    const getUserById = new GetUserById(userRepository);
    const user = await getUserById.execute(userId);
    if (user) {
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
      };
      res.json(filteredUser);
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Falha ao obter usuário" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const updateUser = new UpdateUser(userRepository);
    const user = await updateUser.execute(userId, req.body);
    if (user) {
      res.status(200).json({ mensagem: "Usuário atualizado com sucesso" });
    } else {
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Falha ao atualizar usuário" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string; // Acessa o ID do usuário autenticado
    const deleteUser = new DeleteUser(userRepository);
    await deleteUser.execute(userId);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Falha ao deletar usuário" });
  }
};

export const getBarbers = async (req: Request, res: Response) => {
  try {
    const barbers = await userRepository.getBarbers();

    const filteredBarbers = barbers.map((barber) => ({
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
    res.status(500).json({ error: "Falha ao obter barbeiros" });
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
      res.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Falha ao atualizar serviço" });
  }
};

export const pesquisar = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const { service } = req.params;

    if (!service) {
      return res
        .status(400)
        .json({ error: "Parâmetros de consulta e serviço são necessários" });
    }

    // Buscar o serviço pelo ID (service) recebido nos parâmetros
    const appService = await appServiceRepository.findById(service);

    // Verifica se o serviço existe e tem um nome
    if (!appService || !appService.name) {
      return res
        .status(404)
        .json({ error: "Serviço não encontrado ou não possui um nome" });
    }

    // Buscar os usuários com base no serviço encontrado
    const users = await userRepository.searchUsers(
      query as string,
      service as string
    );

    // Mapear os dados de usuários para o retorno necessário
    const userNames = users.map((user) => ({
      id: user._id,
      name: user.name,
      service: appService.name,
      certificacoes: user.certificacoes,
      descricao: user.descricao,
      email: user.email,
    }));

    // Retornar um JSON contendo tanto o serviço quanto os usuários
    res.json({
      service: {
        id: appService._id,
        name: appService.name,
      },
      users: userNames,
    });
  } catch (error) {
    res.status(500).json({ error: "Falha ao pesquisar usuários" });
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
      res.status(404).json({ error: "Barbeiro não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Falha ao obter horários do barbeiro" });
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
      res.status(404).json({ error: "Barbeiro não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Falha ao obter status do barbeiro" });
  }
};

router.post("/", createUser);
router.get("/:id", getUserById);
router.get("/:id/hours", getBarberHoursById); // Nova rota para obter horários de barbeiros
router.get("/pesquisar/:service", pesquisar);
router.put("/:id", updateUser);
router.put("/:id/service", updateService);
router.get("/:id/active", getActive);
router.delete("/:id", deleteUser);

export default router;
