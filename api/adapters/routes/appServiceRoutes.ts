import { Router } from "express";
import {
  createAppServiceController,
  getAppServiceByIdController,
  getAllAppServicesController,
  updateAppServiceController,
  deleteAppServiceController,
  toggleAppServiceActiveController,
} from "../controllers/AppServiceController";

const router = Router();

router.post("/", createAppServiceController);
router.get("/", getAllAppServicesController);
router.get("/:id", getAppServiceByIdController);
router.put("/:id", updateAppServiceController);
router.delete("/:id", deleteAppServiceController);
router.patch("/:id/toggle-active", toggleAppServiceActiveController);

export default router;
