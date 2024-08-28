import { Request, Response } from "express";
import {
  createService,
  findById,
  findAll,
  updateService,
  deleteService,
} from "../repositories/ServiceRepository";
import { IService } from "../../entities/Service";

export const createServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const serviceData: IService = req.body;
    const service = await createService(serviceData);
    res.status(201).json(service);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating service", error: error.message });
  }
};

export const getServiceByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await findById(id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error finding service", error: error.message });
  }
};

export const getAllServicesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const services = await findAll();
    res.json(services);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error finding services", error: error.message });
  }
};

export const updateServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const serviceData: Partial<IService> = req.body;
    const service = await updateService(id, serviceData);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating service", error: error.message });
  }
};

export const deleteServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await deleteService(id);
    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "Service not found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting service", error: error.message });
  }
};
