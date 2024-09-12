import { Types } from "mongoose";
import { AppService } from "../../frameworks/orm/models/AppService";
import { IAppService } from "../../entities/AppService";

export interface IAppServiceRepository {
  create(appService: IAppService): Promise<IAppService>;
  findById(id: string): Promise<IAppService | null>;
  findAll(): Promise<IAppService[]>;
  update(
    id: string,
    appService: Partial<IAppService>
  ): Promise<IAppService | null>;
  delete(id: string): Promise<boolean>;
  toggleActive(id: string): Promise<IAppService | null>;
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
        throw new Error("Invalid ID format");
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
      return appServices.map((appService) => appService.toObject());
    } catch (error: any) {
      throw new Error(`Error finding all app services: ${error.message}`);
    }
  }

  async update(
    id: string,
    appService: Partial<IAppService>
  ): Promise<IAppService | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
      }
      const updatedAppService = await AppService.findByIdAndUpdate(
        id,
        appService,
        {
          new: true,
        }
      );
      return updatedAppService ? updatedAppService.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error updating app service: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ID format");
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
        throw new Error("Invalid ID format");
      }
      const appService = await AppService.findById(id);
      if (!appService) {
        return null;
      }
      appService.active = !appService.active;
      await appService.save();
      return appService.toObject();
    } catch (error: any) {
      throw new Error(
        `Error toggling app service active state: ${error.message}`
      );
    }
  }

  async findAllActive(): Promise<IAppService[]> {
    try {
      const appServices = await AppService.find({ active: true }); // Filtra por active: true
      return appServices.map((appService) => appService.toObject());
    } catch (error: any) {
      throw new Error(
        `Error finding all active app services: ${error.message}`
      );
    }
  }
}

export const appServiceRepository = new AppServiceRepository();
