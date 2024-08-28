import mongoose, { Document, Schema } from "mongoose";

export interface ISubscriptionPlan extends Document {
  idPagseguro: string;
  reference: string;
  name: string;
  description: string;
  charge: string;
  period: string;
  amountPerPayment: number;
  expiration: {
    value: number;
    unit: string;
  };
}

const SubscriptionPlanSchema: Schema = new Schema({
  idPagseguro: { type: String, required: false, unique: true },
  reference: { type: String, required: false, unique: false },
  name: { type: String, required: false },
  description: { type: String, required: false },
  charge: { type: String, required: false },
  period: { type: String, required: false },
  amountPerPayment: { type: Number, required: false },
  expiration: {
    value: { type: Number, required: false },
    unit: { type: String, required: false },
  },
});

export default mongoose.model<ISubscriptionPlan>(
  "SubscriptionPlan",
  SubscriptionPlanSchema
);
