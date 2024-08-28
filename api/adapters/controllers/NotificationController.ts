import { Request, Response } from "express";
import { SendNotification } from "../../usecases/notification/SendNotification";
import { NotificationRepository } from "../repositories/NotificationRepository";
import { Router } from "express";
const notificationRepository = new NotificationRepository();
const router = Router();

export const sendNotification = async (req: Request, res: Response) => {
  try {
    const sendNotification = new SendNotification(notificationRepository);
    const notification = await sendNotification.execute(req.body);
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to send notification" });
  }
};

router.post("/", sendNotification);

export default router;
