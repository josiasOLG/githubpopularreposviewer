import { Request, Response, Router } from 'express';
import { BarberServiceRepository } from '../repositories/BarberServiceRepository';

const barberServiceRepository = new BarberServiceRepository();
const router = Router();

export const createBarberService = async (req: Request, res: Response) => {
  try {
    const { userId, ...serviceData } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'O ID do usuário é obrigatório' });
    }

    // Verificar se já existe um serviço com o mesmo nome para este usuário
    const existingServices = await barberServiceRepository.getAll(userId);
    const isDuplicate = existingServices.some(
      service => service.name.toLowerCase() === serviceData.name.toLowerCase(),
    );

    if (isDuplicate) {
      return res.status(400).json({
        error: 'Já existe um serviço com este nome para este usuário',
      });
    }

    const barberService = await barberServiceRepository.create({
      ...serviceData,
      userId,
    });
    res.status(201).json(barberService);
  } catch (error) {
    console.error('Erro ao criar serviço de barbeiro:', error);
    res.status(500).json({ error: 'Falha ao criar serviço de barbeiro' });
  }
};

export const getAllServicePerfils = async (req: Request, res: Response) => {
  try {
    const userId = req.params.barberId;
    if (!userId) {
      return res.status(400).json({ error: 'O ID do usuário é obrigatório' });
    }

    const servicePerfils = await barberServiceRepository.getAll(userId as string);

    if (!servicePerfils || servicePerfils.length === 0) {
      return res.status(400).json({ error: 'Falha ao obter perfis de serviço' });
    }

    res.json(servicePerfils);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao obter perfis de serviço' });
  }
};

export const getAllBarberServices = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'O ID do usuário é obrigatório' });
    }
    const barberServices = await barberServiceRepository.getAll(userId);
    res.json(barberServices);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao obter serviços de barbeiro' });
  }
};

export const getBarberServiceById = async (req: Request, res: Response) => {
  try {
    const barberService = await barberServiceRepository.getAll(req.params.id);
    if (barberService) {
      res.json(barberService);
    } else {
      res.status(404).json({ error: 'Serviço de barbeiro não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Falha ao obter serviço de barbeiro' });
  }
};

export const updateBarberService = async (req: Request, res: Response) => {
  try {
    const barberService = await barberServiceRepository.update(req.params.id, req.body);
    if (barberService) {
      res.json(barberService);
    } else {
      res.status(404).json({ error: 'Serviço de barbeiro não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Falha ao atualizar serviço de barbeiro' });
  }
};

export const deleteBarberService = async (req: Request, res: Response) => {
  try {
    console.log(req.params.id);
    await barberServiceRepository.delete(req.params.id);
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: 'Falha ao excluir serviço de barbeiro' });
  }
};

router.post('/', createBarberService);
router.get('/', getAllBarberServices);
router.get('/services/:barberId', getAllServicePerfils);
router.get('/:id', getBarberServiceById);
router.put('/:id', updateBarberService);
router.delete('/:id', deleteBarberService);

export default router;
