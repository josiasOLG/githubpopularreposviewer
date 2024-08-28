import { Types } from "mongoose";
import { Service } from "../../frameworks/orm/models/Service";
import { IService } from "../../entities/Service";

export interface IServiceRepository {
  create(service: IService): Promise<IService>;
  findById(id: string): Promise<IService | null>;
  findAll(): Promise<IService[]>;
  update(id: string, service: Partial<IService>): Promise<IService | null>;
  delete(id: string): Promise<boolean>;
}

export const createService = async (service: IService): Promise<IService> => {
  try {
    const newService = new Service(service);
    await newService.save();
    return newService.toObject();
  } catch (error: any) {
    throw new Error(`Error creating service: ${error.message}`);
  }
};

export const findById = async (id: string): Promise<IService | null> => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }
    const service = await Service.findById(id);
    return service ? service.toObject() : null;
  } catch (error: any) {
    throw new Error(`Error finding service by ID: ${error.message}`);
  }
};

export const findAll = async (): Promise<IService[]> => {
  try {
    const services = await Service.find();
    return services.map((service) => service.toObject());
  } catch (error: any) {
    throw new Error(`Error finding all services: ${error.message}`);
  }
};

export const updateService = async (
  id: string,
  service: Partial<IService>
): Promise<IService | null> => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }
    const updatedService = await Service.findByIdAndUpdate(id, service, {
      new: true,
    });
    return updatedService ? updatedService.toObject() : null;
  } catch (error: any) {
    throw new Error(`Error updating service: ${error.message}`);
  }
};

export const deleteService = async (id: string): Promise<boolean> => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error("Invalid ID format");
    }
    const result = await Service.findByIdAndDelete(id);
    return result ? true : false;
  } catch (error: any) {
    throw new Error(`Error deleting service: ${error.message}`);
  }
};
