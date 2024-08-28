import { Request, Response } from "express";
import { CreateUser } from "../../usecases/user/CreateUser";
import { UserRepository } from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../../utils/mailer";
import { google } from "googleapis";
import twilioClient from "../../utils/twilioConfig";
import { Address } from "../../frameworks/orm/models/Address";
import { formatPhoneNumber } from "../../utils/utils";
import { v4 as uuidv4 } from "uuid";

const userRepository = new UserRepository();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.GMAIL_ID,
  process.env.GMAIL_SECRET,
  "http://localhost:3000/oauth2callback" // Substitua pelo seu URI de redirecionamento
);

// URL para redirecionar o usuário para a página de autorização do Google
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/gmail.send"],
});

export const googleSignIn = async (req: Request, res: Response) => {
  const { token, uid, role } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res.status(400).json({
        error:
          "No payload available from token verification or email is missing.",
      });
    }

    let user = await userRepository.findByEmail(payload.email);
    if (!user) {
      const code = uuidv4().substring(0, 4); // Gerar código de 4 caracteres
      user = await userRepository.create({
        name: payload.name!,
        email: payload.email,
        googleId: uid || payload.sub,
        role: role,
        code: code,
      });
    } else {
      // Atualize o Google ID e outras informações se o usuário já existir
      user.googleId = uid || payload.sub;
      user.name = payload.name!;
      user.role = role;
      await userRepository.update(user._id, user);
    }

    if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
      return res
        .status(500)
        .json({ error: "Environment variables for JWT are not set." });
    }

    const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Configurando os tokens no cabeçalho da resposta
    res.setHeader("Access-Token", accessToken);
    res.setHeader("Refresh-Token", refreshToken);

    res.status(200).json({
      message: "Authentication successful",
      email: user.email,
      userId: user._id,
      username: user.name,
      descricao: user.descricao,
      certificacoes: user.certificacoes,
      image: user.image,
      active: user.active,
    });
  } catch (error) {
    console.error("Authentication failed:", error);
    res.status(401).json({ error: "Authentication failed" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const userRepository = new UserRepository();
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = uuidv4().substring(0, 4); // Gerar código de 4 caracteres
    const createUser = new CreateUser(userRepository);
    const user = await createUser.execute({
      name,
      email,
      password: hashedPassword,
      role: role,
      code: code,
      active: false,
    });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to register user" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (
      !email ||
      typeof email !== "string" ||
      !password ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: "Email and password must be provided and must be strings 2.",
      });
    }

    const userRepository = new UserRepository();
    const user = await userRepository.findByEmail(email);

    if (!user || !user.password) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    // Armazenar os tokens no banco de dados
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    await userRepository.update(user._id, user);
    res.setHeader("access-token", accessToken);
    res.setHeader("refresh-token", refreshToken);
    res.status(200).json({
      message: "Logged in successfully",
      user_id: user._id,
      email: user.email,
      display_name: user.name,
      role: user.role,
      descricao: user.descricao,
      certificacoes: user.certificacoes,
      image: user.image,
      active: user.active,
    });
  } catch (error: any) {
    console.error("Error during login:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ error: "Refresh token not provided" });
    }

    const userRepository = new UserRepository();
    const user = await userRepository.findByRefreshToken(refreshToken);

    if (!user) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    // Atualizar o access token no banco de dados
    user.accessToken = newAccessToken;
    await userRepository.update(user._id, user);

    // Configurando o novo access token no cabeçalho da resposta
    res.setHeader("Access-Token", newAccessToken);
    return res.status(200).json({
      message: "Access token refreshed successfully",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Failed to refresh access token:", error);
    return res.status(500).json({ error: "Failed to refresh access token" });
  }
};

export const recoverPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await userRepository.findByEmail(email);
    console.log(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const newPassword = Math.random().toString(36).slice(-8); // Gerar uma nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userRepository.update(user._id, { password: hashedPassword });

    await sendEmail(
      email,
      "Password Recovery",
      `Your new password is: ${newPassword}`
    )
      .then(() => console.log("E-mail enviado com sucesso!"))
      .catch((error) => console.error("Erro ao enviar e-mail:", error));

    res.status(200).json({ message: "New password sent to your email" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to recover password" });
  }
};

export const oauth2callback = async (req: Request, res: Response) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    oauth2Client.setCredentials(tokens);

    // Armazene o refresh_token de forma segura
    const refreshToken = tokens.refresh_token;
    console.log("Refresh Token:", refreshToken);

    // Você pode armazenar o refresh token em um banco de dados ou em um arquivo seguro
    // Aqui, estamos apenas enviando de volta como resposta para fins de demonstração
    res.status(200).json({ refreshToken });
  } catch (error) {
    console.error("Error retrieving access token", error);
    res.status(500).json({ error: "Failed to retrieve access token" });
  }
};

export const sendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const address = await Address.findOne({ idUser: user._id });

    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    const phoneNumber = formatPhoneNumber(address.phoneNumber);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await userRepository.update(user._id, { verificationCode });
    await twilioClient.messages.create({
      body: `Codigo de verificação: ${verificationCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    res.status(200).json({ message: "Verification code sent successfully" });
  } catch (error) {
    console.error("Error sending verification code:", error);
    res.status(500).json({ error: "Failed to send verification code" });
  }
};

export const validateCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.verificationCode === code) {
      // Código correto, autenticação bem-sucedida
      user.verificationCode = undefined; // Limpa o código de verificação
      await userRepository.update(user._id, { verificationCode: undefined });

      res.status(200).json({ message: "Verification successful" });
    } else {
      // Código incorreto
      res.status(401).json({ error: "Invalid verification code" });
    }
  } catch (error) {
    console.error("Error verifying code:", error);
    res.status(500).json({ error: "Failed to verify code" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.update(user._id, { password: hashedPassword });

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Failed to reset password" });
  }
};
