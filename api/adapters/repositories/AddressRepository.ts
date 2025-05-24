import { Types } from 'mongoose';
import { IAddress } from '../../entities/Address';
import { Address } from '../../frameworks/orm/models/Address';
import { formatCep } from '../../utils/utils';

export interface IAddressRepository {
  create(address: IAddress): Promise<IAddress>;
  findById(id: string): Promise<IAddress | null>;
  findByIdUser(idUser: string): Promise<IAddress[]>;
  findAll(): Promise<IAddress[]>;
  update(id: string, address: Partial<IAddress>): Promise<IAddress | null>;
  delete(id: string): Promise<boolean>;
  getAllAddressesByBarberId(barberId: string): Promise<IAddress[]>;
  fetchAddressFromCep(cep: string): Promise<any>;
}

export class AddressRepository implements IAddressRepository {
  async create(address: IAddress): Promise<IAddress> {
    try {
      const newAddress = new Address(address);
      await newAddress.save();
      return newAddress.toObject();
    } catch (error: any) {
      throw new Error(`Error creating address: ${error.message}`);
    }
  }

  async findById(id: string): Promise<IAddress | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      const address = await Address.findById(id);
      return address ? address.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error finding address by ID: ${error.message}`);
    }
  }

  async findByIdUser(idUser: string): Promise<IAddress[]> {
    try {
      if (!Types.ObjectId.isValid(idUser)) {
        throw new Error('Invalid ID format');
      }
      const addresses = await Address.find({ idUser });
      return addresses.map(address => address.toObject());
    } catch (error: any) {
      throw new Error(`Error finding addresses by user ID: ${error.message}`);
    }
  }

  async findAll(): Promise<IAddress[]> {
    try {
      const addresses = await Address.find();
      return addresses.map(address => address.toObject());
    } catch (error: any) {
      throw new Error(`Error finding all addresses: ${error.message}`);
    }
  }

  async update(id: string, address: Partial<IAddress>): Promise<IAddress | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      const updatedAddress = await Address.findByIdAndUpdate(id, address, {
        new: true,
      });
      return updatedAddress ? updatedAddress.toObject() : null;
    } catch (error: any) {
      throw new Error(`Error updating address: ${error.message}`);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        throw new Error('Invalid ID format');
      }
      const result = await Address.findByIdAndDelete(id);
      return result ? true : false;
    } catch (error: any) {
      throw new Error(`Error deleting address: ${error.message}`);
    }
  }

  async getAllAddressesByBarberId(barberId: string): Promise<IAddress[]> {
    try {
      const addresses = await Address.find({ barberId });
      return addresses.map(address => address.toObject());
    } catch (error: any) {
      throw new Error(`Error finding addresses by barber ID: ${error.message}`);
    }
  }

  async fetchAddressFromCep(cep: string): Promise<any> {
    try {
      // Format the CEP using the utility function
      const cleanCep = formatCep(cep);

      // Validate that we have a valid CEP
      if (!cleanCep) {
        throw new Error('CEP must have 8 digits');
      }

      // Make request to ViaCEP API
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);

      // Check if response is ok
      if (!response.ok) {
        throw new Error(
          `Failed to fetch address from CEP: ${response.status} ${response.statusText}`,
        );
      }

      // Parse response to JSON
      const data = await response.json();

      return data;
    } catch (error: any) {
      throw new Error(`Error fetching address from CEP: ${error.message}`);
    }
  }
}

export const addressRepository = new AddressRepository();
