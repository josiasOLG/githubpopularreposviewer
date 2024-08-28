import { Router } from "express";
import {
  createServiceController,
  getServiceByIdController,
  getAllServicesController,
  updateServiceController,
  deleteServiceController,
} from "../controllers/ServiceController";

const router = Router();

router.post("/", createServiceController);
router.get("/:id", getServiceByIdController);
router.get("/", getAllServicesController);
router.put("/:id", updateServiceController);
router.delete("/:id", deleteServiceController);

export default router;
