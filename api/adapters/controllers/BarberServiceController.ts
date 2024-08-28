import { Request, Response } from "express";
import { BarberServiceRepository } from "../repositories/BarberServiceRepository";
import { Router } from "express";

const barberServiceRepository = new BarberServiceRepository();
const router = Router();

export const createBarberService = async (req: Request, res: Response) => {
  try {
    const { userId, ...serviceData } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const barberService = await barberServiceRepository.create({
      ...serviceData,
      userId,
    });
    res.status(201).json(barberService);
  } catch (error) {
    res.status(500).json({ error: "Failed to create barber service" });
  }
};

export const getAllServicePerfils = async (req: Request, res: Response) => {
  try {
    const userId = req.params.barberId;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const servicePerfils = await barberServiceRepository.getAll(
      userId as string
    );
    res.json(servicePerfils);
  } catch (error) {
    res.status(500).json({ error: "Failed to get service perfils" });
  }
};

export const getAllBarberServices = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    const barberServices = await barberServiceRepository.getAll(userId);
    res.json(barberServices);
  } catch (error) {
    res.status(500).json({ error: "Failed to get barber services" });
  }
};

export const getBarberServiceById = async (req: Request, res: Response) => {
  try {
    const barberService = await barberServiceRepository.getAll(req.params.id);
    if (barberService) {
      res.json(barberService);
    } else {
      res.status(404).json({ error: "Barber service not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get barber service" });
  }
};

export const updateBarberService = async (req: Request, res: Response) => {
  try {
    const barberService = await barberServiceRepository.update(
      req.params.id,
      req.body
    );
    if (barberService) {
      res.json(barberService);
    } else {
      res.status(404).json({ error: "Barber service not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update barber service" });
  }
};

export const deleteBarberService = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);
    await barberServiceRepository.delete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete barber service" });
  }
};

router.post("/", createBarberService);
router.get("/", getAllBarberServices);
router.get("/services/:barberId", getAllServicePerfils);
router.get("/:id", getBarberServiceById);
router.put("/:id", updateBarberService);
router.delete("/:id", deleteBarberService);

export default router;
