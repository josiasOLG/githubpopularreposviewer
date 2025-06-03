import { Router } from 'express';
import {
  addAttachmentController,
  createGuidanceController,
  deleteGuidanceController,
  getActiveGuidancesByUserController,
  getAllGuidancesController,
  getExpiredGuidancesController,
  getGuidanceByIdController,
  getGuidancesByAppointmentIdController,
  getGuidancesByDateRangeController,
  getGuidancesByProfessionalController,
  getGuidancesByServiceAndCategoryController,
  getGuidancesByUserController,
  removeAttachmentController,
  toggleGuidanceActiveController,
  updateGuidanceController,
} from '../controllers/GuidanceController';

const router = Router();

// CRUD básico
router.post('/', createGuidanceController);
router.get('/', getAllGuidancesController);
router.get('/:id', getGuidanceByIdController);
router.put('/:id', updateGuidanceController);
router.delete('/:id', deleteGuidanceController);
router.patch('/:id/toggle-active', toggleGuidanceActiveController);

router.get('/user/:userId', getGuidancesByUserController);
router.get('/user/:userId/active', getActiveGuidancesByUserController);

router.get('/professional/:professionalId', getGuidancesByProfessionalController);

router.get('/appointment/:appointmentId', getGuidancesByAppointmentIdController);

router.get(
  '/service/:appServiceId/category/:categoryId',
  getGuidancesByServiceAndCategoryController,
);

router.get('/date-range/search', getGuidancesByDateRangeController);

router.get('/expired/list', getExpiredGuidancesController);

router.post('/:id/attachments', addAttachmentController);
router.delete('/:id/attachments/:attachmentId', removeAttachmentController);

export default router;
