import { Schema, model, Document } from "mongoose";

export interface IService extends Document {
  name: string;
  points: number;
  createdAt: Date;
}

const serviceSchema = new Schema({
  name: { type: String, required: true },
  points: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Service = model<IService>("Service", serviceSchema);
