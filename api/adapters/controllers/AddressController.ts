import { Request, Response } from 'express';
import { IAddress } from '../../entities/Address';
import { formatCep, formatViaCepResponse, isValidCep } from '../../utils/utils';
import { addressRepository } from '../repositories/AddressRepository';

export const createAddressController = async (req: Request, res: Response): Promise<void> => {
  try {
    const addressData: IAddress = {
      ...req.body,
      idUser: req.params.userId,
    };
    const address = await addressRepository.create(addressData);
    res.status(201).json(address);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating address', error: error.message });
  }
};

export const getAddressByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const address = await addressRepository.findByIdUser(id);
    if (address) {
      res.json(address);
    } else {
      res.status(404).json({ error: 'Address not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error finding address', error: error.message });
  }
};

export const updateAddressController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const addressData: Partial<IAddress> = req.body;
    const address = await addressRepository.update(id, addressData);
    if (address) {
      res.json(address);
    } else {
      res.status(404).json({ error: 'Address not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating address', error: error.message });
  }
};

export const deleteAddressController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await addressRepository.delete(id);
    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Address not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting address', error: error.message });
  }
};

export const createOrUpdateAddressController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const addressData: Partial<IAddress> = req.body;

    const addresses = await addressRepository.findByIdUser(id);
    if (addresses.length > 0) {
      const addressId = addresses[0]._id;
      const updatedAddress = await addressRepository.update(addressId, addressData);
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
      message: 'Error creating or updating address',
      error: error.message,
    });
  }
};

export const fetchAddressByCepController = async (req: Request, res: Response): Promise<void> => {
  /**
   * @swagger
   * /addresses/cep/{cep}:
   *   get:
   *     summary: Get address information from a Brazilian CEP (postal code)
   *     description: Retrieves address information from the ViaCEP API based on the provided CEP
   *     parameters:
   *       - in: path
   *         name: cep
   *         schema:
   *           type: string
   *         required: true
   *         description: Brazilian postal code (CEP) - format: 12345-678 or 12345678
   *     responses:
   *       200:
   *         description: Address information retrieved successfully
   *       400:
   *         description: Invalid CEP format
   *       404:
   *         description: CEP not found
   *       500:
   *         description: Server error
   */
  try {
    const { cep } = req.params;

    // Validate CEP format
    if (!isValidCep(cep)) {
      res.status(400).json({
        message: 'Invalid CEP format. Please provide a valid Brazilian postal code (8 digits).',
      });
      return;
    }

    // Format CEP
    const cleanCep = formatCep(cep);
    if (!cleanCep) {
      res.status(400).json({
        message: 'Invalid CEP. CEP must have 8 digits.',
      });
      return;
    }

    // Fetch address data from ViaCEP API
    const addressData = await addressRepository.fetchAddressFromCep(cleanCep);

    // Check if ViaCEP returned an error
    if (addressData.erro) {
      res.status(404).json({
        message: 'CEP not found',
        cep,
      });
      return;
    }

    // Format the address using the utility function
    const formattedAddress = formatViaCepResponse(addressData);

    res.status(200).json(formattedAddress);
  } catch (error: any) {
    res.status(500).json({
      message: 'Error fetching address from CEP',
      error: error.message,
    });
  }
};

export const createAddressFromCepController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  /**
   * @swagger
   * /addresses/cep/{cep}:
   *   post:
   *     summary: Create or update an address using CEP information
   *     description: Creates a new address or updates an existing one for a user based on CEP information from ViaCEP API
   *     parameters:
   *       - in: path
   *         name: cep
   *         schema:
   *           type: string
   *         required: true
   *         description: Brazilian postal code (CEP) - format: 12345-678 or 12345678
   *     requestBody:
   *       required: false
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               idUser:
   *                 type: string
   *                 description: User ID for whom to create/update address
   *               number:
   *                 type: string
   *                 description: House/building number
   *               complement:
   *                 type: string
   *                 description: Additional address information
   *     responses:
   *       200:
   *         description: Address updated successfully or retrieved if no idUser provided
   *       201:
   *         description: Address created successfully
   *       400:
   *         description: Invalid CEP format
   *       404:
   *         description: CEP not found
   *       500:
   *         description: Server error
   */
  try {
    const { cep } = req.params;
    const { idUser, number, complement } = req.body;

    // Validate CEP format
    if (!isValidCep(cep)) {
      res.status(400).json({
        message: 'Invalid CEP format. Please provide a valid Brazilian postal code (8 digits).',
      });
      return;
    }

    // Format CEP
    const cleanCep = formatCep(cep);
    if (!cleanCep) {
      res.status(400).json({
        message: 'Invalid CEP. CEP must have 8 digits.',
      });
      return;
    }

    // Fetch address data from ViaCEP API
    const addressData = await addressRepository.fetchAddressFromCep(cleanCep);

    // Check if ViaCEP returned an error
    if (addressData.erro) {
      res.status(404).json({
        message: 'CEP not found',
        cep,
      });
      return;
    }

    // Format the address using the utility function
    const formattedAddress = formatViaCepResponse(addressData);

    // Add additional data from request
    const newAddressData: any = {
      ...formattedAddress,
      idUser,
      number,
      complement: complement || formattedAddress.complement,
    };

    // Check if user already has an address
    if (idUser) {
      const addresses = await addressRepository.findByIdUser(idUser);

      if (addresses.length > 0) {
        // Update existing address
        const addressId = addresses[0]._id;
        const updatedAddress = await addressRepository.update(addressId, newAddressData);
        res.status(200).json({
          message: 'Address updated successfully',
          address: updatedAddress,
        });
      } else {
        // Create new address
        const address = await addressRepository.create(newAddressData);
        res.status(201).json({
          message: 'Address created successfully',
          address,
        });
      }
    } else {
      // Just return the formatted address without saving if no user ID is provided
      res.status(200).json(formattedAddress);
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Error processing address from CEP',
      error: error.message,
    });
  }
};
