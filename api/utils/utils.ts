import crypto from 'crypto';

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

export function buildWhatsAppMessageForBusiness(data: AppointmentWhatsAppData): string {
  return (
    `Novo agendamento!\n` +
    `Nome do Cliente: ${data.nomeUser}\n` +
    `Telefone: ${data.userNumber}\n` +
    `Serviço(s) que ele selecionou: ${
      Array.isArray(data.service) ? data.service.join(', ') : data.service
    }\n` +
    `Data: ${data.date}\n` +
    `Hora: ${data.time}\n` +
    `Modalidade: ${data.modality}\n` +
    `Observações: ${data.notes || 'Nenhuma'}\n` +
    `ID do Serviço: ${data.idServico}\n` +
    `Repetição: ${data.repete || 'Não'}\n` +
    `ID do Cliente: ${data.userId}\n` +
    (data.barberId ? `ID do Barbeiro: ${data.barberId}\n` : '') +
    (data.color ? `Cor: ${data.color}\n` : '')
  );
}

export function buildWhatsAppMessageForUser(data: AppointmentWhatsAppData): string {
  return (
    `Seu agendamento foi realizado com sucesso!\n` +
    `Serviço(s): ${Array.isArray(data.service) ? data.service.join(', ') : data.service}\n` +
    `Data: ${data.date}\n` +
    `Hora: ${data.time}\n` +
    `Modalidade: ${data.modality}\n` +
    `Observações: ${data.notes || 'Nenhuma'}\n`
  );
}

export function buildWhatsAppMessageForApproval(data: any): string {
  const dateObj = new Date(data.date);

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
    `Modalidade: ${data.modality}\n` +
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
