import { Document, Schema, model } from 'mongoose';

interface IAddress {
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
}

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
  userName?: string;
  userEmail?: string;
  userCpf?: string;
  userAddress?: IAddress;
  modality?: string;
  create?: Date;
  update?: Date;
  active?: boolean;
  manual?: boolean;
  hashuser?: string;
}

const addressSchema = new Schema(
  {
    street: { type: String, required: false },
    number: { type: String, required: false },
    complement: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    zipCode: { type: String, required: false },
  },
  { _id: false },
);

const appointmentSchema = new Schema({
  userId: { type: String, required: false },
  barberId: { type: String, required: true },
  idServico: { type: String, required: false },
  date: { type: Date, required: true },
  time: { type: String, required: true },
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
  userNumber: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userCpf: { type: String, required: false },
  userAddress: { type: addressSchema, required: false },
  modality: { type: String, required: true },
  create: { type: Date, default: Date.now },
  update: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  manual: { type: Boolean, default: false },
  hashuser: { type: String },
});

export const Appointment = model<IAppointment>('Appointment', appointmentSchema);
