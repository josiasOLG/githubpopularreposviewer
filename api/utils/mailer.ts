// utils/mailer.ts
import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    '4049569468-i9sr1bmh24j46p5168ijagt1job6lm06.apps.googleusercontent.com', // Substitua pelo seu ID do cliente
    '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', // Substitua pelo seu segredo do cliente
    'https://developers.google.com/oauthplayground', // URL de redirecionamento
  );

  oauth2Client.setCredentials({
    refresh_token:
      '1//04vuhy3d5HfLvCgYIARAAGAQSNgF-L9IrnGlQI5zG7JDdDqBgQwk4iRhjptAOsWldNgm3GvzAe80I6wpiYY4KgQKPeQGIPKePFw', // Substitua pelo seu novo token de atualização
  });

  const accessToken = await oauth2Client.getAccessToken();

  if (!accessToken.token) {
    throw new Error('Failed to create access token');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: 'josiasoliveira111@gmail.com', // Substitua pelo seu e-mail
      clientId: '4049569468-i9sr1bmh24j46p5168ijagt1job6lm06.apps.googleusercontent.com',
      clientSecret: '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',
      refreshToken:
        '1//04vuhy3d5HfLvCgYIARAAGAQSNgF-L9IrnGlQI5zG7JDdDqBgQwk4iRhjptAOsWldNgm3GvzAe80I6wpiYY4KgQKPeQGIPKePFw', // Substitua pelo seu novo token de atualização
      accessToken: accessToken.token,
    },
  } as SMTPTransport.Options);

  return transporter;
};

export const sendEmail = async (to: string, subject: string, text: string) => {
  const transporter = await createTransporter();

  const mailOptions = {
    from: 'josiasoliveira111@gmail.com', // Substitua pelo seu e-mail
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email: ', error);
  }
};
