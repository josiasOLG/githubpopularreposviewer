import { Request, Response } from "express";
import {
  getCardToken,
  createSubscriptionPlan,
  subscribeUser,
  cancelSubscription,
  getSessionId,
  createCustomer,
  getCustomers,
  checkSubscriptionStatus,
  activateSubscription,
  listAllSubscriptions,
  updateCustomer,
  getInvoices,
  updateSubscription,
  updateCustomerBillingInfo,
} from "../../config/pagseguro";
import SubscriptionPlan from "../../frameworks/orm/models/SubscriptionPlan";
import CardToken, { ICardToken } from "../../frameworks/orm/models/CardToken";
import { v4 as uuidv4 } from "uuid";
import { decrypt, encrypt, getCardBrand } from "../../utils/utils";
import { IUser, User } from "../../frameworks/orm/models/User";
import { IAddress } from "../../entities/Address";
import { Types } from "mongoose";
import {
  ISubscription,
  SubscriptionModel,
} from "../../frameworks/orm/models/Subscription";
import { findCardTokensByUserId } from "../repositories/CardTokenRepository";
import { UserRepository } from "../repositories/UserRepository";
import { AddressRepository } from "../repositories/AddressRepository";
import { Address } from "../../frameworks/orm/models/Address";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";

const addressRepository = new AddressRepository();
const subscriptionRepository = new SubscriptionRepository();

export const createPlans = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const plans = [
      {
        name: "Plano Mensal",
        description: "Plano Mensal",
        amount: {
          value: 100, // Valor do plano em centavos (R$ 29,90)
          currency: "BRL",
          setup_fee: 0,
          limit_subscriptions: 100,
        },
        interval: {
          unit: "MONTH",
          length: 1,
        },
        trial: {
          days: 0,
          enabled: false,
          hold_setup_fee: false,
        },
        payment_methods: ["CREDIT_CARD"],
      },
      {
        name: "Plano Trimestral",
        description: "Plano Trimestral",
        amount: {
          value: 200, // Valor do plano em centavos (R$ 79,90)
          currency: "BRL",
          setup_fee: 0,
          limit_subscriptions: 100,
        },
        interval: {
          unit: "MONTH",
          length: 3,
        },
        trial: {
          days: 0,
          enabled: false,
          hold_setup_fee: false,
        },
        payment_methods: ["CREDIT_CARD"],
      },
      {
        name: "Plano Anual",
        description: "Plano Anual",
        amount: {
          value: 300, // Valor do plano em centavos (R$ 299,90)
          currency: "BRL",
          setup_fee: 0,
          limit_subscriptions: 100,
        },
        interval: {
          unit: "YEAR",
          length: 1,
        },
        trial: {
          days: 0,
          enabled: false,
          hold_setup_fee: false,
        },
        payment_methods: ["CREDIT_CARD"],
      },
    ];

    const results = [];
    for (const plan of plans) {
      // Adicionar reference_id único a cada plano
      const planWithReference = { ...plan, reference_id: uuidv4() };
      const result = await createSubscriptionPlan(planWithReference);
      results.push(result);

      // Salvar no MongoDB
      const newPlan = new SubscriptionPlan({
        idPagseguro: result.id,
        reference: planWithReference.reference_id,
        name: planWithReference.name,
        description: planWithReference.description,
        period: planWithReference.interval.unit,
        amountPerPayment: planWithReference.amount.value,
        expiration: {
          value: planWithReference.interval.length,
          unit: planWithReference.interval.unit,
        },
      });
      await newPlan.save();
    }

    res.status(201).json(results);
  } catch (error: any) {
    console.error(
      "Error creating subscription plans:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ message: "Error creating subscription plans", error });
  }
};

export const listPlans = async (req: Request, res: Response): Promise<void> => {
  try {
    const plans = await SubscriptionPlan.find();
    res.status(200).json(plans);
  } catch (error) {
    console.error("Error listing subscription plans:", error);
    res
      .status(500)
      .json({ message: "Error listing subscription plans", error });
  }
};

export const updateBillingInfoController = async (
  req: Request,
  res: Response
): Promise<any> => {
  const { userId, cardNumber, cardCvc, expMonth, expYear, email, nome } =
    req.body;

  try {
    const address = await addressRepository.findByIdUser(userId);

    if (
      !address ||
      address.length === 0 ||
      !address[0].cpf ||
      !address[0].phoneNumber
    ) {
      return res.status(404).json({
        error:
          "Endereço ou número de telefone não encontrado para o usuário. Verifique se os dados estão corretos e tente novamente.",
      });
    }

    const sanitizedTaxId = address[0].cpf
      .replace(/[.\-]/g, "")
      .replace(/\s+/g, "");

    const areaCodeMatch = address[0].phoneNumber.match(/\((\d{2})\)/);
    const phoneArea = areaCodeMatch ? areaCodeMatch[1] : "";
    const phoneNumberMatch = address[0].phoneNumber.match(/\)\s*(\d+-\d+)/);
    const phoneNumber = phoneNumberMatch
      ? phoneNumberMatch[1].replace(/\D/g, "")
      : "";

    const sanitizedCardNumber = cardNumber.replace(/\s+/g, "");
    const cardBrand = getCardBrand(sanitizedCardNumber);
    const cardLastFourDigits = sanitizedCardNumber.slice(-4);
    const referenceId1 = uuidv4();

    const billingInfo = [
      {
        type: "CREDIT_CARD",
        card: {
          number: cardNumber,
          security_code: cardCvc,
          exp_year: expYear,
          exp_month: expMonth,
          holder: {
            tax_id: sanitizedTaxId,
            phone: {
              country: "55",
              area: phoneArea,
              number: phoneNumber,
            },
          },
        },
      },
    ];

    const subscriptions =
      await subscriptionRepository.getAllSubscriptionsByUserId(userId);
    const response = await updateCustomerBillingInfo(
      subscriptions[0].customer.id,
      billingInfo
    );

    const existingCardToken = await CardToken.findOne({ userId: userId });
    const numberCard = encrypt(sanitizedCardNumber);

    if (existingCardToken) {
      existingCardToken.numberCard = numberCard;
      existingCardToken.expiryMonth = expMonth;
      existingCardToken.expiryYear = expYear;
      existingCardToken.cpf = sanitizedTaxId;
      existingCardToken.email = email;
      existingCardToken.holderName = nome;
      existingCardToken.cardBrand = cardBrand;
      await existingCardToken.save();
    } else {
      const newCardToken = new CardToken({
        userId: userId,
        numberCard: numberCard,
        brand: cardBrand,
        expiryMonth: expMonth,
        expiryYear: expYear,
        cardLastFourDigits: cardLastFourDigits,
        email: email,
        holderName: nome,
        cpf: sanitizedTaxId,
        referenceId1: referenceId1,
      });
      await newCardToken.save();
    }

    res
      .status(200)
      .json({ message: "Billing info updated successfully", response });
  } catch (error: any) {
    console.error("Error updating billing info:", error);
    res
      .status(500)
      .json({ message: "Error updating billing info", error: error.message });
  }
};

export const getCardTokenController = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const {
      userId,
      cardNumber,
      cardExpiry,
      cardCvc,
      holderName,
      email,
      taxId,
      number,
    } = req.body;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "Formato de ID de usuário inválido." });
    }

    const address = await addressRepository.findByIdUser(userId);
    if (!address || address.length === 0 || !address[0]) {
      return res.status(404).json({ message: "Endereço não encontrado." });
    }

    const sanitizedCardNumber = cardNumber.replace(/\s+/g, "");
    const sanitizedtaxId = taxId.replace(/[.\-]/g, "").replace(/\s+/g, "");
    const [expiryMonth, expiryYear] = cardExpiry.split("/");

    const cardBrand = getCardBrand(sanitizedCardNumber);
    const cardLastFourDigits = sanitizedCardNumber.slice(-4);
    const areaCodeMatch = number.match(/\((\d{2})\)/);
    const phoneArea = areaCodeMatch ? areaCodeMatch[1] : "";
    const phoneNumberMatch = number.match(/\)\s*(\d+-\d+)/);
    const phoneNumber = phoneNumberMatch
      ? phoneNumberMatch[1].replace(/\D/g, "")
      : "";

    const addressPostalCode =
      address[0].zipCode?.replace(/[.\-]/g, "").replace(/\s+/g, "") ?? "";

    const userRepository = new UserRepository();
    const user = await userRepository.getById(userId);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const referenceId1 = uuidv4();
    const customerData = {
      reference_id: referenceId1,
      name: holderName,
      email: email,
      tax_id: sanitizedtaxId,
      phones: [
        { type: "MOBILE", country: "55", area: phoneArea, number: phoneNumber },
      ],
      address: {
        street: address[0].street,
        number: address[0].number,
        complement: address[0].complement || "",
        district: address[0].city,
        city: address[0].city,
        state: address[0].state,
        country: "BRA",
        postal_code: addressPostalCode,
        locality: address[0].locality,
        region_code: address[0].state,
      },
      billing_info: [
        {
          type: "CREDIT_CARD",
          card: {
            number: sanitizedCardNumber,
            security_code: cardCvc,
            brand: cardBrand,
            exp_month: expiryMonth,
            exp_year: expiryYear,
            holder: { name: holderName },
          },
        },
      ],
    };

    const customerResponse = await createCustomer(customerData);
    user.customerId = customerResponse.id;
    await userRepository.update(user._id, user);

    const numberCard = encrypt(sanitizedCardNumber);
    const newCardToken = new CardToken({
      userId,
      numberCard,
      expiryMonth,
      expiryYear,
      holderName,
      cardBrand,
      cardLastFourDigits,
      email,
      cpf: sanitizedtaxId,
      referenceId1,
    });
    await newCardToken.save();

    return res
      .status(200)
      .json({ message: "Token do cartão salvo com sucesso." });
  } catch (error: any) {
    console.error("Erro ao obter o token do cartão:", error);
    return res
      .status(500)
      .json({ message: "Erro ao obter o token do cartão.", error });
  }
};

// Controller to list the card tokens
export const listCardTokens = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    console.log(id);
    if (!id) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const cards = await CardToken.find({ userId: id });
    res.status(200).json(cards);
  } catch (error) {
    console.error("Error listing card tokens:", error);
    res.status(500).json({ message: "Error listing card tokens", error });
  }
};

export const subscribe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, planId, security_code, holderName } = req.body;
    if (!userId || !planId || !holderName || !security_code) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }
    const card: ICardToken[] | null = await findCardTokensByUserId(userId);
    const userRepository = new UserRepository();
    const user = await userRepository.getById(userId);
    let customerId = user?.customerId;
    const numberCard = decrypt(card[0].numberCard);
    const referenceId1 = uuidv4();
    const payload = {
      reference_id: referenceId1,
      plan: {
        id: planId,
      },
      customer: {
        id: customerId,
        billing_info: [
          {
            type: "CREDIT_CARD",
            card: {
              number: numberCard,
              security_code: security_code,
              brand: card[0].cardBrand,
              exp_month: card[0].expiryMonth,
              exp_year: card[0].expiryYear,
              holder: {
                name: holderName,
              },
            },
          },
        ],
      },
      payment_method: [
        {
          type: "CREDIT_CARD",
          card: {
            security_code: security_code,
          },
        },
      ],
      next_invoice_at: "2022-10-01",
      pro_rata: false,
    };
    const response = await subscribeUser(payload);
    console.log(4);
    const subscription = new SubscriptionModel({
      userId: userId,
      idPagseguro: response.id,
      reference_id: response.reference_id,
      amount: response.amount,
      status: response.status,
      plan: response.plan,
      payment_method: response.payment_method.map((pm: any) => ({
        type: pm.type,
        card: {
          brand: pm.card.brand,
          first_digits: pm.card.first_digits,
          last_digits: pm.card.last_digits,
          exp_month: pm.card.exp_month,
          exp_year: pm.card.exp_year,
          holder: {
            name: pm.card.holder.name,
          },
        },
      })),
      next_invoice_at: response.next_invoice_at,
      pro_rata: response.pro_rata,
      customer: response.customer,
      created_at: response.created_at,
      updated_at: response.updated_at,
      links: response.links.map((link: any) => ({
        rel: link.rel,
        href: link.href,
        media: link.media,
        type: link.type,
      })),
    });
    await subscription.save();
    res.status(201).json(subscription);
  } catch (error: any) {
    if (error.response) {
      // Se precisar acessar uma propriedade específica dentro de data
      const errorData = error.response.data;
      if (errorData && errorData.someSpecificProperty) {
        console.error("Specific Error Info:", errorData.someSpecificProperty);
      } else {
        console.error(
          "Error creating subscription plans:",
          JSON.stringify(errorData, null, 2)
        );
      }
    } else {
      console.error("Error creating subscription plans:", error.message);
    }

    res
      .status(500)
      .json({ message: "Error creating subscription plans", error });
  }
};

export const cancel = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriptionCode } = req.body;
    const result = await cancelSubscription(subscriptionCode);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    res.status(500).json({ message: "Error cancelling subscription", error });
  }
};

export const getSubscriptionStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    const subscription = await SubscriptionModel.findOne({ userId }).exec();
    if (!subscription) {
      res.status(404).json({ message: "Subscription not found" });
      return; // Certificar-se de retornar após enviar a resposta
    }
    const { idPagseguro } = subscription;
    const status = await checkSubscriptionStatus(idPagseguro);
    res.status(200).json(status);
  } catch (error: any) {
    console.error(
      "Error getting subscription status:",
      error.response?.data || error.message
    );
    res
      .status(500)
      .json({ message: "Error getting subscription status", error });
  }
};

export const activateSubscriptionStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    const subscription = await SubscriptionModel.findOne({ userId }).exec();
    if (!subscription) {
      res.status(404).json({ message: "Subscription not found" });
      return;
    }
    const { idPagseguro } = subscription;
    const response = await activateSubscription(idPagseguro);
    res.status(200).json(response);
  } catch (error: any) {
    console.error(
      "Error activating subscription:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Error activating subscription", error });
  }
};

export const cancelSubscriptionStatus = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.body;

  try {
    // Buscar a assinatura pelo ID do usuário
    const subscription = await SubscriptionModel.findOne({ userId }).exec();
    if (!subscription) {
      res.status(404).json({ message: "Subscription not found" });
      return; // Certificar-se de retornar após enviar a resposta
    }
    // Pegar o idPagseguro da assinatura
    const { idPagseguro } = subscription;
    console.log(idPagseguro);
    // Cancelar a assinatura no PagSeguro
    const response = await cancelSubscription(idPagseguro);
    console.log(response);
    res.status(200).json(response);
  } catch (error: any) {
    console.error(
      "Error cancelling subscription:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Error cancelling subscription", error });
  }
};

export const getCustomersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, offset, limit, reference_id } = req.body;

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    if (!Types.ObjectId.isValid(userId)) {
      res.status(400).json({ message: "Invalid User ID format" });
      return;
    }

    const address = await addressRepository.findByIdUser(userId);

    if (!address || address.length === 0) {
      res.status(400).json({
        message: `Erro: endereço não encontrado`,
      });
      return;
    }

    const userRepository = new UserRepository();
    const user = await userRepository.getById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const sanitizedTaxId =
      address[0].cpf?.replace(/[.\-]/g, "").replace(/\s+/g, "") ?? ""; // error TS2532: Object is possibly 'undefined'.

    const customersResponse = await getCustomers({
      offset: offset ? parseInt(offset, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      reference_id: reference_id,
      q: sanitizedTaxId,
    });

    const customers = customersResponse.customers;

    if (!Array.isArray(customers)) {
      res
        .status(500)
        .json({ message: "Invalid response format from PagSeguro API" });
      return;
    }

    const customer = customers.find(
      (customer: any) => customer.tax_id === sanitizedTaxId
    );

    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    const subscriptionsResponse = await listAllSubscriptions();
    const subscriptions = subscriptionsResponse.subscriptions;
    const subscription = subscriptions.find(
      (subscription: any) => subscription.customer.id === customer.id
    );
    let subscriptionStatus = null;
    let subscriptionId = null;
    let hasSubscription = false;

    if (subscription) {
      subscriptionId = subscription.id;
      subscriptionStatus = subscription.status;
      hasSubscription = true;
    }

    // Fetch card token details
    const cardToken = await CardToken.findOne({ userId });

    if (!cardToken) {
      res.status(404).json({ message: "Card token not found" });
      return;
    }

    res.status(200).json({
      hasSubscription,
      subscriptionStatus,
      subscriptionId,
      cardDetails: {
        holderName: cardToken.holderName,
        expiryMonth: cardToken.expiryMonth,
        expiryYear: cardToken.expiryYear,
        cardLastFourDigits: cardToken.cardLastFourDigits,
      },
    });
  } catch (error: any) {
    console.error("Error getting customers:", error);
    res
      .status(500)
      .json({ message: "Error getting customers", error: error.message });
  }
};

export const updateCustomerData = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { userId, name, email, tax_id, phones, birth_date, address } =
      req.body;

    if (!userId || !name || !email || !phones || !birth_date || !address) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const customerData = {
      reference_id: uuidv4(),
      name,
      email,
      phones,
      birth_date,
      address,
    };

    const userRepository = new UserRepository();
    const user = await userRepository.getById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const customerId = user.customerId;

    if (!customerId) {
      res.status(400).json({ message: "Customer ID not found for user" });
      return;
    }

    const updatedCustomer = await updateCustomer(
      "CUST_53FCF894-6494-4DF3-AC6B-A6E3D4ABBB27",
      customerData
    );

    res.status(200).json(updatedCustomer);
  } catch (error: any) {
    console.error(
      "Error updating customer data:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Error updating customer data", error });
  }
};

export const listInvoices = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { subscriptionId } = req.params;
  const { status, offset, limit } = req.query;

  try {
    console.log(subscriptionId);
    const invoices = await getInvoices(
      subscriptionId,
      status as string,
      parseInt(offset as string),
      parseInt(limit as string)
    );
    res.status(200).json(invoices);
  } catch (error: any) {
    console.error(
      "Error fetching invoices:",
      error.response?.data || error.message
    );
    res.status(500).json({ message: "Error fetching invoices", error });
  }
};

export const renewSubscription = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      userId,
      cardNumber,
      expiryMonth,
      expiryYear,
      security_code,
      holderName,
    } = req.body;

    if (
      !userId ||
      !cardNumber ||
      !expiryMonth ||
      !expiryYear ||
      !security_code
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Buscar a assinatura existente do usuário
    const existingSubscription = await SubscriptionModel.findOne({ userId });

    if (!existingSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const address = await addressRepository.findByIdUser(userId);

    if (!address || address.length === 0 || !address[0]) {
      return res.status(404).json({ message: "Endereço não encontrado." });
    }

    const sanitizedTaxId =
      address[0].cpf?.replace(/[.\-]/g, "").replace(/\s+/g, "") ?? ""; // Correção: uso de encadeamento opcional
    const areaCodeMatch = address[0].phoneNumber?.match(/\((\d{2})\)/); // Correção: encadeamento opcional
    const phoneArea = areaCodeMatch ? areaCodeMatch[1] : "";
    const phoneNumberMatch = address[0].phoneNumber?.match(/\)\s*(\d+-\d+)/); // Correção: encadeamento opcional
    const phoneNumber = phoneNumberMatch
      ? phoneNumberMatch[1].replace(/\D/g, "")
      : "";
    const addressPostalCode = address[0].zipCode?.replace(/-/g, "") ?? ""; // Correção: encadeamento opcional

    const userRepository = new UserRepository();
    const user = await userRepository.getById(userId);

    let customerId = user?.customerId;

    const payload = {
      reference_id: existingSubscription.reference_id,
      plan: {
        id: existingSubscription.plan.id,
      },
      customer: {
        id: customerId,
        billing_info: [
          {
            type: "CREDIT_CARD",
            card: {
              number: cardNumber.replace(/\s+/g, ""),
              security_code: security_code,
              brand: getCardBrand(cardNumber),
              exp_month: expiryMonth,
              exp_year: expiryYear,
              holder: {
                name: existingSubscription.customer.name,
              },
            },
          },
        ],
      },
      payment_method: [
        {
          type: "CREDIT_CARD",
          card: {
            number: cardNumber.replace(/\s+/g, ""),
            security_code: security_code,
            brand: getCardBrand(cardNumber),
            exp_month: expiryMonth,
            exp_year: expiryYear,
            holder: {
              name: existingSubscription.customer.name,
            },
          },
        },
      ],
      next_invoice_at: existingSubscription.next_invoice_at,
      pro_rata: existingSubscription.pro_rata,
    };

    console.log("payload>>", payload);
    const response = await subscribeUser(payload);
    console.log("response>>", response);

    // Atualizar a assinatura existente com os novos dados
    existingSubscription.idPagseguro = response.id;
    existingSubscription.reference_id = response.reference_id;
    existingSubscription.amount = response.amount;
    existingSubscription.status = response.status;
    existingSubscription.plan = response.plan;
    existingSubscription.payment_method = response.payment_method.map(
      (pm: any) => ({
        type: pm.type,
        card: {
          brand: pm.card.brand,
          first_digits: pm.card.first_digits,
          last_digits: pm.card.last_digits,
          exp_month: pm.card.exp_month,
          exp_year: pm.card.exp_year,
          holder: {
            name: pm.card.holder.name,
          },
        },
      })
    );
    existingSubscription.next_invoice_at = response.next_invoice_at;
    existingSubscription.pro_rata = response.pro_rata;
    existingSubscription.customer = response.customer;
    existingSubscription.created_at = response.created_at;
    existingSubscription.updated_at = response.updated_at;
    existingSubscription.links = response.links.map((link: any) => ({
      rel: link.rel,
      href: link.href,
      media: link.media,
      type: link.type,
    }));

    console.log(9);
    await existingSubscription.save();
    return res.status(200).json(existingSubscription);
  } catch (error: any) {
    console.error(
      "Error renewing subscription:",
      error.response?.data || error.message
    );
    return res
      .status(500)
      .json({ message: "Error renewing subscription", error });
  }
};
