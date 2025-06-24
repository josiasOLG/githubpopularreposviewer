export interface Address {
  street: string;
  number: string;
  complement?: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Appointment {
  id?: string;
  idServico?: string;
  userId: string;
  barberId: string;
  date: Date;
  time: string;
  status?: string;
  statusAprovacao?: string;
  statusMensage?: string;
  service: string[];
  notes?: string;
  statusPoint?: boolean;
  repete?: string;
  allDay?: boolean;
  exceptions?: Date[];
  endRepeat?: Date;
  color?: string;
  userNumber?: string;
  userName?: string;
  userEmail?: string;
  userCpf?: string;
  userAddress?: Address;
  modality?: string;
  create?: Date;
  update?: Date;
  active?: boolean;
  manual?: boolean;
  hashuser?: string;
}
