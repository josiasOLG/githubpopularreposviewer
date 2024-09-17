import { Schema, model, Document } from "mongoose";

interface IActivity {
  name: string;
  active: boolean;
}

export interface IAppService extends Document {
  name: string;
  description?: string;
  price?: number;
  duration?: number; // em minutos
  active: boolean;
  activities: IActivity[];
}

const activitySchema = new Schema({
  name: { type: String, required: true },
  point: { type: Number, required: true },
  active: { type: Boolean, default: true },
});

const appServiceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number },
  duration: { type: Number },
  active: { type: Boolean, default: true },
  activities: [activitySchema],
});

export const AppService = model<IAppService>("AppService", appServiceSchema);
