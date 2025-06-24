import { AdvertisementRepository } from '../../adapters/repositories/AdvertisementRepository';

export class DeleteAdvertisement {
  constructor(private advertisementRepository: AdvertisementRepository) {}

  async execute(advertisementId: string): Promise<void> {
    await this.advertisementRepository.delete(advertisementId);
  }
}
