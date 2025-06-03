import { Request, Response } from 'express';
import { IAppService } from '../../entities/AppService';
import { appServiceRepository } from '../repositories/AppServiceRepository';

export const createAppServiceController = async (req: Request, res: Response): Promise<void> => {
  try {
    const appServiceData: IAppService = req.body;
    const appService = await appServiceRepository.create(appServiceData);
    res.status(201).json(appService);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating app service', error: error.message });
  }
};

export const getAppServiceByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appService = await appServiceRepository.findById(id);
    if (appService) {
      res.json(appService);
    } else {
      res.status(404).json({ error: 'App service not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error finding app service', error: error.message });
  }
};

export const getAllAppServicesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const appServices = await appServiceRepository.findAllActive(); // Use o método findAllActive
    res.json(appServices);
  } catch (error: any) {
    res.status(500).json({
      message: 'Error finding all active app services',
      error: error.message,
    });
  }
};

export const updateAppServiceController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const appServiceData: Partial<IAppService> = req.body;
    const appService = await appServiceRepository.update(id, appServiceData);
    if (appService) {
      res.json(appService);
    } else {
      res.status(404).json({ error: 'App service not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating app service', error: error.message });
  }
};

export const deleteAppServiceController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await appServiceRepository.delete(id);
    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'App service not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting app service', error: error.message });
  }
};

export const toggleAppServiceActiveController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const appService = await appServiceRepository.toggleActive(id);
    if (appService) {
      res.json(appService);
    } else {
      res.status(404).json({ error: 'App service not found' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Error toggling app service active state',
      error: error.message,
    });
  }
};

export const addCategoryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, active } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Category name is required' });
      return;
    }

    const appService = await appServiceRepository.addCategory(id, {
      name,
      active,
    });

    if (appService) {
      res.status(201).json(appService);
    } else {
      res.status(404).json({ error: 'App service not found' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Error adding category to app service',
      error: error.message,
    });
  }
};

export const updateCategoryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, categoryId } = req.params;
    const { name, active } = req.body;

    const appService = await appServiceRepository.updateCategory(id, categoryId, {
      name,
      active,
    });

    if (appService) {
      res.json(appService);
    } else {
      res.status(404).json({ error: 'App service or category not found' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Error updating category',
      error: error.message,
    });
  }
};

export const removeCategoryController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, categoryId } = req.params;

    const appService = await appServiceRepository.removeCategory(id, categoryId);

    if (appService) {
      res.json(appService);
    } else {
      res.status(404).json({ error: 'App service not found' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Error removing category from app service',
      error: error.message,
    });
  }
};

export const toggleCategoryActiveController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id, categoryId } = req.params;

    const appService = await appServiceRepository.toggleCategoryActive(id, categoryId);

    if (appService) {
      res.json(appService);
    } else {
      res.status(404).json({ error: 'App service or category not found' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Error toggling category active state',
      error: error.message,
    });
  }
};

export const addActivityController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, point, active } = req.body;

    if (!name) {
      res.status(400).json({ error: 'Activity name is required' });
      return;
    }

    const appService = await appServiceRepository.addActivity(id, {
      name,
      point,
      active,
    });

    if (appService) {
      res.status(201).json(appService);
    } else {
      res.status(404).json({ error: 'App service not found' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Error adding activity to app service',
      error: error.message,
    });
  }
};

export const updateActivityController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, activityId } = req.params;
    const { name, point, active } = req.body;

    const appService = await appServiceRepository.updateActivity(id, activityId, {
      name,
      point,
      active,
    });

    if (appService) {
      res.json(appService);
    } else {
      res.status(404).json({ error: 'App service or activity not found' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Error updating activity',
      error: error.message,
    });
  }
};

export const removeActivityController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, activityId } = req.params;

    const appService = await appServiceRepository.removeActivity(id, activityId);

    if (appService) {
      res.json(appService);
    } else {
      res.status(404).json({ error: 'App service not found' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Error removing activity from app service',
      error: error.message,
    });
  }
};

export const toggleActivityActiveController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id, activityId } = req.params;

    const appService = await appServiceRepository.toggleActivityActive(id, activityId);

    if (appService) {
      res.json(appService);
    } else {
      res.status(404).json({ error: 'App service or activity not found' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Error toggling activity active state',
      error: error.message,
    });
  }
};
