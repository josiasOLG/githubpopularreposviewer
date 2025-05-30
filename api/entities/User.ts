import { Types } from 'mongoose';

export interface Point {
  barberId: string;
  qtd: number;
}

export interface DaySchedule {
  startTime?: string;
  endTime?: string;
  lunchStartTime?: string;
  lunchEndTime?: string;
  isWorkingDay?: boolean;
}

export interface WeeklySchedule {
  segunda?: DaySchedule;
  terca?: DaySchedule;
  quarta?: DaySchedule;
  quinta?: DaySchedule;
  sexta?: DaySchedule;
  sabado?: DaySchedule;
  domingo?: DaySchedule;
}

export interface AgendaConfig {
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
  weeklySchedule?: WeeklySchedule;
}

export interface User {
  _id?: string | Types.ObjectId;
  code?: any;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  service?: string;
  googleId?: any;
  customerId?: any;
  verificationCode?: any;
  accessToken?: string;
  refreshToken?: string;
  descricao?: string;
  certificacoes?: string;
  image?: string;
  startTime?: string;
  lunchStartTime?: string;
  lunchEndTime?: string;
  endTime?: string;
  interval?: string;
  points?: Point[];
  active?: boolean;
  agendaConfig?: AgendaConfig;
}
