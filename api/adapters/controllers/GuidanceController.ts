import { Request, Response } from 'express';
import { IGuidance } from '../../entities/Guidance';
import { guidanceRepository } from '../repositories/GuidanceRepository';

export const createGuidanceController = async (req: Request, res: Response): Promise<void> => {
  try {
    const guidanceData: IGuidance = req.body;

    // Validações básicas
    if (!guidanceData.appServiceId) {
      res.status(400).json({ error: 'App Service ID é obrigatório' });
      return;
    }

    if (!guidanceData.categoryId) {
      res.status(400).json({ error: 'Category ID é obrigatório' });
      return;
    }

    if (!guidanceData.userId) {
      res.status(400).json({ error: 'User ID é obrigatório' });
      return;
    }

    if (!guidanceData.professionalId) {
      res.status(400).json({ error: 'Professional ID é obrigatório' });
      return;
    }

    if (!guidanceData.appointmentId) {
      res.status(400).json({ error: 'Appointment ID é obrigatório' });
      return;
    }

    if (!guidanceData.title?.trim()) {
      res.status(400).json({ error: 'Título é obrigatório' });
      return;
    }

    if (!guidanceData.description?.trim()) {
      res.status(400).json({ error: 'Descrição é obrigatória' });
      return;
    }

    if (!guidanceData.startDate) {
      res.status(400).json({ error: 'Data de início é obrigatória' });
      return;
    }

    if (!guidanceData.endDate) {
      res.status(400).json({ error: 'Data de fim é obrigatória' });
      return;
    }

    // Validar se data de fim é posterior à data de início
    if (new Date(guidanceData.endDate) <= new Date(guidanceData.startDate)) {
      res.status(400).json({ error: 'Data de fim deve ser posterior à data de início' });
      return;
    }

    // Validar e processar anexos se fornecidos
    if (guidanceData.attachments && Array.isArray(guidanceData.attachments)) {
      const processedAttachments = [];

      for (const attachment of guidanceData.attachments) {
        // Validar campos obrigatórios do anexo
        if (!attachment.fileName || !attachment.fileName.trim()) {
          res.status(400).json({ error: 'Nome do arquivo é obrigatório para todos os anexos' });
          return;
        }

        if (!attachment.fileType || !attachment.fileType.trim()) {
          res.status(400).json({ error: 'Tipo do arquivo é obrigatório para todos os anexos' });
          return;
        }

        if (!attachment.fileUrl || !attachment.fileUrl.trim()) {
          res.status(400).json({ error: 'URL do arquivo é obrigatória para todos os anexos' });
          return;
        }

        if (!attachment.fileSize || attachment.fileSize <= 0) {
          res.status(400).json({ error: 'Tamanho do arquivo deve ser maior que zero' });
          return;
        }

        // Validar tipos de arquivo permitidos
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (!allowedTypes.includes(attachment.fileType.toLowerCase())) {
          res.status(400).json({
            error: `Tipo de arquivo não permitido: ${
              attachment.fileType
            }. Tipos permitidos: ${allowedTypes.join(', ')}`,
          });
          return;
        }

        // Validar tamanho máximo (10MB)
        const maxFileSize = 10 * 1024 * 1024; // 10MB em bytes
        if (attachment.fileSize > maxFileSize) {
          res.status(400).json({
            error: `Arquivo muito grande: ${attachment.fileName}. Tamanho máximo permitido: 10MB`,
          });
          return;
        }

        // Validar URL (verificação básica)
        try {
          new URL(attachment.fileUrl);
        } catch {
          res.status(400).json({
            error: `URL inválida para o arquivo: ${attachment.fileName}`,
          });
          return;
        }

        // Processar anexo
        const processedAttachment = {
          fileName: attachment.fileName.trim(),
          fileType: attachment.fileType.toLowerCase(),
          fileUrl: attachment.fileUrl.trim(),
          fileSize: attachment.fileSize,
          uploadedAt: new Date(),
        };

        processedAttachments.push(processedAttachment);
      }

      guidanceData.attachments = processedAttachments;
    } else {
      // Garantir que attachments seja um array vazio se não fornecido
      guidanceData.attachments = [];
    }

    const guidance = await guidanceRepository.create(guidanceData);
    res.status(201).json(guidance);
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao criar orientação',
      error: error.message,
    });
  }
};

export const getGuidanceByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const guidance = await guidanceRepository.findById(id);

    if (guidance) {
      res.json(guidance);
    } else {
      res.status(404).json({ error: 'Orientação não encontrada' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao buscar orientação',
      error: error.message,
    });
  }
};

export const getAllGuidancesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const guidances = await guidanceRepository.findAllActive();
    res.json(guidances);
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao buscar orientações ativas',
      error: error.message,
    });
  }
};

export const getGuidancesByUserController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const guidances = await guidanceRepository.findByUserId(userId);
    res.json(guidances);
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao buscar orientações do usuário',
      error: error.message,
    });
  }
};

export const getGuidancesByProfessionalController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { professionalId } = req.params;
    const guidances = await guidanceRepository.findByProfessionalId(professionalId);
    res.json(guidances);
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao buscar orientações do profissional',
      error: error.message,
    });
  }
};

export const getGuidancesByAppointmentIdController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { appointmentId } = req.params;

    if (!appointmentId) {
      res.status(400).json({ error: 'ID do agendamento é obrigatório' });
      return;
    }

    const guidances = await guidanceRepository.findByAppointmentId(appointmentId);
    res.json(guidances);
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao buscar orientações do agendamento',
      error: error.message,
    });
  }
};

export const getGuidancesByServiceAndCategoryController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { appServiceId, categoryId } = req.params;
    const guidances = await guidanceRepository.findByAppServiceAndCategory(
      appServiceId,
      categoryId,
    );
    res.json(guidances);
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao buscar orientações por serviço e categoria',
      error: error.message,
    });
  }
};

export const getGuidancesByDateRangeController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ error: 'Datas de início e fim são obrigatórias' });
      return;
    }

    const start = new Date(startDate as string);
    const end = new Date(endDate as string);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ error: 'Formato de data inválido' });
      return;
    }

    const guidances = await guidanceRepository.findActiveByDateRange(start, end);
    res.json(guidances);
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao buscar orientações por período',
      error: error.message,
    });
  }
};

export const getActiveGuidancesByUserController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const guidances = await guidanceRepository.getActiveGuidancesByUser(userId);
    res.json(guidances);
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao buscar orientações ativas do usuário',
      error: error.message,
    });
  }
};

export const updateGuidanceController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const guidanceData: Partial<IGuidance> = req.body;

    // Validar se data de fim é posterior à data de início quando ambas estão presentes
    if (guidanceData.startDate && guidanceData.endDate) {
      if (new Date(guidanceData.endDate) <= new Date(guidanceData.startDate)) {
        res.status(400).json({ error: 'Data de fim deve ser posterior à data de início' });
        return;
      }
    }

    const guidance = await guidanceRepository.update(id, guidanceData);

    if (guidance) {
      res.json(guidance);
    } else {
      res.status(404).json({ error: 'Orientação não encontrada' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao atualizar orientação',
      error: error.message,
    });
  }
};

export const deleteGuidanceController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const success = await guidanceRepository.delete(id);

    if (success) {
      res.sendStatus(204);
    } else {
      res.status(404).json({ error: 'Orientação não encontrada' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao deletar orientação',
      error: error.message,
    });
  }
};

export const toggleGuidanceActiveController = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const guidance = await guidanceRepository.toggleActive(id);

    if (guidance) {
      res.json(guidance);
    } else {
      res.status(404).json({ error: 'Orientação não encontrada' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao alterar status da orientação',
      error: error.message,
    });
  }
};

export const addAttachmentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { fileName, fileType, fileUrl, fileSize } = req.body;

    if (!fileName || !fileType || !fileUrl || !fileSize) {
      res.status(400).json({ error: 'Todos os dados do anexo são obrigatórios' });
      return;
    }

    const attachmentData = {
      fileName,
      fileType,
      fileUrl,
      fileSize: Number(fileSize),
    };

    const guidance = await guidanceRepository.addAttachment(id, attachmentData);

    if (guidance) {
      res.status(201).json(guidance);
    } else {
      res.status(404).json({ error: 'Orientação não encontrada' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao adicionar anexo à orientação',
      error: error.message,
    });
  }
};

export const removeAttachmentController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id, attachmentId } = req.params;

    const guidance = await guidanceRepository.removeAttachment(id, attachmentId);

    if (guidance) {
      res.json(guidance);
    } else {
      res.status(404).json({ error: 'Orientação não encontrada' });
    }
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao remover anexo da orientação',
      error: error.message,
    });
  }
};

export const getExpiredGuidancesController = async (req: Request, res: Response): Promise<void> => {
  try {
    const guidances = await guidanceRepository.getExpiredGuidances();
    res.json(guidances);
  } catch (error: any) {
    res.status(500).json({
      message: 'Erro ao buscar orientações expiradas',
      error: error.message,
    });
  }
};
