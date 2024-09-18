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
import nodemailer from "nodemailer";

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

const gmailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "oliveroliveira222@gmail.com",
    pass: "egyb yiow vauw ghys",
  },
});

const outlookTransporter = nodemailer.createTransport({
  service: "hotmail",
  auth: {
    user: "devfrontjosias@outlook.com",
    pass: "Josias2603@",
  },
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
          "O token de autenticação não retornou um payload válido ou o email está ausente. Verifique se o token fornecido está correto e tente novamente.",
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
      return res.status(500).json({
        error:
          "Variáveis de ambiente para JWT não estão configuradas corretamente. Por favor, verifique a configuração do servidor.",
      });
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
      message:
        "Autenticação realizada com sucesso. Você está autenticado e pode acessar os recursos protegidos.",
      email: user.email,
      userId: user._id,
      username: user.name,
      descricao: user.descricao,
      certificacoes: user.certificacoes,
      image: user.image,
      active: user.active,
    });
  } catch (error) {
    console.error("Falha na autenticação:", error);
    res.status(401).json({
      error:
        "Falha na autenticação. Verifique suas credenciais e tente novamente.",
    });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role } = req.body;
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error:
          "Já existe um usuário cadastrado com este email. Por favor, utilize um email diferente ou recupere sua senha.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const code = uuidv4().substring(0, 4); // Gerar código de 4 caracteres
    const createUser = new CreateUser(userRepository);

    await createUser.execute({
      name,
      email,
      password: hashedPassword,
      role: role,
      code: code,
      active: role === "USER" ? true : true,
    });
    res.status(201).json({
      message:
        "Usuário registrado com sucesso! Um email de confirmação foi enviado para o endereço fornecido.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Falha ao registrar o usuário. Tente novamente mais tarde ou entre em contato com o suporte.",
    });
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
        error:
          "Email e senha devem ser fornecidos e devem ser do tipo string. Por favor, verifique as informações fornecidas e tente novamente.",
      });
    }

    const user = await userRepository.findByEmail(email);

    if (!user || !user.password) {
      return res.status(401).json({
        error:
          "Credenciais inválidas. Por favor, verifique seu email e senha e tente novamente.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Credenciais inválidas. A senha fornecida está incorreta.",
      });
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
      message:
        "Login realizado com sucesso! Você está autenticado e pode acessar os recursos protegidos.",
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
    console.error("Erro durante o login:", error);
    res.status(500).json({
      error:
        "Erro durante o login. Tente novamente mais tarde ou entre em contato com o suporte.",
    });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.body.refreshToken || req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error:
          "Token de renovação não fornecido. Por favor, faça login novamente para obter um novo token.",
      });
    }

    const user = await userRepository.findByRefreshToken(refreshToken);

    if (!user) {
      return res.status(401).json({
        error:
          "Token de renovação inválido. O token fornecido não corresponde a nenhum usuário registrado.",
      });
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
      message:
        "Token de acesso renovado com sucesso! Você pode continuar a utilizar os recursos protegidos.",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Falha ao renovar o token de acesso:", error);
    return res.status(500).json({
      error:
        "Falha ao renovar o token de acesso. Tente novamente mais tarde ou entre em contato com o suporte.",
    });
  }
};

export const recoverPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await userRepository.findByEmail(email);
    console.log(email);
    if (!user) {
      return res.status(404).json({
        error:
          "Usuário não encontrado. Por favor, verifique o email fornecido e tente novamente.",
      });
    }

    const newPassword = Math.random().toString(36).slice(-8); // Gerar uma nova senha
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userRepository.update(user._id, { password: hashedPassword });

    await sendEmail(
      email,
      "Recuperação de Senha",
      `Sua nova senha é: ${newPassword}. Recomendamos que você altere essa senha assim que possível para garantir a segurança da sua conta.`
    )
      .then(() => console.log("E-mail enviado com sucesso!"))
      .catch((error) => console.error("Erro ao enviar e-mail:", error));

    res.status(200).json({
      message:
        "Nova senha enviada para o seu email. Verifique sua caixa de entrada e siga as instruções para acessar sua conta.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error:
        "Falha ao recuperar a senha. Tente novamente mais tarde ou entre em contato com o suporte.",
    });
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
    res.status(200).json({
      message:
        "Token de acesso obtido com sucesso. O token de renovação foi gerado e deve ser armazenado em um local seguro para uso futuro.",
      refreshToken,
    });
  } catch (error) {
    console.error("Erro ao obter o token de acesso", error);
    res.status(500).json({
      error:
        "Falha ao obter o token de acesso. Verifique as credenciais fornecidas e tente novamente.",
    });
  }
};

export const sendVerificationCode = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      return res.status(404).json({
        error:
          "Usuário não encontrado. Por favor, verifique o email fornecido e tente novamente.",
      });
    }

    const address = await Address.findOne({ idUser: user._id });

    if (!address || !address.phoneNumber) {
      return res.status(404).json({
        error:
          "Endereço ou número de telefone não encontrado para o usuário. Verifique se os dados estão corretos e tente novamente.",
      });
    }

    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await userRepository.update(user._id, { verificationCode });

    let transporter;
    if (email.includes("@gmail.com")) {
      transporter = gmailTransporter;
    } else if (
      email.includes("@outlook.com") ||
      email.includes("@hotmail.com")
    ) {
      transporter = outlookTransporter;
    } else {
      return res
        .status(400)
        .json({ error: "Provedor de e-mail não suportado." });
    }

    // Enviar e-mail de verificação
    await transporter.sendMail({
      from: email.includes("@gmail.com")
        ? '"Oliver Oliveira" <oliveroliveira222@gmail.com>'
        : '"Dev Front Josias" <devfrontjosias@outlook.com>',
      to: email,
      subject: "Código de Verificação",
      text: `Seu código de verificação é: ${verificationCode}`,
    });

    res.status(200).json({
      message:
        "Código de verificação enviado com sucesso para o número de telefone associado e para o endereço de e-mail fornecido. Verifique suas mensagens e siga as instruções.",
    });
  } catch (error) {
    console.error("Erro ao enviar o código de verificação:", error);
    res.status(500).json({
      error:
        "Falha ao enviar o código de verificação. Tente novamente mais tarde ou entre em contato com o suporte.",
    });
  }
};

export const validateCode = async (req: Request, res: Response) => {
  const { email, code } = req.body;

  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        error:
          "Usuário não encontrado. Por favor, verifique o email fornecido e tente novamente.",
      });
    }

    if (user.verificationCode === code) {
      // Código correto, autenticação bem-sucedida
      user.verificationCode = undefined; // Limpa o código de verificação
      await userRepository.update(user._id, { verificationCode: undefined });

      res.status(200).json({
        message:
          "Verificação bem-sucedida! Sua identidade foi confirmada e você pode prosseguir com o acesso à sua conta.",
      });
    } else {
      // Código incorreto
      res.status(401).json({
        error:
          "Código de verificação inválido. Por favor, verifique o código enviado e tente novamente.",
      });
    }
  } catch (error) {
    console.error("Erro ao verificar o código:", error);
    res.status(500).json({
      error:
        "Falha ao verificar o código. Tente novamente mais tarde ou entre em contato com o suporte.",
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        error:
          "Usuário não encontrado. Por favor, verifique o email fornecido e tente novamente.",
      });
    }

    if (!user.verificationCode) {
      return res.status(404).json({
        error:
          "Codigo de validação incorreto ou não encontrado. Entre em contato com o suporte.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await userRepository.update(user._id, {
      password: hashedPassword,
      verificationCode: "",
    });

    res.status(200).json({
      message:
        "Senha redefinida com sucesso! Agora você pode acessar sua conta usando a nova senha.",
    });
  } catch (error) {
    console.error("Erro ao redefinir a senha:", error);
    res.status(500).json({
      error:
        "Falha ao redefinir a senha. Tente novamente mais tarde ou entre em contato com o suporte.",
    });
  }
};
