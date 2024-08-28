import { Schema, model, Document, Types } from "mongoose";

export interface IBarber extends Document {
  userId: Types.ObjectId;
  speciality: string;
  code: string;
}

const barberSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  speciality: { type: String, required: true },
  code: { type: String, required: true, unique: true },
});

export const Barber = model<IBarber>("Barber", barberSchema);
