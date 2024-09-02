import { Request, Response } from "express";
import { CreateUser } from "../../usecases/user/CreateUser";
import { GetUserById } from "../../usecases/user/GetUserById";
import { UpdateUser } from "../../usecases/user/UpdateUser";
import { DeleteUser } from "../../usecases/user/DeleteUser";
import { UserRepository } from "../repositories/UserRepository";
import { Router } from "express";

const userRepository = new UserRepository();
const router = Router();

export const createUser = async (req: Request, res: Response) => {
  try {
    const createUser = new CreateUser(userRepository);
    const user = await createUser.execute(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string; // Acessa o ID do usuário autenticado
    const getUserById = new GetUserById(userRepository);
    const user = await getUserById.execute(userId);
    if (user) {
      const filteredUser = {
        accessToken: user.accessToken,
        active: user.active,
        code: user.code,
        email: user.email,
        name: user.name,
        points: user.points,
        role: user.role,
        service: user.service,
      };
      res.json(filteredUser);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get user" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string;
    const updateUser = new UpdateUser(userRepository);
    const user = await updateUser.execute(userId, req.body);
    console.log(req.body);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update user" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId as string; // Acessa o ID do usuário autenticado
    const deleteUser = new DeleteUser(userRepository);
    await deleteUser.execute(userId);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const getBarbers = async (req: Request, res: Response) => {
  try {
    const barbers = await userRepository.getBarbers();
    res.json(barbers);
  } catch (error) {
    res.status(500).json({ error: "Failed to get barbers" });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { service } = req.body;
    const user = await userRepository.updateService(userId, service);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update service" });
  }
};

export const pesquisar = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    const { service } = req.params;
    if (!service) {
      return res
        .status(400)
        .json({ error: "Query and service parameters are required" });
    }

    const users = await userRepository.searchUsers(
      query as string,
      service as string
    );
    const userNames = users.map((user) => ({
      id: user._id,
      name: user.name,
      service: user.service,
      certificacoes: user.certificacoes,
      descricao: user.descricao,
      email: user.email,
    }));
    res.json(userNames);
  } catch (error) {
    res.status(500).json({ error: "Failed to search users" });
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
      res.status(404).json({ error: "Barber not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get barber hours" });
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
      res.status(404).json({ error: "Barber not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get barber hours" });
  }
};

router.post("/", createUser);
router.get("/:id", getUserById);
router.get("/:id/hours", getBarberHoursById); // New route for getting barber hours
router.get("/pesquisar/:service", pesquisar);
router.put("/:id", updateUser);
router.put("/:id/service", updateService);
router.get("/:id/active", getActive);
router.delete("/:id", deleteUser);

export default router;
