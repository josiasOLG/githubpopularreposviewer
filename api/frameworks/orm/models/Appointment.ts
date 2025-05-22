import { Document, Schema, model } from 'mongoose';

export interface IAppointment extends Document {
  userId?: string;
  idServico?: string;
  barberId?: string;
  date?: Date;
  time?: string;
  status?: string;
  statusAprovacao?: string;
  statusMensage?: string;
  service?: string[];
  notes?: string;
  statusPoint?: boolean;
  repete?: string;
  allDay?: boolean;
  exceptions?: Date[];
  endRepeat?: Date;
  color?: string;
  userNumber?: string;
  modality?: string;
  create?: Date;
  update?: Date;
  active?: boolean;
}

const appointmentSchema = new Schema({
  userId: { type: String, required: true },
  barberId: { type: String, required: true },
  idServico: { type: String, required: false },
  date: { type: Date, required: true },
  time: { type: String, required: false },
  status: { type: String, required: true, default: 'pending' },
  statusAprovacao: { type: String, required: false, default: '' },
  statusMensage: { type: String, required: false, default: '' },
  service: { type: [String], required: true }, // Updated to array of strings
  notes: { type: String },
  statusPoint: { type: Boolean, required: false, default: false },
  repete: { type: String },
  allDay: { type: Boolean, required: false, default: false },
  exceptions: [{ type: Date }],
  endRepeat: { type: Date },
  color: { type: String },
  userNumber: { type: String },
  modality: { type: String },
  create: { type: Date, default: Date.now },
  update: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
});

export const Appointment = model<IAppointment>('Appointment', appointmentSchema);
