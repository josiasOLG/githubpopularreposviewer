import { Document, Schema, model, Types } from "mongoose";

export interface IBarberService extends Document {
  userId: Types.ObjectId;
  name: string;
  points: any;
}

const barberServiceSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  points: { type: String, required: true },
});

export const BarberServiceModel = model<IBarberService>(
  "BarberService",
  barberServiceSchema
);
