import { Schema, model, Document, Types } from "mongoose";

export interface IPoint {
  barberId: Types.ObjectId;
  barberName: string;
  qtd: number;
}

export interface IUser extends Document {
  name: string;
  descricao?: string;
  certificacoes?: string;
  code?: string;
  email: string;
  password?: string;
  role?: string;
  service?: string;
  phone?: string;
  birthDate?: Date;
  image?: string;
  address?: Types.ObjectId;
  googleId?: string;
  customerId?: string;
  verificationCode?: string;
  accessToken?: string;
  refreshToken?: string;
  startTime?: string;
  lunchStartTime?: string;
  lunchEndTime?: string;
  endTime?: string;
  interval?: string;
  points?: IPoint[];
  active?: boolean;
}

const pointSchema = new Schema({
  barberId: { type: String, ref: "User", required: true, default: "" },
  barberName: { type: String },
  qtd: { type: Number, required: true, default: 0 },
});

const userSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true },
  email: { type: String, required: true, unique: true, index: true }, // ÍNDICE ADICIONADO
  password: { type: String },
  role: { type: String },
  service: { type: String },
  phone: { type: String },
  birthDate: { type: Date },
  image: { type: String },
  address: { type: Schema.Types.ObjectId, ref: "Address" },
  googleId: { type: String },
  customerId: { type: String },
  verificationCode: { type: String },
  accessToken: { type: String },
  refreshToken: { type: String },
  descricao: { type: String },
  certificacoes: { type: String },
  startTime: { type: String },
  lunchStartTime: { type: String },
  lunchEndTime: { type: String },
  endTime: { type: String },
  interval: { type: String },
  points: { type: [pointSchema], default: [] },
  active: { type: Boolean },
});

// Garantir a criação do índice ao registrar o modelo
userSchema.index({ email: 1 });

export const User = model<IUser>("User", userSchema);
