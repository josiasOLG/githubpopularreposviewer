import { Router } from "express";
import {
  createQRCodeController,
  findQRCodeByIdController,
  findQRCodesByUserIdController,
  updateQRCodeController,
  deleteQRCodeController,
  updateQRCodeByBarberIdAndCodeController,
} from "../controllers/QrCodeController";

const router = Router();

router.post("/generate", createQRCodeController);
router.get("/:id", findQRCodeByIdController);
router.get("/user/:userId", findQRCodesByUserIdController);
router.put("/:id", updateQRCodeController);
router.delete("/:id", deleteQRCodeController);
router.put(
  "/updateByBarberIdAndCode/:barberId",
  updateQRCodeByBarberIdAndCodeController
); // Adicione esta linha

export default router;
