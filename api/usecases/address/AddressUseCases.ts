import { IAddress } from "../../entities/Address";
import { IAddressRepository } from "../../adapters/repositories/AddressRepository";

export class CreateAddress {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(address: IAddress): Promise<IAddress> {
    return this.addressRepository.create(address);
  }
}

export class GetAddressById {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(id: string): Promise<IAddress | null> {
    return this.addressRepository.findById(id);
  }
}

export class UpdateAddress {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(
    id: string,
    address: Partial<IAddress>
  ): Promise<IAddress | null> {
    return this.addressRepository.update(id, address);
  }
}

export class DeleteAddress {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.addressRepository.delete(id);
  }
}

export class GetAllAddresses {
  constructor(private readonly addressRepository: IAddressRepository) {}

  async execute(): Promise<IAddress[]> {
    return this.addressRepository.findAll();
  }
}
