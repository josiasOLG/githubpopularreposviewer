// vercel-max-duration: 10
import { connectToMongoDB } from "./frameworks/database/mongodb";
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./config/swagger"; // Ajuste o caminho conforme necessário

import userRouter from "./adapters/controllers/UserController";
import barberServiceRoutes from "./adapters/controllers/BarberServiceController";
import qrCodeRoutes from "./adapters/routes/qrCodeRoutes";
import barberRouter from "./adapters/controllers/BarberController";
import appointmentRouter from "./adapters/controllers/AppointmentController";
import notificationRouter from "./adapters/controllers/NotificationController";
import {
  googleSignIn,
  login,
  recoverPassword,
  refreshToken,
  register,
  resetPassword,
  sendVerificationCode,
  validateCode,
} from "./adapters/controllers/AuthController";
import { authMiddleware } from "./middlewares/authMiddleware";
import session from "express-session";
import MongoStore from "connect-mongo";
import subscriptionRoutes from "./adapters/routes/subscriptionRoutes";
import serviceRoutes from "./adapters/routes/serviceRoutes";
import pdfRoutes from "./adapters/routes/pdfRoutes";
import addressRouter from "./adapters/routes/addressRoutes";
import path from "path";
import "./frameworks/webserver/GoogleStrategy";

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(
  cors({
    origin: ["*"],
  })
);

app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.DB_CONNECTION_STRING,
      collectionName: "sessions",
    }),
  })
);

// Middlewares
app.use("/api-docs", express.static(path.join(__dirname, "swagger-static")));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(
  "/swagger-static",
  express.static(path.join(__dirname, "node_modules/swagger-ui-dist"))
);

// Public routes
app.post("/register", register);
app.post("/login", login);
app.post("/refresh-token", refreshToken);
app.post("/auth/google", googleSignIn);
app.post("/sendVerificationCode", sendVerificationCode);
app.post("/validateCode", validateCode);
app.post("/oauth2callback", recoverPassword);
app.post("/reset-password", resetPassword);

// Protected routes
app.use("/users", authMiddleware, userRouter);
app.use("/barbers", authMiddleware, barberRouter);
app.use("/appointments", authMiddleware, appointmentRouter);
app.use("/notifications", authMiddleware, notificationRouter);
app.use("/barber-services", authMiddleware, barberServiceRoutes);
app.use("/qrcode", authMiddleware, qrCodeRoutes);
app.use("/addresses", authMiddleware, addressRouter);
app.use("/subscription", subscriptionRoutes);
app.use("/services", authMiddleware, serviceRoutes);
app.use("/pdf", authMiddleware, pdfRoutes);

const startApp = async () => {
  try {
    await connectToMongoDB();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Error starting the application:", error);
    process.exit(1);
  }
};

startApp();

export default app;
