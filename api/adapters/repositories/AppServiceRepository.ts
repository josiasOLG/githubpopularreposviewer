import { Types } from 'mongoose';
import { IAppService } from '../../entities/AppService';
import { AppService } from '../../frameworks/orm/models/AppService';

export interface IAppServiceRepository {
  create(appService: IAppService): Promise<IAppService>;
  findById(id: string): Promise<IAppService | null>;
  findAll(): Promise<IAppService[]>;
  update(id: string, appService: Partial<IAppService>): Promise<IAppService | null>;
  delete(id: string): Promise<boolean>;
  toggleActive(id: string): Promise<IAppService | null>;
  findAllActive(): Promise<IAppService[]>;
  addCategory(
    serviceId: string,
    categoryData: { name: string; active?: boolean },
  ): Promise<IAppService | null>;
  updateCategory(
    serviceId: string,
    categoryId: string,
    categoryData: { name?: string; active?: boolean },
  ): Promise<IAppService | null>;
  removeCategory(serviceId: string, categoryId: string): Promise<IAppService | null>;
  toggleCategoryActive(serviceId: string, categoryId: string): Promise<IAppService | null>;
  addActivity(
    serviceId: string,
    activityData: { name: string; point?: number; active?: boolean },
  ): Promise<IAppService | null>;
  updateActivity(
    serviceId: string,
    activityId: string,
    activityData: { name?: string; point?: number; active?: boolean },
  ): Promise<IAppService | null>;
  removeActivity(serviceId: string, activityId: string): Promise<IAppService | null>;
  toggleActivityActive(serviceId: string, activityId: string): Promise<IAppService | null>;
  findCategoryById(serviceId: string, categoryId: string): Promise<any | null>;
}

export class AppServiceRepository implements IAppServiceRepository {
  async create(appService: IAppService): Promise<IAppService> {
    try {
      const newAppService = new AppService(appService);
      await newAppService.save();
      return newAppService.toObject();
    } catch (error: any) {
      throw new Error(`Error creating app service: ${error.message}`);
    }
  }

  async findById(id: string): Promise<IAppService | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      const appService = await AppService.findById(id);
      return appService ? appService.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error finding app service by ID: ${error.message}`);
    }
  }

  async findAll(): Promise<IAppService[]> {
    try {
      const appServices = await AppService.find();
      return appServices.map(appService => appService.toObject());
    } catch (error: any) {
      throw new Error(`Error finding all app services: ${error.message}`);
    }
  }

  async update(id: string, appService: Partial<IAppService>): Promise<IAppService | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      const updatedAppService = await AppService.findByIdAndUpdate(id, appService, {
        new: true,
      });
      return updatedAppService ? updatedAppService.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error updating app service: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      const result = await AppService.findByIdAndDelete(id);
      return result ? true : false;
    } catch (error: any) {
      throw new Error(`Error deleting app service: ${error.message}`);
    }
  }

  async toggleActive(id: string): Promise<IAppService | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      const appService = await AppService.findById(id);
      if (!appService) {
        return null;
      }
      appService.active = !appService.active;
      await appService.save();
      return appService.toObject();
    } catch (error: any) {
      throw new Error(`Error toggling app service active state: ${error.message}`);
    }
  }

  async findAllActive(): Promise<IAppService[]> {
    try {
      const appServices = await AppService.find({ active: true }); // Filtra por active: true
      return appServices.map(appService => appService.toObject());
    } catch (error: any) {
      throw new Error(`Error finding all active app services: ${error.message}`);
    }
  }

  async addCategory(
    serviceId: string,
    categoryData: { name: string; active?: boolean },
  ): Promise<IAppService | null> {
    try {
      if (!Types.ObjectId.isValid(serviceId)) {
        throw new Error('Invalid service ID format');
      }

      const updatedService = await AppService.findByIdAndUpdate(
        serviceId,
        {
          $push: {
            categories: {
              name: categoryData.name,
              active: categoryData.active ?? true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
        { new: true },
      );

      return updatedService ? updatedService.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error adding category to service: ${error.message}`);
    }
  }

  async updateCategory(
    serviceId: string,
    categoryId: string,
    categoryData: { name?: string; active?: boolean },
  ): Promise<IAppService | null> {
    try {
      if (!Types.ObjectId.isValid(serviceId)) {
        throw new Error('Invalid service ID format');
      }

      const updateFields: any = {};
      if (categoryData.name !== undefined) {
        updateFields['categories.$.name'] = categoryData.name;
      }
      if (categoryData.active !== undefined) {
        updateFields['categories.$.active'] = categoryData.active;
      }
      updateFields['categories.$.updatedAt'] = new Date();

      const updatedService = await AppService.findOneAndUpdate(
        { _id: serviceId, 'categories._id': categoryId },
        { $set: updateFields },
        { new: true },
      );

      return updatedService ? updatedService.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error updating category: ${error.message}`);
    }
  }

  async removeCategory(serviceId: string, categoryId: string): Promise<IAppService | null> {
    try {
      if (!Types.ObjectId.isValid(serviceId)) {
        throw new Error('Invalid service ID format');
      }

      const updatedService = await AppService.findByIdAndUpdate(
        serviceId,
        { $pull: { categories: { _id: categoryId } } },
        { new: true },
      );

      return updatedService ? updatedService.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error removing category from service: ${error.message}`);
    }
  }

  async toggleCategoryActive(serviceId: string, categoryId: string): Promise<IAppService | null> {
    try {
      if (!Types.ObjectId.isValid(serviceId)) {
        throw new Error('Invalid service ID format');
      }

      const service = await AppService.findById(serviceId);
      if (!service) {
        return null;
      }

      const category = service.categories.find(cat => cat._id?.toString() === categoryId);
      if (!category) {
        throw new Error('Category not found');
      }

      const updatedService = await AppService.findOneAndUpdate(
        { _id: serviceId, 'categories._id': categoryId },
        {
          $set: {
            'categories.$.active': !category.active,
            'categories.$.updatedAt': new Date(),
          },
        },
        { new: true },
      );

      return updatedService ? updatedService.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error toggling category active state: ${error.message}`);
    }
  }

  async addActivity(
    serviceId: string,
    activityData: { name: string; point?: number; active?: boolean },
  ): Promise<IAppService | null> {
    try {
      if (!Types.ObjectId.isValid(serviceId)) {
        throw new Error('Invalid service ID');
      }

      const updatedService = await AppService.findByIdAndUpdate(
        serviceId,
        {
          $push: {
            activities: {
              name: activityData.name,
              point: activityData.point ?? 0,
              active: activityData.active ?? true,
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          },
        },
        { new: true },
      );

      return updatedService ? updatedService.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error adding activity to service: ${error.message}`);
    }
  }

  async updateActivity(
    serviceId: string,
    activityId: string,
    activityData: { name?: string; point?: number; active?: boolean },
  ): Promise<IAppService | null> {
    try {
      if (!Types.ObjectId.isValid(serviceId)) {
        throw new Error('Invalid service ID');
      }

      const updateFields: any = {};
      if (activityData.name !== undefined) {
        updateFields['activities.$.name'] = activityData.name;
      }
      if (activityData.point !== undefined) {
        updateFields['activities.$.point'] = activityData.point;
      }
      if (activityData.active !== undefined) {
        updateFields['activities.$.active'] = activityData.active;
      }
      updateFields['activities.$.updatedAt'] = new Date();

      const updatedService = await AppService.findOneAndUpdate(
        { _id: serviceId, 'activities._id': activityId },
        { $set: updateFields },
        { new: true },
      );

      return updatedService ? updatedService.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error updating activity: ${error.message}`);
    }
  }

  async removeActivity(serviceId: string, activityId: string): Promise<IAppService | null> {
    try {
      if (!Types.ObjectId.isValid(serviceId)) {
        throw new Error('Invalid service ID');
      }

      const updatedService = await AppService.findByIdAndUpdate(
        serviceId,
        { $pull: { activities: { _id: activityId } } },
        { new: true },
      );

      return updatedService ? updatedService.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error removing activity from service: ${error.message}`);
    }
  }

  async toggleActivityActive(serviceId: string, activityId: string): Promise<IAppService | null> {
    try {
      if (!Types.ObjectId.isValid(serviceId)) {
        throw new Error('Invalid service ID');
      }

      const service = await AppService.findById(serviceId);
      if (!service) {
        throw new Error('Service not found');
      }

      const activity = service.activities.find(act => act._id?.toString() === activityId);
      if (!activity) {
        throw new Error('Activity not found');
      }

      const updatedService = await AppService.findOneAndUpdate(
        { _id: serviceId, 'activities._id': activityId },
        {
          $set: {
            'activities.$.active': !activity.active,
            'activities.$.updatedAt': new Date(),
          },
        },
        { new: true },
      );

      return updatedService ? updatedService.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error toggling activity active state: ${error.message}`);
    }
  }

  async findCategoryById(serviceId: string, categoryId: string): Promise<any | null> {
    try {
      if (!Types.ObjectId.isValid(serviceId)) {
        throw new Error('Invalid service ID format');
      }

      const appService = await AppService.findById(serviceId);
      if (!appService) {
        return null;
      }

      // Buscar a categoria pelo ID
      const category = appService.categories.find(
        category => category._id && category._id.toString() === categoryId,
      );

      return category || null;
    } catch (error: any) {
      throw new Error(`Error finding category by ID: ${error.message}`);
    }
  }
}

export const appServiceRepository = new AppServiceRepository();
