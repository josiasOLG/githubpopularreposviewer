import { Request, Response } from 'express';
import { LogRepository } from '../repositories/LogRepository';

const logRepository = new LogRepository();

/**
 * Listar todos os logs com paginação
 */
export const getAllLogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const skip = (page - 1) * limit;

    const logs = await logRepository.findAll();
    const paginatedLogs = logs.slice(skip, skip + limit);

    return res.status(200).json({
      total: logs.length,
      page,
      pages: Math.ceil(logs.length / limit),
      logs: paginatedLogs,
    });
  } catch (error) {
    console.error('Erro ao buscar logs:', error);
    return res.status(500).json({ error: 'Erro ao buscar logs' });
  }
};

/**
 * Buscar logs por nível (error, warn, info)
 */
export const getLogsByLevel = async (req: Request, res: Response) => {
  try {
    const { level } = req.params;
    const logs = await logRepository.findByLevel(level);
    return res.status(200).json(logs);
  } catch (error) {
    console.error(`Erro ao buscar logs de nível ${req.params.level}:`, error);
    return res.status(500).json({ error: 'Erro ao buscar logs' });
  }
};

/**
 * Buscar logs por serviço
 */
export const getLogsByService = async (req: Request, res: Response) => {
  try {
    const { service } = req.params;
    const logs = await logRepository.findByService(service);
    return res.status(200).json(logs);
  } catch (error) {
    console.error(`Erro ao buscar logs do serviço ${req.params.service}:`, error);
    return res.status(500).json({ error: 'Erro ao buscar logs' });
  }
};

/**
 * Buscar logs por intervalo de datas
 */
export const getLogsByDateRange = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'As datas de início e fim são obrigatórias',
      });
    }

    const logs = await logRepository.findByTimeRange(
      new Date(startDate as string),
      new Date(endDate as string),
    );

    return res.status(200).json(logs);
  } catch (error) {
    console.error('Erro ao buscar logs por intervalo de datas:', error);
    return res.status(500).json({ error: 'Erro ao buscar logs' });
  }
};

/**
 * Limpar logs antigos
 */
export const clearOldLogs = async (req: Request, res: Response) => {
  try {
    const { olderThan } = req.query;

    if (!olderThan) {
      return res.status(400).json({
        error: 'A data de referência é obrigatória',
      });
    }

    await logRepository.deleteOldLogs(new Date(olderThan as string));

    return res.status(200).json({
      message: 'Logs antigos removidos com sucesso',
    });
  } catch (error) {
    console.error('Erro ao limpar logs antigos:', error);
    return res.status(500).json({ error: 'Erro ao limpar logs antigos' });
  }
};

/**
 * Rota para testar o sistema de logs
 */
export const testErrorLog = async (req: Request, res: Response) => {
  try {
    // Simula um erro forçado para testar o sistema de logs
    throw new Error('Erro de teste para o sistema de logs');
  } catch (error) {
    console.error('Erro de teste:', error);
    return res.status(500).json({
      error: 'Erro de teste para o sistema de logs',
      message: 'Esta é uma rota para testar o sistema de logs. O erro foi registrado com sucesso.',
    });
  }
};

export default {
  getAllLogs,
  getLogsByLevel,
  getLogsByService,
  getLogsByDateRange,
  clearOldLogs,
  testErrorLog,
};
