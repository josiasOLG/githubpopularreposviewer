import crypto from 'crypto';
import moment from 'moment-timezone';
import { Appointment } from '../frameworks/orm/models/Appointment';

const CRYPTO_KEY = process.env.CRYPTO_KEY || '';
const CRYPTO_IV = process.env.CRYPTO_IV || '';

interface AppointmentWhatsAppData {
  nomeUser: string;
  userNumber: string;
  service: string[] | string;
  date: string;
  time: string;
  modality: string;
  notes?: string;
  idServico: string;
  repete?: string;
  userId: string;
  barberId?: string;
  color?: string;
}

if (!CRYPTO_KEY || !CRYPTO_IV) {
  throw new Error('CRYPTO_KEY and CRYPTO_IV must be defined in the environment variables');
}

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(CRYPTO_KEY, 'hex'),
    Buffer.from(CRYPTO_IV, 'hex'),
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// Translation functions for English to Portuguese
function translateModality(modality: string): string {
  const modalityTranslations: Record<string, string> = {
    Home: 'Domicílio',
    home: 'Domicílio',
    HOME: 'Domicílio',
    Shop: 'Presencial',
    shop: 'Presencial',
    SHOP: 'Presencial',
    Presencial: 'Presencial',
    presencial: 'Presencial',
    PRESENCIAL: 'Presencial',
    Online: 'Online',
    online: 'Online',
    ONLINE: 'Online',
    Virtual: 'Virtual',
    virtual: 'Virtual',
    VIRTUAL: 'Virtual',
  };

  return modalityTranslations[modality] || modality;
}

function translateRepete(repete: string): string {
  const repeteTranslations: Record<string, string> = {
    Daily: 'Diário',
    daily: 'Diário',
    DAILY: 'Diário',
    Weekly: 'Semanal',
    weekly: 'Semanal',
    WEEKLY: 'Semanal',
    Monthly: 'Mensal',
    monthly: 'Mensal',
    MONTHLY: 'Mensal',
    Yearly: 'Anual',
    yearly: 'Anual',
    YEARLY: 'Anual',
    None: 'Não',
    none: 'Não',
    NONE: 'Não',
    No: 'Não',
    no: 'Não',
    NO: 'Não',
    Never: 'Nunca',
    never: 'Nunca',
    NEVER: 'Nunca',
  };

  return repeteTranslations[repete] || repete;
}

export function buildWhatsAppMessageForBusiness(data: AppointmentWhatsAppData): string {
  // Format the date nicely
  const dateObj = new Date(data.date);
  const formattedDate = dateObj.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  });

  // Format service display
  const serviceDisplay = Array.isArray(data.service) ? data.service.join(', ') : data.service;

  // Translate modality from English to Portuguese
  const translatedModality = translateModality(data.modality);

  // Create the recurrence text if applicable
  let recurrenceText = '';
  if (data.repete && data.repete !== 'Não' && data.repete !== 'não') {
    const translatedRepete = translateRepete(data.repete);
    recurrenceText = `\n\n📅 *Recorrência*: ${translatedRepete}`;
  }

  return (
    `🎉 *NOVO AGENDAMENTO!* 🎉\n\n` +
    `Olá! Você recebeu um novo agendamento através do seu sistema. Acesso o app Stilovox e vá em agendamentos para realizar a provação ou rejeição do agendamento\n\n` +
    `👤 *Cliente*: ${data.nomeUser}\n` +
    `📱 *Contato*: ${data.userNumber}\n\n` +
    `🛠️ *Serviço(s)*: ${serviceDisplay}\n` +
    `📆 *Data*: ${formattedDate}\n` +
    `⏰ *Horário*: ${data.time}\n` +
    `🏠 *Modalidade*: ${translatedModality}${recurrenceText}\n\n` +
    `📝 *Observações do cliente*:\n${data.notes || 'Nenhuma observação adicional.'}\n\n` +
    `Por favor, confirme este agendamento com o cliente o mais breve possível.` +
    `\n\nAtenciosamente,\nSistema de Agendamentos da stilovox`
  );
}

export function buildWhatsAppMessageForUser(data: AppointmentWhatsAppData): string {
  const translatedModality = translateModality(data.modality);

  return (
    `Seu agendamento foi realizado com sucesso!\n` +
    `Serviço(s): ${Array.isArray(data.service) ? data.service.join(', ') : data.service}\n` +
    `Data: ${data.date}\n` +
    `Hora: ${data.time}\n` +
    `Modalidade: ${translatedModality}\n` +
    `Observações: ${data.notes || 'Nenhuma'}\n`
  );
}

export function buildWhatsAppMessageForApproval(data: any): string {
  const dateObj = new Date(data.date);
  const translatedModality = translateModality(data.modality);

  const formattedDate = dateObj.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo',
  });

  return (
    `Olá ${data.nomeUser}! Seu agendamento foi APROVADO!\n\n` +
    `Detalhes do agendamento:\n` +
    `Serviço(s): ${Array.isArray(data.service) ? data.service.join(', ') : data.service}\n` +
    `Data: ${formattedDate} às ${data.time}\n` +
    `Modalidade: ${translatedModality}\n` +
    `Observações: ${
      data.notes ||
      'Nenhuma observação adicional no momento. Caso tenha alguma dúvida ou necessidade especial, fique à vontade para entrar em contato.'
    }\n\n` +
    `Agradecemos pela preferência e aguardamos você!`
  );
}

export const IsValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export function buildWhatsAppUrl(phone: string, message: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('9')) {
    cleaned = '55' + cleaned;
  } else if (cleaned.length === 11 && cleaned.startsWith('1')) {
    cleaned = '1' + cleaned;
  } else if (cleaned.length === 13 && cleaned.startsWith('55')) {
  } else if (cleaned.length === 10) {
    cleaned = '55' + cleaned;
  }
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function decrypt(text: string): string {
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(CRYPTO_KEY, 'hex'),
    Buffer.from(CRYPTO_IV, 'hex'),
  );
  let decrypted = decipher.update(text, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export const getCardBrand = (cardNumber: string): string => {
  // Número de teste
  if (cardNumber === '4111111111111111') {
    return 'VISA';
  }

  // Regex para detectar a bandeira do cartão
  const cardPatterns: { [key: string]: RegExp } = {
    VISA: /^4[0-9]{12}(?:[0-9]{3})?$/,
    MASTERCARD: /^5[1-5][0-9]{14}$/,
    AMEX: /^3[47][0-9]{13}$/,
    DISCOVER: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
    DINERS: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
    JCB: /^(?:2131|1800|35\d{3})\d{11}$/,
  };

  for (const brand in cardPatterns) {
    if (cardPatterns[brand].test(cardNumber)) {
      return brand;
    }
  }

  return 'UNKNOWN';
};

export function generateIdempotencyKey(): string {
  const randomString = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now();
  return `${randomString}-${timestamp}`;
}

export function formatErrorObject(obj: any, indent = ''): string {
  let result = '';
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      result += `${indent}${key}: {\n${formatErrorObject(obj[key], indent + '  ')}${indent}}\n`;
    } else {
      result += `${indent}${key}: ${obj[key]}\n`;
    }
  }
  return result;
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  return `+55${cleaned}`;
};

export const generateAvailableTimeSlots = async (
  startTime: string,
  endTime: string,
  sessionDuration: string,
  breakBetweenSessions: string,
  date: string,
  barberId: string,
  lunchStartTime?: string,
  lunchEndTime?: string,
  agendaConfig?: any,
): Promise<string[]> => {
  const slots: string[] = [];

  const convertToMinutes = (timeString: string): number => {
    if (timeString.includes(':')) {
      const [hours, minutes] = timeString.split(':').map(Number);
      return hours * 60 + minutes;
    }
    return parseInt(timeString, 10);
  };

  // Função para obter o dia da semana em português
  const getDayOfWeek = (date: string): string => {
    const dayMapping = {
      0: 'domingo',
      1: 'segunda',
      2: 'terca',
      3: 'quarta',
      4: 'quinta',
      5: 'sexta',
      6: 'sabado',
    };
    const dayIndex = moment(date).day();
    return dayMapping[dayIndex as keyof typeof dayMapping];
  };

  // Determinar os horários a serem usados
  let actualStartTime = startTime;
  let actualEndTime = endTime;
  let actualLunchStartTime = lunchStartTime;
  let actualLunchEndTime = lunchEndTime;

  // Se tiver weeklySchedule e não usar os mesmos horários todos os dias
  if (agendaConfig?.weeklySchedule && !agendaConfig?.useSameHoursEveryday) {
    const dayOfWeek = getDayOfWeek(date);
    const dayConfig = agendaConfig.weeklySchedule[dayOfWeek];

    if (dayConfig) {
      // Se o dia não é dia de trabalho, retorna array vazio
      if (dayConfig.isWorkingDay === false) {
        return [];
      }

      // Usar horários específicos do dia se disponíveis
      actualStartTime = dayConfig.startTime || startTime;
      actualEndTime = dayConfig.endTime || endTime;
      actualLunchStartTime = dayConfig.lunchStartTime || lunchStartTime;
      actualLunchEndTime = dayConfig.lunchEndTime || lunchEndTime;
    } else {
      // Se o dia não está configurado, retorna array vazio
      return [];
    }
  }

  const session = convertToMinutes(sessionDuration);
  const breakTime = convertToMinutes(breakBetweenSessions);

  let current = moment(actualStartTime, 'HH:mm');
  const end = moment(actualEndTime, 'HH:mm');

  const lunchStart = actualLunchStartTime ? moment(actualLunchStartTime, 'HH:mm') : null;
  const lunchEnd = actualLunchEndTime ? moment(actualLunchEndTime, 'HH:mm') : null;

  const hasLunch = lunchStart && lunchEnd;

  const potentialSlots: string[] = [];

  while (current.clone().add(session, 'minutes').isSameOrBefore(end)) {
    const sessionEnd = current.clone().add(session, 'minutes');

    if (hasLunch && sessionEnd.isAfter(lunchStart!) && current.isBefore(lunchEnd!)) {
      current = lunchEnd!.clone();
      continue;
    }

    potentialSlots.push(current.format('HH:mm'));
    current.add(session + breakTime, 'minutes');
  }

  const parsedDate = moment(date);

  if (!parsedDate.isValid()) {
    return []; // Retorna array vazio se a data for inválida
  }

  const startOfDay = parsedDate.clone().startOf('day').toDate();
  const endOfDay = parsedDate.clone().endOf('day').toDate();

  const existingAppointments = await Appointment.find({
    barberId,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    status: { $ne: 'rejeitado' },
  });

  const bookedTimeSlots = existingAppointments.map(appointment => appointment.time);

  const availableSlots = potentialSlots.filter(slot => !bookedTimeSlots.includes(slot));

  return availableSlots;
};

/**
 * Validates a Brazilian CEP (postal code)
 * @param cep CEP to validate (can include hyphen)
 * @returns Boolean indicating if CEP is valid
 */
export const isValidCep = (cep: string): boolean => {
  // CEP must be in format: 12345-678 or 12345678
  const cepRegex = /^\d{5}-?\d{3}$/;
  return cepRegex.test(cep);
};

/**
 * Formats a CEP by removing non-numeric characters and ensuring it has 8 digits
 * @param cep CEP to format
 * @returns Formatted CEP or null if invalid
 */
export const formatCep = (cep: string): string | null => {
  const cleanCep = cep.replace(/\D/g, '');

  if (cleanCep.length !== 8) {
    return null;
  }

  return cleanCep;
};

/**
 * Formats a ViaCEP API response to match our internal address format
 * @param viaCepResponse Response from ViaCEP API
 * @returns Formatted address object
 */
export const formatViaCepResponse = (viaCepResponse: any): any => {
  return {
    street: viaCepResponse.logradouro,
    complement: viaCepResponse.complemento,
    locality: viaCepResponse.bairro,
    city: viaCepResponse.localidade,
    state: viaCepResponse.uf,
    zipCode: viaCepResponse.cep,
    country: 'Brasil',
  };
};
