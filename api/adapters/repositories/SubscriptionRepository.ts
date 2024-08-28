import { ISubscriptions } from "../../entities/Subscription";
import { SubscriptionModel } from "../../frameworks/orm/models/Subscription";

export class SubscriptionRepository {
  async getAllSubscriptionsByBarberId(
    barberId: string
  ): Promise<ISubscriptions[]> {
    const subscriptions = await SubscriptionModel.find({ barberId }).exec();
    return subscriptions.map((subscription: any) => subscription.toObject());
  }

  async getAllSubscriptionsByUserId(userId: string): Promise<ISubscriptions[]> {
    const subscriptions = await SubscriptionModel.find({ userId }).exec();
    return subscriptions.map((subscription: any) => subscription.toObject());
  }
}
