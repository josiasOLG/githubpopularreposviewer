import { AdvertisementRepository } from '../../adapters/repositories/AdvertisementRepository';
import { IAdvertisement } from '../../entities/Advertisement';

export class UpdateAdvertisement {
  constructor(private advertisementRepository: AdvertisementRepository) {}

  async execute(
    advertisementId: string,
    advertisementData: Partial<IAdvertisement>,
  ): Promise<IAdvertisement | null> {
    const advertisement = await this.advertisementRepository.update(
      advertisementId,
      advertisementData,
    );
    return advertisement;
  }
}
