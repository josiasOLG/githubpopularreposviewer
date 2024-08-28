import { Schema, model, Document, Types } from "mongoose";

export interface IAvailability extends Document {
  barberId: Types.ObjectId;
  date: Date;
  timeSlots: {
    time: string;
    available: boolean;
  }[];
}

const availabilitySchema = new Schema({
  barberId: { type: Schema.Types.ObjectId, ref: "Barber", required: true },
  date: { type: Date, required: true },
  timeSlots: [
    {
      time: { type: String, required: true },
      available: { type: Boolean, required: true, default: true },
    },
  ],
});

export const Availability = model<IAvailability>(
  "Availability",
  availabilitySchema
);
