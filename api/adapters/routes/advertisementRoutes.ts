import { Router } from 'express';
import advertisementController from '../controllers/AdvertisementController';

const router = Router();

router.use('/', advertisementController);

export default router;
