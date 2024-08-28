export interface ISubscriptions {
  userId: string;
  idPagseguro: string;
  reference_id: string;
  amount: {
    value: number;
    currency: string;
  };
  status: string;
  plan: {
    id: string;
    name: string;
  };
  payment_method: {
    type: string;
    card: {
      brand: string;
      first_digits: string;
      last_digits: string;
      exp_month: string;
      exp_year: string;
      holder: {
        name: string;
      };
    };
  }[];
  next_invoice_at: string;
  pro_rata: boolean;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  created_at: string;
  updated_at: string;
  links: {
    rel: string;
    href: string;
    media: string;
    type: string;
  }[];
}
