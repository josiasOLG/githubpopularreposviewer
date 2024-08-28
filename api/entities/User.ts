export interface Point {
  barberId: string;
  qtd: number;
}

export interface User {
  _id?: string;
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
}
