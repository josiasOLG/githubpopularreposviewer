import { NextFunction, Request, Response } from 'express';
import { LogRepository } from '../adapters/repositories/LogRepository';
import { Log } from '../entities/Log';

class LogService {
  private logRepository: LogRepository;

  constructor() {
    this.logRepository = new LogRepository();
  }

  /**
   * Registra um erro no banco de dados
   */
  async logError(error: Error, service: string, request?: Request, metadata?: any): Promise<void> {
    try {
      const logData: Log = {
        level: 'error',
        message: error.message,
        timestamp: new Date(),
        service,
        stack: error.stack,
        metadata,
      };

      // Adiciona informações da requisição se disponíveis
      if (request) {
        const { userId } = (request as any).user || {};

        logData.request = {
          method: request.method,
          url: request.url,
          body: this.sanitizeData(request.body),
          params: request.params,
          query: request.query,
          headers: this.sanitizeHeaders(request.headers),
          ip: request.ip,
          userId,
        };
      }

      await this.logRepository.create(logData);
    } catch (logError) {
      // Evita loops infinitos se houver erro ao registrar o log
      console.error('Erro ao salvar o log:', logError);
    }
  }

  /**
   * Registra informações no banco de dados
   */
  async logInfo(message: string, service: string, metadata?: any): Promise<void> {
    try {
      const logData: Log = {
        level: 'info',
        message,
        timestamp: new Date(),
        service,
        metadata,
      };

      await this.logRepository.create(logData);
    } catch (error) {
      console.error('Erro ao salvar o log de informação:', error);
    }
  }

  /**
   * Registra avisos no banco de dados
   */
  async logWarning(message: string, service: string, metadata?: any): Promise<void> {
    try {
      const logData: Log = {
        level: 'warn',
        message,
        timestamp: new Date(),
        service,
        metadata,
      };

      await this.logRepository.create(logData);
    } catch (error) {
      console.error('Erro ao salvar o log de aviso:', error);
    }
  }

  /**
   * Middleware para capturar e registrar erros em requisições
   */
  errorMiddleware(service: string) {
    return async (error: any, req: Request, res: Response, next: NextFunction) => {
      await this.logError(error, service, req);
      next(error);
    };
  }

  /**
   * Middleware para capturar e registrar todas as requisições
   */
  requestLoggerMiddleware(service: string) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const originalSend = res.send;
      const startTime = Date.now();

      // Intercepta o método send para capturar o status da resposta
      res.send = function (body) {
        const responseTime = Date.now() - startTime;
        const { method, url } = req;
        const status = res.statusCode;

        // Log apenas para erros (códigos 4xx e 5xx)
        if (status >= 400) {
          const logService = new LogService();
          logService.logWarning(
            `${method} ${url} - Status: ${status} - ${responseTime}ms`,
            service,
            { responseBody: body, status },
          );
        }

        return originalSend.call(this, body);
      };

      next();
    };
  }

  /**
   * Remove dados sensíveis como senhas, tokens, etc.
   */
  private sanitizeData(data: any): any {
    if (!data) return data;

    const sanitized = { ...data };

    // Lista de campos sensíveis a serem mascarados
    const sensitiveFields = [
      'password',
      'senha',
      'token',
      'accessToken',
      'refreshToken',
      'secret',
      'authorization',
      'creditCard',
      'cartao',
    ];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    }

    return sanitized;
  }

  /**
   * Remove headers sensíveis
   */
  private sanitizeHeaders(headers: any): any {
    if (!headers) return headers;

    const sanitized = { ...headers };

    // Lista de headers sensíveis a serem mascarados
    const sensitiveHeaders = [
      'authorization',
      'cookie',
      'x-refresh-token',
      'access-token',
      'refresh-token',
    ];

    for (const header of sensitiveHeaders) {
      if (sanitized[header]) {
        sanitized[header] = '[REDACTED]';
      }
    }

    return sanitized;
  }
}

// Exporta uma instância única do serviço
export const logService = new LogService();
