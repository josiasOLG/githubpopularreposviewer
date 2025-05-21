import { Request } from 'express';
import { logService } from './LogService';

/**
 * Função auxiliar para capturar e registrar erros em qualquer parte da aplicação
 *
 * @param error O erro capturado
 * @param service Nome do serviço/módulo onde o erro ocorreu
 * @param request Objeto de requisição (opcional)
 * @param metadata Dados adicionais para o log (opcional)
 */
export const handleError = async (
  error: Error,
  service: string,
  request?: Request,
  metadata?: any,
): Promise<void> => {
  await logService.logError(error, service, request, metadata);
};

/**
 * Modifica o console.error para também salvar os erros no banco de dados
 */
const originalConsoleError = console.error;
console.error = function (...args: any[]) {
  // Chama a implementação original
  originalConsoleError.apply(console, args);

  // Se o primeiro argumento for um erro, salva no banco de dados
  if (args[0] instanceof Error) {
    logService
      .logError(args[0], 'global', undefined, { additionalArgs: args.slice(1) })
      .catch(err => originalConsoleError('Erro ao salvar log:', err));
  } else if (typeof args[0] === 'string' && args[0].toLowerCase().includes('erro')) {
    // Se a mensagem contiver a palavra 'erro', salva como warning
    const message = args.join(' ');
    logService
      .logWarning(message, 'global', { args })
      .catch(err => originalConsoleError('Erro ao salvar log:', err));
  }
};

// Captura erros não tratados e promessas rejeitadas globalmente
process.on('uncaughtException', (error: Error) => {
  console.error('Erro não tratado:', error);
  logService
    .logError(error, 'uncaughtException')
    .catch(err => console.error('Erro ao salvar log:', err))
    .finally(() => {
      // Espera um momento para garantir que o log seja salvo antes de encerrar
      setTimeout(() => {
        process.exit(1); // Encerra o processo com erro
      }, 1000);
    });
});

process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
  console.error('Promessa rejeitada não tratada:', reason);

  // Converte reason para Error se não for
  const error = reason instanceof Error ? reason : new Error(String(reason));

  logService
    .logError(error, 'unhandledRejection', undefined, { promise })
    .catch(err => console.error('Erro ao salvar log:', err));
});

// Capturar erros de warning também
process.on('warning', (warning: Error) => {
  console.warn('Aviso:', warning);
  logService
    .logWarning(warning.message, 'processWarning', {
      name: warning.name,
      stack: warning.stack,
    })
    .catch(err => console.error('Erro ao salvar log de aviso:', err));
});
