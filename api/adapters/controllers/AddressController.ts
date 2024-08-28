import { Request, Response } from "express";
import { addressRepository } from "../repositories/AddressRepository";
import { IAddress } from "../../entities/Address";

export const createAddressController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const addressData: IAddress = {
      ...req.body,
      idUser: req.params.userId, // Adiciona o id do usuário
    };
    const address = await addressRepository.create(addressData);
    res.status(201).json(address);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error creating address", error: error.message });
  }
};

export const getAddressByIdController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(id);
    const address = await addressRepository.findByIdUser(id);
    console.log(address);
    if (address) {
      res.json(address);
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error finding address", error: error.message });
  }
};

export const updateAddressController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const addressData: Partial<IAddress> = req.body;
    const address = await addressRepository.update(id, addressData);
    if (address) {
      res.json(address);
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error updating address", error: error.message });
  }
};

export const deleteAddressController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await addressRepository.delete(id);
    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: "Address not found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting address", error: error.message });
  }
};

export const createOrUpdateAddressController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const addressData: Partial<IAddress> = req.body;

    const addresses = await addressRepository.findByIdUser(id);
    if (addresses.length > 0) {
      const addressId = addresses[0]._id;
      const updatedAddress = await addressRepository.update(
        addressId,
        addressData
      );
      res.status(200).json(updatedAddress);
    } else {
      const newAddressData: any = {
        ...addressData,
        idUser: id,
      };
      const address = await addressRepository.create(newAddressData);
      res.status(201).json(address);
    }
  } catch (error: any) {
    res.status(500).json({
      message: "Error creating or updating address",
      error: error.message,
    });
  }
};

export const fetchAddressByCepController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { cep } = req.params;
    console.log(cep);
    const addressData = await addressRepository.fetchAddressFromCep(cep);
    res.status(200).json(addressData);
  } catch (error: any) {
    res.status(500).json({
      message: "Error fetching address from CEP",
      error: error.message,
    });
  }
};
