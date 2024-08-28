import { Notification } from "../../entities/Notification";
import { NotificationRepository } from "../../adapters/repositories/NotificationRepository";

export class SendNotification {
  constructor(private notificationRepository: NotificationRepository) {}

  async execute(notificationData: Notification): Promise<Notification> {
    return this.notificationRepository.create(notificationData);
  }
}
