import {
  ISubscription,
  SubscriptionModel,
} from "../../frameworks/orm/models/Subscription";
import { Appointment as AppointmentModel } from "../../frameworks/orm/models/Appointment";

export class FinancialRepository {
  async getRevenueByBarberId(barberId: string): Promise<any[]> {
    const subscriptions = await SubscriptionModel.find({ barberId }).exec();
    const revenues = subscriptions.map((subscription) => ({
      period: `${subscription.created_at} - ${subscription.next_invoice_at}`,
      total: subscription.amount.value,
    }));
    return revenues;
  }

  async getTopServicesByBarberId(barberId: string): Promise<any[]> {
    const appointments = await AppointmentModel.find({ barberId }).exec();
    const serviceCount: { [key: string]: { quantity: number; total: number } } =
      {};

    appointments.forEach((appointment: any) => {
      appointment.service.forEach((service: any) => {
        if (!serviceCount[service]) {
          serviceCount[service] = { quantity: 0, total: 0 };
        }
        serviceCount[service].quantity++;
        serviceCount[service].total += appointment.statusPoint ? 1 : 0; // Assume que statusPoint indica se o serviço foi pago
      });
    });

    return Object.keys(serviceCount).map((service) => ({
      name: service,
      quantity: serviceCount[service].quantity,
      total: serviceCount[service].total,
    }));
  }

  async getExpensesByBarberId(barberId: string): Promise<any[]> {
    // Exemplo de como buscar despesas, caso tenha uma coleção de despesas
    // const expenses = await ExpenseModel.find({ barberId }).exec();
    // return expenses.map(expense => ({
    //   type: expense.type,
    //   date: expense.date,
    //   amount: expense.amount
    // }));
    return []; // Retornar vazio caso não tenha implementação
  }

  async getRevenueByClientByBarberId(barberId: string): Promise<any[]> {
    const appointments = await AppointmentModel.find({ barberId })
      .populate("userId")
      .exec();
    const clientRevenue: {
      [key: string]: { clientName: string; total: number };
    } = {};

    appointments.forEach((appointment: any) => {
      const clientName = appointment.userId.name;
      if (!clientRevenue[clientName]) {
        clientRevenue[clientName] = { clientName, total: 0 };
      }
      clientRevenue[clientName].total += appointment.statusPoint ? 1 : 0; // Assume que statusPoint indica se o serviço foi pago
    });

    return Object.keys(clientRevenue).map((clientName) => ({
      clientName,
      total: clientRevenue[clientName].total,
    }));
  }
}
