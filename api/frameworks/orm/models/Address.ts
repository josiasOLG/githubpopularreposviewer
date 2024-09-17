import { Types } from "mongoose";
import { Schema, model, Document } from "mongoose";

export interface IAddress extends Document {
  idUser?: Types.ObjectId;
  number?: string;
  complement?: string;
  locality?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  phoneNumber?: string;
  cpf?: string;
}

const addressSchema = new Schema({
  idUser: { type: Schema.Types.ObjectId, ref: "User", required: false },
  number: { type: String, required: false },
  complement: { type: String },
  locality: { type: String },
  street: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  zipCode: { type: String, required: false },
  country: { type: String, required: false },
  phoneNumber: { type: String, required: false },
  cpf: { type: String, required: false },
});

export const Address = model<IAddress>("Address", addressSchema);
