import { Document } from "mongoose";

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
