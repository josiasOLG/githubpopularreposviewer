import express from 'express';
import logController from '../controllers/LogController';

const router = express.Router();

// Todas as rotas de logs são protegidas e só devem ser acessíveis por administradores
router.get('/', logController.getAllLogs);
router.get('/level/:level', logController.getLogsByLevel);
router.get('/service/:service', logController.getLogsByService);
router.get('/date-range', logController.getLogsByDateRange);
router.delete('/clear-old', logController.clearOldLogs);
router.get('/test-error', logController.testErrorLog);

export default router;
