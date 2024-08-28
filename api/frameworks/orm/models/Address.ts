import { Schema, model, Document } from "mongoose";

export interface IAddress extends Document {
  idUser?: string;
  number: string;
  complement: string;
  locality: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
  cpf: string;
}

const addressSchema = new Schema({
  idUser: { type: String, required: true },
  number: { type: String, required: true },
  complement: { type: String },
  locality: { type: String },
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  cpf: { type: String, required: true },
});

export const Address = model<IAddress>("Address", addressSchema);
