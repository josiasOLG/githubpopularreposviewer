import { Schema, model, Document } from "mongoose";

export interface IAppService extends Document {
  name: string;
  description?: string;
  price?: number;
  duration?: number; // em minutos
  active: boolean;
}

const appServiceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  duration: { type: Number },
  active: { type: Boolean, default: true },
});

export const AppService = model<IAppService>("AppService", appServiceSchema);
