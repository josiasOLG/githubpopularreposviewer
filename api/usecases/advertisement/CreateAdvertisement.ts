import { AdvertisementRepository } from '../../adapters/repositories/AdvertisementRepository';
import { IAdvertisement } from '../../entities/Advertisement';

export class CreateAdvertisement {
  constructor(private advertisementRepository: AdvertisementRepository) {}

  async execute(advertisementData: Partial<IAdvertisement>): Promise<IAdvertisement> {
    const advertisement = await this.advertisementRepository.create(advertisementData);
    return advertisement;
  }
}
