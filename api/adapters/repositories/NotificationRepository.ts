import { Notification } from "../../entities/Notification";
import { Notification as NotificationModel } from "../../frameworks/orm/models/Notification";

export class NotificationRepository {
  async create(notificationData: Notification): Promise<Notification> {
    const notification = await NotificationModel.create(notificationData);
    return notification.toObject();
  }
}
