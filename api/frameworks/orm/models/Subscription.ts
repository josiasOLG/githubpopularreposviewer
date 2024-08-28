import mongoose, { Document, Schema } from "mongoose";

export interface ISubscription extends Document {
  userId: string;
  idPagseguro: string;
  reference_id: string;
  amount: {
    value: number;
    currency: string;
  };
  status: string;
  plan: {
    id: string;
    name: string;
  };
  payment_method: {
    type: string;
    card: {
      brand: string;
      first_digits: string;
      last_digits: string;
      exp_month: string;
      exp_year: string;
      holder: {
        name: string;
      };
    };
  }[];
  next_invoice_at: string;
  pro_rata: boolean;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  links: {
    rel: string;
    href: string;
    media: string;
    type: string;
  }[];
}

const SubscriptionSchema: Schema = new Schema({
  userId: { type: String, required: true },
  idPagseguro: { type: String, required: true, unique: true },
  reference_id: { type: String, required: true },
  amount: {
    value: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  status: { type: String, required: true },
  plan: {
    id: { type: String, required: true },
    name: { type: String, required: true },
  },
  payment_method: [
    {
      type: { type: String, required: true },
      card: {
        brand: { type: String, required: true },
        first_digits: { type: String, required: true },
        last_digits: { type: String, required: true },
        exp_month: { type: String, required: true },
        exp_year: { type: String, required: true },
        holder: {
          name: { type: String, required: true },
        },
      },
    },
  ],
  next_invoice_at: { type: String, required: true },
  pro_rata: { type: Boolean, required: true },
  customer: {
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  created_at: { type: String, required: true },
  updated_at: { type: String, required: true },
  links: [
    {
      rel: { type: String, required: true },
      href: { type: String, required: true },
      media: { type: String, required: true },
      type: { type: String, required: true },
    },
  ],
});

const SubscriptionModel = mongoose.model<ISubscription>(
  "Subscription",
  SubscriptionSchema
);

export { SubscriptionModel };
