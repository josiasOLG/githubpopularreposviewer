import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

const CRYPTO_KEY = process.env.CRYPTO_KEY || "";
const CRYPTO_IV = process.env.CRYPTO_IV || "";

if (!CRYPTO_KEY || !CRYPTO_IV) {
  throw new Error(
    "CRYPTO_KEY and CRYPTO_IV must be defined in the environment variables"
  );
}

export function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(CRYPTO_KEY, "hex"),
    Buffer.from(CRYPTO_IV, "hex")
  );
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

export function decrypt(text: string): string {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(CRYPTO_KEY, "hex"),
    Buffer.from(CRYPTO_IV, "hex")
  );
  let decrypted = decipher.update(text, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export const getCardBrand = (cardNumber: string): string => {
  // Número de teste
  if (cardNumber === "4111111111111111") {
    return "VISA";
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

  return "UNKNOWN";
};

export function generateIdempotencyKey(): string {
  const randomString = Math.random().toString(36).substring(2, 15);
  const timestamp = Date.now();
  return `${randomString}-${timestamp}`;
}

export function formatErrorObject(obj: any, indent = ""): string {
  let result = "";
  for (const key in obj) {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      result += `${indent}${key}: {\n${formatErrorObject(
        obj[key],
        indent + "  "
      )}${indent}}\n`;
    } else {
      result += `${indent}${key}: ${obj[key]}\n`;
    }
  }
  return result;
}

export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  return `+55${cleaned}`;
};
