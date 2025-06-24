import { AdvertisementRepository } from '../../adapters/repositories/AdvertisementRepository';
import { IAdvertisement } from '../../entities/Advertisement';

export class GetAdvertisementsForUser {
  constructor(private advertisementRepository: AdvertisementRepository) {}

  async execute(userId: string): Promise<IAdvertisement[]> {
    const advertisements = await this.advertisementRepository.getAdvertisementsForUser(userId);
    return advertisements;
  }
}
