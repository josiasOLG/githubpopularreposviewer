import mongoose, { Document, Schema } from "mongoose";

export interface ICardToken extends Document {
  userId: string;
  createdAt: Date;
  numberCard: string;
  cardBrand?: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  cardLastFourDigits: string;
  email: string;
  cpf: string;
  referenceId1?: string;
}

const CardTokenSchema: Schema = new Schema({
  userId: { type: String, required: true },
  cardBrand: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  numberCard: { type: String, required: true },
  holderName: { type: String, required: true },
  expiryMonth: { type: Number, required: true },
  expiryYear: { type: Number, required: true },
  cardLastFourDigits: { type: Number, required: true },
  email: { type: String, required: true },
  cpf: { type: String, required: true },
  referenceId1: { type: String, required: false },
});

export default mongoose.model<ICardToken>("CardToken", CardTokenSchema);
