import { Request, Response, Router } from 'express';
import { CreateAdvertisement } from '../../usecases/advertisement/CreateAdvertisement';
import { DeleteAdvertisement } from '../../usecases/advertisement/DeleteAdvertisement';
import { GetAdvertisementsByProfessional } from '../../usecases/advertisement/GetAdvertisementsByProfessional';
import { GetAdvertisementsForUser } from '../../usecases/advertisement/GetAdvertisementsForUser';
import { UpdateAdvertisement } from '../../usecases/advertisement/UpdateAdvertisement';
import { AdvertisementRepository } from '../repositories/AdvertisementRepository';

const advertisementRepository = new AdvertisementRepository();
const router = Router();

export const createAdvertisement = async (req: Request, res: Response) => {
  try {
    const professionalId = req.userId as string;
    const advertisementData = {
      ...req.body,
      professionalId,
    };

    const createAdvertisement = new CreateAdvertisement(advertisementRepository);
    const advertisement = await createAdvertisement.execute(advertisementData);

    res.status(201).json(advertisement);
  } catch (error: any) {
    console.error('Error creating advertisement:', error);
    res.status(500).json({ error: error.message || 'Failed to create advertisement' });
  }
};

export const getAdvertisementsByProfessional = async (req: Request, res: Response) => {
  try {
    const professionalId = req.userId as string;

    const getAdvertisements = new GetAdvertisementsByProfessional(advertisementRepository);
    const advertisements = await getAdvertisements.execute(professionalId);

    res.json(advertisements);
  } catch (error: any) {
    console.error('Error getting advertisements by professional:', error);
    res.status(500).json({ error: error.message || 'Failed to get advertisements' });
  }
};

export const getAdvertisementsForUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId || (req.userId as string);

    const getAdvertisements = new GetAdvertisementsForUser(advertisementRepository);
    const advertisements = await getAdvertisements.execute(userId);

    res.json(advertisements);
  } catch (error: any) {
    console.error('Error getting advertisements for user:', error);
    res.status(500).json({ error: error.message || 'Failed to get advertisements for user' });
  }
};

export const getAdvertisementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const advertisement = await advertisementRepository.getById(id);

    if (!advertisement) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    res.json(advertisement);
  } catch (error: any) {
    console.error('Error getting advertisement by ID:', error);
    res.status(500).json({ error: error.message || 'Failed to get advertisement' });
  }
};

export const updateAdvertisement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const professionalId = req.userId as string;

    const existingAdvertisement = await advertisementRepository.getById(id);
    if (!existingAdvertisement) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    if (existingAdvertisement.professionalId.toString() !== professionalId) {
      return res.status(403).json({ error: 'Not authorized to update this advertisement' });
    }

    const updateAdvertisement = new UpdateAdvertisement(advertisementRepository);
    const advertisement = await updateAdvertisement.execute(id, req.body);

    if (!advertisement) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    res.json(advertisement);
  } catch (error: any) {
    console.error('Error updating advertisement:', error);
    res.status(500).json({ error: error.message || 'Failed to update advertisement' });
  }
};

export const deleteAdvertisement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const professionalId = req.userId as string;

    const existingAdvertisement = await advertisementRepository.getById(id);
    if (!existingAdvertisement) {
      return res.status(404).json({ error: 'Advertisement not found' });
    }

    if (existingAdvertisement.professionalId.toString() !== professionalId) {
      return res.status(403).json({ error: 'Not authorized to delete this advertisement' });
    }

    const deleteAdvertisement = new DeleteAdvertisement(advertisementRepository);
    await deleteAdvertisement.execute(id);

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting advertisement:', error);
    res.status(500).json({ error: error.message || 'Failed to delete advertisement' });
  }
};

router.post('/', createAdvertisement);
router.get('/', getAdvertisementsByProfessional);
router.get('/for-user/:userId?', getAdvertisementsForUser);
router.get('/:id', getAdvertisementById);
router.put('/:id', updateAdvertisement);
router.delete('/:id', deleteAdvertisement);

export default router;
