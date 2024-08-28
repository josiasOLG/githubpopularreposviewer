import axios from "axios";
import qs from "qs";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const { PAGSEGURO_EMAIL, PAGSEGURO_TOKEN, APPID_PAGSEGURO, APPKEY_PAGSEGURO } =
  process.env;

if (
  !PAGSEGURO_EMAIL ||
  !PAGSEGURO_TOKEN ||
  !APPID_PAGSEGURO ||
  !APPKEY_PAGSEGURO
) {
  throw new Error(
    "PagSeguro configuration is missing in environment variables"
  );
}

const PAGSEGURO_API_URL = "https://api.pagseguro.com";
const PAGSEGURO_API_URL_ASSINATURA = "https://api.assinaturas.pagseguro.com";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
  Authorization: `Bearer ${PAGSEGURO_TOKEN}`,
};

// Função para obter o ID da sessão
export const getSessionId = async () => {
  try {
    const response = await axios.post(
      `${PAGSEGURO_API_URL}/sessions`,
      qs.stringify({
        email: PAGSEGURO_EMAIL,
        token: PAGSEGURO_TOKEN,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return response.data.session.id;
  } catch (error: any) {
    console.error("Error getting session ID:", error);
    throw new Error(error.message);
  }
};

export const getCardToken = async (cardData: any) => {
  try {
    const payload = {
      reference_id: uuidv4(), // Gera um UUID único para cada requisição
      customer: {
        name: cardData.cardHolderName,
        email: cardData.email,
        tax_id: cardData.taxId,
        phones: [
          {
            country: cardData.phoneCountry,
            area: cardData.phoneArea,
            number: cardData.phoneNumber,
            type: "MOBILE",
          },
        ],
      },
      payment_method: {
        type: "CREDIT_CARD",
        installments: 1,
        capture: false,
        card: {
          number: cardData.cardNumber.replace(/\s+/g, ""),
          exp_month: cardData.cardExpirationMonth,
          exp_year: cardData.cardExpirationYear,
          security_code: cardData.cardCvv,
          holder: {
            name: cardData.cardHolderName,
            tax_id: cardData.taxId,
          },
        },
      },
    };

    const response = await axios.post(`${PAGSEGURO_API_URL}/charges`, payload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer 7e91cde8-fe75-4dc9-a6a5-35609c8ce48f94e2b7a2472e9f36dbbf562e7a0c811498cd-4cac-4653-aa7e-4adad26a89c6`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.log(error.message);
    console.error(
      "Error getting card token:",
      error.response?.data || error.message
    );
    throw new Error(error.message);
  }
};

// Função para criar um plano de assinatura
export const createSubscriptionPlan = async (planData: any) => {
  try {
    const response = await axios.post(
      `${PAGSEGURO_API_URL_ASSINATURA}/plans`,
      {
        ...planData,
        email: PAGSEGURO_EMAIL,
        token: PAGSEGURO_TOKEN,
      },
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating subscription plan:",
      error.response?.data || error.message
    );
    throw new Error(error.message);
  }
};

export const subscribeUser = async (subscriptionData: any) => {
  try {
    const response = await axios.post(
      `${PAGSEGURO_API_URL_ASSINATURA}/subscriptions`,
      {
        ...subscriptionData,
      },
      { headers }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // A requisição foi feita e o servidor respondeu com um status code fora da faixa de 2xx
      console.error("Error subscribing user:", error.response.data);
      throw new Error(
        `PagSeguro API Error: ${error.response.data.error_messages.join(", ")}`
      );
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.error("Error subscribing user: No response received");
      throw new Error("No response received from PagSeguro API");
    } else {
      // Algo aconteceu na configuração da requisição que disparou um erro
      console.error("Error subscribing user:", error.message);
      throw new Error(`Request Error: ${error.message}`);
    }
  }
};

// Função para criar um cliente
export const createCustomer = async (customerData: any) => {
  try {
    const response = await axios.post(
      `${PAGSEGURO_API_URL_ASSINATURA}/customers`,
      customerData,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error creating customer:",
      error.response?.data || error.message
    );
    throw new Error(error.message);
  }
};

export const updateCustomerBillingInfo = async (
  customerId: any,
  customerData: any
) => {
  try {
    const response = await axios.put(
      `${PAGSEGURO_API_URL_ASSINATURA}/customers/${customerId}/billing_info`,
      customerData,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating customer billing info:",
      error.response?.data || error.message
    );
    throw new Error(error.message);
  }
};

export const getCustomers = async (params: {
  offset?: number;
  limit?: number;
  reference_id?: string;
  q?: string;
}) => {
  try {
    const response = await axios.get(
      `${PAGSEGURO_API_URL_ASSINATURA}/customers`,
      { headers, params }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error getting customers:",
      error.response?.data || error.message
    );
    throw new Error(error.message);
  }
};

export const checkSubscriptionStatus = async (subscriptionId: string) => {
  try {
    const response = await axios.get(
      `${PAGSEGURO_API_URL_ASSINATURA}/subscriptions/${subscriptionId}`,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error checking subscription status:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const activateSubscription = async (subscriptionId: string) => {
  try {
    const response = await axios.get(
      `${PAGSEGURO_API_URL_ASSINATURA}/subscriptions/${subscriptionId}/activate`,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error checking subscription status:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Função para cancelar uma assinatura
export const cancelSubscription = async (subscriptionId: string) => {
  try {
    const response = await axios.put(
      `${PAGSEGURO_API_URL_ASSINATURA}/subscriptions/${subscriptionId}/cancel`,
      {
        email: PAGSEGURO_EMAIL,
        token: PAGSEGURO_TOKEN,
      },
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.log("subscriptionData >>", JSON.stringify(error, null, 2));
    console.error(
      "Error cancelling subscription:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const listAllSubscriptions = async () => {
  try {
    const response = await axios.get(
      `${PAGSEGURO_API_URL_ASSINATURA}/subscriptions`,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error listing subscriptions:",
      error.response?.data || error.message
    );
    throw new Error(error.message);
  }
};

export const updateCustomer = async (customerId: string, data: any) => {
  try {
    const response = await axios.put(
      `${PAGSEGURO_API_URL_ASSINATURA}/customers/${customerId}`,
      data,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating customer:",
      error.response?.data || error.message
    );
    throw new Error(error.message);
  }
};

export const getInvoices = async (
  subscriptionId: string,
  status?: string,
  offset?: number,
  limit?: number
) => {
  try {
    const response = await axios.get(
      `${PAGSEGURO_API_URL_ASSINATURA}/subscriptions/${subscriptionId}/invoices`,
      {
        headers,
        params: {
          status: status || "PAID,UNPAID,WAITING,OVERDUE",
          offset: offset || 0,
          limit: limit || 100,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching invoices:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateSubscription = async (
  subscriptionId: string,
  updateData: any
) => {
  try {
    const response = await axios.put(
      `${PAGSEGURO_API_URL_ASSINATURA}/subscriptions/${subscriptionId}`,
      updateData,
      { headers }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating subscription:",
      error.response?.data || error.message
    );
    throw new Error(error.message);
  }
};
