import { Request, Response } from "express";
import { CreateBarber } from "../../usecases/barber/CreateBarber";
import { GetAllBarbers } from "../../usecases/barber/GetAllBarbers";
import { GetBarberById } from "../../usecases/barber/GetBarberById";
import { UpdateBarber } from "../../usecases/barber/UpdateBarber";
import { DeleteBarber } from "../../usecases/barber/DeleteBarber";
import { BarberRepository } from "../repositories/BarberRepository";
import { Router } from "express";
const barberRepository = new BarberRepository();
const router = Router();

export const createBarber = async (req: Request, res: Response) => {
  try {
    const createBarber = new CreateBarber(barberRepository);
    const barber = await createBarber.execute(req.body);
    res.status(201).json(barber);
  } catch (error) {
    res.status(500).json({ error: "Failed to create barber" });
  }
};

export const getAllBarbers = async (req: Request, res: Response) => {
  try {
    const getAllBarbers = new GetAllBarbers(barberRepository);
    const barbers = await getAllBarbers.execute();
    res.json(barbers);
  } catch (error) {
    res.status(500).json({ error: "Failed to get barbers" });
  }
};

export const getBarberById = async (req: Request, res: Response) => {
  try {
    const getBarberById = new GetBarberById(barberRepository);
    const barber = await getBarberById.execute(req.params.id);
    if (barber) {
      res.json(barber);
    } else {
      res.status(404).json({ error: "Barber not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get barber" });
  }
};

export const updateBarber = async (req: Request, res: Response) => {
  try {
    const updateBarber = new UpdateBarber(barberRepository);
    const barber = await updateBarber.execute(req.params.id, req.body);
    if (barber) {
      res.json(barber);
    } else {
      res.status(404).json({ error: "Barber not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update barber" });
  }
};

export const deleteBarber = async (req: Request, res: Response) => {
  try {
    const deleteBarber = new DeleteBarber(barberRepository);
    await deleteBarber.execute(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete barber" });
  }
};

router.post("/", createBarber);
router.get("/", getAllBarbers);
router.get("/:id", getBarberById);
router.put("/:id", updateBarber);
router.delete("/:id", deleteBarber);

export default router;
