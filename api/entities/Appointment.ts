export interface Appointment {
  id?: string;
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
}
