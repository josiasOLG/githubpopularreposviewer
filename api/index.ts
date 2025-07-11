// vercel-max-duration: 10
import dotenv from 'dotenv';
import { connectToMongoDB } from './frameworks/database/mongodb';
dotenv.config();

import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerFile from './config/swagger'; // Ajuste o caminho conforme necessário
import { logService } from './utils/LogService';
import './utils/errorHandler'; // Importe o manipulador de erros global

import MongoStore from 'connect-mongo';
import session from 'express-session';
import path from 'path';
import appointmentRouter from './adapters/controllers/AppointmentController';
import {
  googleSignIn,
  login,
  recoverPassword,
  refreshToken,
  register,
  resetPassword,
  sendVerificationCode,
  validateCode,
} from './adapters/controllers/AuthController';
import barberRouter from './adapters/controllers/BarberController';
import barberServiceRoutes from './adapters/controllers/BarberServiceController';
import notificationRouter from './adapters/controllers/NotificationController';
import userRouter from './adapters/controllers/UserController';
import addressRouter from './adapters/routes/addressRoutes';
import advertisementRoutes from './adapters/routes/advertisementRoutes';
import appServiceRoutes from './adapters/routes/appServiceRoutes';
import guidanceRoutes from './adapters/routes/guidanceRoutes';
import logRoutes from './adapters/routes/logRoutes';
import pdfRoutes from './adapters/routes/pdfRoutes';
import qrCodeRoutes from './adapters/routes/qrCodeRoutes';
import serviceRoutes from './adapters/routes/serviceRoutes';
import subscriptionRoutes from './adapters/routes/subscriptionRoutes';
import './frameworks/webserver/GoogleStrategy';
import { authMiddleware } from './middlewares/authMiddleware';

import moment from 'moment-timezone';

// Configuração do fuso horário para o Moment.js
moment.tz.setDefault('America/Sao_Paulo');

const app = express();

// Middlewares
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Middleware para registrar todas as requisições
app.use(logService.requestLoggerMiddleware('api'));

app.use(
  cors({
    origin: [
      'https://voxs.vercel.app',
      'http://localhost:3000',
      'http://192.168.18.5:3000',
      'http://localhost:4200',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-refresh-token',
      'x-user-id',
      'x-request-start-time',
    ],
    exposedHeaders: ['access-token', 'refresh-token'],
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_CONNECTION_STRING,
      collectionName: 'sessions',
    }),
  }),
);

// Middlewares
app.use('/api-docs', express.static(path.join(__dirname, 'swagger-static')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/swagger-static', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));

// Public routes
app.post('/register', register);
app.post('/login', login);
app.post('/refresh-token', refreshToken);
app.post('/auth/google', googleSignIn);
app.post('/sendVerificationCode', sendVerificationCode);
app.post('/validateCode', validateCode);
app.post('/oauth2callback', recoverPassword);
app.post('/reset-password', resetPassword);
app.use('/app-services', appServiceRoutes);

// Protected routes
app.use('/users', authMiddleware, userRouter);
app.use('/barbers', authMiddleware, barberRouter);
app.use('/appointments', authMiddleware, appointmentRouter);
app.use('/notifications', authMiddleware, notificationRouter);
app.use('/barber-services', authMiddleware, barberServiceRoutes);
app.use('/qrcode', authMiddleware, qrCodeRoutes);
app.use('/addresses', authMiddleware, addressRouter);
app.use('/subscription', subscriptionRoutes);
app.use('/services', authMiddleware, serviceRoutes);
app.use('/guidances', authMiddleware, guidanceRoutes);
app.use('/advertisements', authMiddleware, advertisementRoutes);
app.use('/pdf', authMiddleware, pdfRoutes);
app.use('/logs', authMiddleware, logRoutes);

// Middleware global para capturar erros
app.use(logService.errorMiddleware('api'));

// Middleware para lidar com rotas não encontradas
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Registrar a tentativa de acesso a um endpoint não existente
  logService
    .logWarning(
      `Tentativa de acesso a endpoint não encontrado: ${req.method} ${req.originalUrl}`,
      'api',
      {
        ip: req.ip,
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body,
      },
    )
    .catch(err => console.error('Erro ao registrar log de endpoint não encontrado:', err));

  res.status(404).json({ error: 'Endpoint não encontrado.' });
});

// Middleware global para tratar todos os erros
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro não tratado:', err);

  // Já foi registrado pelo middleware de erro
  res.status(500).json({
    error: 'Ocorreu um erro interno no servidor. Nossa equipe foi notificada.',
  });
});

const startApp = async () => {
  try {
    await connectToMongoDB();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting the application:', error);
    process.exit(1);
  }
};

startApp();

export default app;
