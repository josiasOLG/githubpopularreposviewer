import { Schema, model, Document } from "mongoose";

export interface IAppointment extends Document {
  userId?: string;
  barberId?: string;
  date?: Date;
  time?: string;
  status?: string;
  statusAprovacao?: string;
  statusMensage?: string;
  service?: string[];
  notes?: string;
  statusPoint?: boolean;
}

const appointmentSchema = new Schema({
  userId: { type: String, required: true },
  barberId: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  status: { type: String, required: true, default: "pending" },
  statusAprovacao: { type: String, required: false, default: "" },
  statusMensage: { type: String, required: false, default: "" },
  service: { type: [String], required: true }, // Updated to array of strings
  notes: { type: String },
  statusPoint: { type: Boolean, required: false, default: false },
});

export const Appointment = model<IAppointment>(
  "Appointment",
  appointmentSchema
);
