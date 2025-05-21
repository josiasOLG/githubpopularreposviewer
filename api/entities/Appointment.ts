export interface Appointment {
  id?: string;
  idServico?: string;
  userId: string;
  barberId: string;
  date: Date;
  time: string;
  status: string;
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
  modality?: string;
  create?: Date;
  update?: Date;
}
