import { Document, Schema, Types, model } from 'mongoose';

export interface IPoint {
  barberId: Types.ObjectId;
  barberName: string;
  qtd: number;
}

export interface IDaySchedule {
  startTime?: string;
  endTime?: string;
  lunchStartTime?: string;
  lunchEndTime?: string;
  isWorkingDay?: boolean;
}

export interface IWeeklySchedule {
  segunda?: IDaySchedule;
  terca?: IDaySchedule;
  quarta?: IDaySchedule;
  quinta?: IDaySchedule;
  sexta?: IDaySchedule;
  sabado?: IDaySchedule;
  domingo?: IDaySchedule;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
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
  agendaConfig?: {
    startTime?: string;
    endTime?: string;
    lunchStartTime?: string;
    lunchEndTime?: string;
    sessionDuration?: string;
    breakBetweenSessions?: string;
    cancellationPolicy?: string;
    cancellationPenaltyType?: string;
    cancellationPenaltyValue?: string;
    modalities?: string[];
    workDays?: string[];
    unavailableStart?: string;
    unavailableEnd?: string;
    unavailableReason?: string;
    useSameHoursEveryday?: boolean;
    weeklySchedule?: IWeeklySchedule;
  };
}

const pointSchema = new Schema({
  barberId: { type: String, ref: 'User', required: true, default: '' },
  barberName: { type: String },
  qtd: { type: Number, required: true, default: 0 },
});

const dayScheduleSchema = new Schema(
  {
    startTime: { type: String },
    endTime: { type: String },
    lunchStartTime: { type: String },
    lunchEndTime: { type: String },
    isWorkingDay: { type: Boolean, default: true },
  },
  { _id: false },
);

const weeklyScheduleSchema = new Schema(
  {
    segunda: { type: dayScheduleSchema },
    terca: { type: dayScheduleSchema },
    quarta: { type: dayScheduleSchema },
    quinta: { type: dayScheduleSchema },
    sexta: { type: dayScheduleSchema },
    sabado: { type: dayScheduleSchema },
    domingo: { type: dayScheduleSchema },
  },
  { _id: false },
);

const agendaConfigSchema = new Schema(
  {
    startTime: { type: String },
    endTime: { type: String },
    lunchStartTime: { type: String },
    lunchEndTime: { type: String },
    sessionDuration: { type: String },
    breakBetweenSessions: { type: String },
    cancellationPolicy: { type: String },
    cancellationPenaltyType: { type: String },
    cancellationPenaltyValue: { type: String },
    modalities: [{ type: String }],
    workDays: [{ type: String }],
    unavailableStart: { type: String },
    unavailableEnd: { type: String },
    unavailableReason: { type: String },
    useSameHoursEveryday: { type: Boolean },
    weeklySchedule: { type: weeklyScheduleSchema },
  },
  { _id: false },
);

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
  address: { type: Schema.Types.ObjectId, ref: 'Address' },
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

userSchema.add({
  agendaConfig: { type: agendaConfigSchema, default: {} },
});
// Garantir a criação do índice ao registrar o modelo
userSchema.index({ email: 1 });

export const User = model<IUser>('User', userSchema);
