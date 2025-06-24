import { AdvertisementRepository } from '../../adapters/repositories/AdvertisementRepository';
import { IAdvertisement } from '../../entities/Advertisement';

export class GetAdvertisementsByProfessional {
  constructor(private advertisementRepository: AdvertisementRepository) {}

  async execute(professionalId: string): Promise<IAdvertisement[]> {
    const advertisements = await this.advertisementRepository.getByProfessionalId(professionalId);
    return advertisements;
  }
}
