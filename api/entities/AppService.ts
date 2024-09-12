import { Document } from "mongoose";

export interface IAppService extends Document {
  name: string;
  description?: string;
  price?: number;
  duration?: number; // em minutos
  active: boolean;
}
