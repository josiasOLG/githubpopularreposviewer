import { Types } from 'mongoose';

export interface Log {
  _id?: Types.ObjectId;
  level: string; // 'error', 'warn', 'info', etc.
  message: string; // Mensagem do erro
  timestamp?: Date; // Data e hora do erro
  service: string; // Serviço/módulo onde ocorreu o erro
  stack?: string; // Stack trace do erro (opcional)
  request?: {
    // Informações da requisição (opcional)
    method: string;
    url: string;
    body?: any;
    params?: any;
    query?: any;
    headers?: any;
    ip?: string;
    userId?: string;
  };
  metadata?: any; // Dados adicionais (opcional)
}
