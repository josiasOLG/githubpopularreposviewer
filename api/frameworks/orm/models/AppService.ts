import { Document, Schema, model } from 'mongoose';

interface IActivity {
  _id?: string;
  name: string;
  point?: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ICategory {
  _id?: string;
  name: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAppService extends Document {
  name: string;
  description?: string;
  price?: number;
  duration?: number; // em minutos
  active: boolean;
  activities: IActivity[];
  categories: ICategory[];
}

const activitySchema = new Schema({
  name: { type: String, required: true },
  point: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const categorySchema = new Schema({
  name: { type: String, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const appServiceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number },
    duration: { type: Number },
    active: { type: Boolean, default: true },
    activities: [activitySchema],
    categories: [categorySchema],
  },
  {
    timestamps: true,
  },
);

export const AppService = model<IAppService>('AppService', appServiceSchema);
