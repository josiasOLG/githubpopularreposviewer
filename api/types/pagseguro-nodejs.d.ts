declare module "pagseguro-nodejs" {
  interface PagSeguroConfig {
    email: string;
    token: string;
    mode: string;
    debug?: boolean;
  }

  interface CardTokenData {
    sessionId: string;
    cardNumber: string;
    cvv: string;
    expirationMonth: string;
    expirationYear: string;
    cardHolderName: string;
  }

  interface PreApprovalPlanData {
    reference: string;
    name: string;
    description: string;
    amount: number;
    period: string;
    expiration: {
      value: number;
      unit: string;
    };
  }

  interface PreApprovalSubscriptionData {
    plan: string;
    reference: string;
    sender: {
      name: string;
      email: string;
      phone: {
        areaCode: string;
        number: string;
      };
      document: {
        type: string;
        value: string;
      };
    };
    paymentMethod: {
      type: string;
      creditCard: {
        token: string;
        holder: {
          name: string;
          birthDate: string;
          document: {
            type: string;
            value: string;
          };
          phone: {
            areaCode: string;
            number: string;
          };
        };
      };
    };
  }

  class PagSeguro {
    static MODE_SANDBOX: string;
    static MODE_PAYMENT: string;

    constructor(config: PagSeguroConfig);

    currency(currency: string): void;
    reference(reference: string): void;
    session(): Promise<string>;
    cardToken(data: CardTokenData): Promise<string>;
    preApproval: {
      createPlan(data: PreApprovalPlanData): Promise<{ code: string }>;
      create(data: PreApprovalSubscriptionData): Promise<{ code: string }>;
      cancel(subscriptionCode: string): Promise<any>;
    };
  }

  export = PagSeguro;
}
