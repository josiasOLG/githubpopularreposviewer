import { Router } from 'express';
import {
  addActivityController,
  addCategoryController,
  createAppServiceController,
  deleteAppServiceController,
  getAllAppServicesController,
  getAppServiceByIdController,
  removeActivityController,
  removeCategoryController,
  toggleActivityActiveController,
  toggleAppServiceActiveController,
  toggleCategoryActiveController,
  updateActivityController,
  updateAppServiceController,
  updateCategoryController,
} from '../controllers/AppServiceController';

const router = Router();

router.post('/', createAppServiceController);
router.get('/', getAllAppServicesController);
router.get('/:id', getAppServiceByIdController);
router.put('/:id', updateAppServiceController);
router.delete('/:id', deleteAppServiceController);
router.patch('/:id/toggle-active', toggleAppServiceActiveController);

// Category routes
router.post('/:id/categories', addCategoryController);
router.put('/:id/categories/:categoryId', updateCategoryController);
router.delete('/:id/categories/:categoryId', removeCategoryController);
router.patch('/:id/categories/:categoryId/toggle-active', toggleCategoryActiveController);

// Activity routes
router.post('/:id/activities', addActivityController);
router.put('/:id/activities/:activityId', updateActivityController);
router.delete('/:id/activities/:activityId', removeActivityController);
router.patch('/:id/activities/:activityId/toggle-active', toggleActivityActiveController);

export default router;
