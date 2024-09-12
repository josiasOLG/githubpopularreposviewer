import { Request, Response } from "express";
import { appServiceRepository } from "../repositories/AppServiceRepository";
import { IAppService } from "../../entities/AppService";

export const createAppServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const appServiceData: IAppService = req.body;
    const appService = await appServiceRepository.create(appServiceData);
    res.status(201).json(appService);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating app service", error: error.message });
  }
};

export const getAppServiceByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const appService = await appServiceRepository.findById(id);
    if (appService) {
      res.json(appService);
    } else {
      res.status(404).json({ error: "App service not found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error finding app service", error: error.message });
  }
};

export const getAllAppServicesController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const appServices = await appServiceRepository.findAllActive(); // Use o método findAllActive
    res.json(appServices);
  } catch (error: any) {
    res.status(500).json({
      message: "Error finding all active app services",
      error: error.message,
    });
  }
};

export const updateAppServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const appServiceData: Partial<IAppService> = req.body;
    const appService = await appServiceRepository.update(id, appServiceData);
    if (appService) {
      res.json(appService);
    } else {
      res.status(404).json({ error: "App service not found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating app service", error: error.message });
  }
};

export const deleteAppServiceController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await appServiceRepository.delete(id);
    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "App service not found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting app service", error: error.message });
  }
};

export const toggleAppServiceActiveController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const appService = await appServiceRepository.toggleActive(id);
    if (appService) {
      res.json(appService);
    } else {
      res.status(404).json({ error: "App service not found" });
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Error toggling app service active state",
      error: error.message,
    });
  }
};
