import { Router } from "express";
import {
  createAvailability,
  getAvailabilityByBarber,
  updateAvailability,
} from "../controllers/AvailabilityController";

const router = Router();

router.post("/", createAvailability);
router.get("/", getAvailabilityByBarber);
router.put("/", updateAvailability);

export default router;
