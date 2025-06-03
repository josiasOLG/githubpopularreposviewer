import { Document } from 'mongoose';

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
