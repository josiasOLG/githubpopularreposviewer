import { Document, Schema, Types, model } from 'mongoose';

export interface ILog extends Document {
  _id: Types.ObjectId;
  level: string; // 'error', 'warn', 'info', etc.
  message: string; // Mensagem do erro
  timestamp: Date; // Data e hora do erro
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

const logSchema = new Schema<ILog>({
  level: { type: String, required: true, enum: ['error', 'warn', 'info', 'debug'] },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  service: { type: String, required: true },
  stack: { type: String },
  request: {
    method: { type: String },
    url: { type: String },
    body: { type: Schema.Types.Mixed },
    params: { type: Schema.Types.Mixed },
    query: { type: Schema.Types.Mixed },
    headers: { type: Schema.Types.Mixed },
    ip: { type: String },
    userId: { type: String },
  },
  metadata: { type: Schema.Types.Mixed },
});

// Índices para melhorar a performance de consultas
logSchema.index({ timestamp: -1 }); // Ordenação por data decrescente
logSchema.index({ level: 1 }); // Filtro por nível
logSchema.index({ service: 1 }); // Filtro por serviço

export const Log = model<ILog>('Log', logSchema);
