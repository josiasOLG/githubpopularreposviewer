import GenerateBasePDF from "./GenerateBasePDF";

// Lista de Clientes
export const generateClientsPDF = (clients: any[]) => {
  return GenerateBasePDF("Lista de Clientes", (doc) => {
    clients.forEach((client) => {
      doc
        .fontSize(12)
        .text(`Nome: ${client.name}`, { continued: true })
        .text(`Email: ${client.email}`);
      doc.text("------------------------");
    });
  });
};

// Relatório de Assinaturas
export const generateSubscriptionsPDF = (subscriptions: any[]) => {
  return GenerateBasePDF("Relatório de Assinaturas", (doc) => {
    let totalSemanal = 0;
    let totalMensal = 0;
    let totalAnual = 0;

    subscriptions.forEach((subscription) => {
      doc
        .fontSize(12)
        .text(`Nome: ${subscription.customer.name}`, { continued: true })
        .text(`Valor: ${subscription.amount.value}`);
      totalSemanal += subscription.semanal;
      totalMensal += subscription.mensal;
      totalAnual += subscription.anual;
      doc.text("------------------------");
    });

    doc
      .fontSize(14)
      .text(`Total Semanal: ${totalSemanal}`)
      .text(`Total Mensal: ${totalMensal}`)
      .text(`Total Anual: ${totalAnual}`);
  });
};

// Relatório de Agendamentos
export const generateAppointmentsPDF = (appointments: any[]) => {
  return GenerateBasePDF("Relatório de Agendamentos", (doc) => {
    appointments.forEach((appointment) => {
      doc
        .fontSize(12)
        .text(`Cliente: ${appointment.userId.name}`, { continued: true })
        .text(`Data: ${appointment.date}`)
        .text(`Horário: ${appointment.time}`)
        .text(`Status: ${appointment.status}`)
        .text(`Serviços: ${appointment.service.join(", ")}`)
        .text(`Notas: ${appointment.notes}`);
      doc.text("------------------------");
    });
  });
};

// Relatório de Disponibilidade
export const generateAvailabilityPDF = (availabilities: any[]) => {
  return GenerateBasePDF("Relatório de Disponibilidade", (doc) => {
    availabilities.forEach((availability) => {
      doc.fontSize(14).text(`Data: ${availability.date}`);
      availability.timeSlots.forEach((slot: any) => {
        doc
          .fontSize(12)
          .text(
            `Horário: ${slot.time} - Disponível: ${
              slot.available ? "Sim" : "Não"
            }`
          );
      });
      doc.text("------------------------");
    });
  });
};

// Relatório de Pontuação de Serviços
export const generateServicePointsPDF = (services: any[]) => {
  return GenerateBasePDF("Relatório de Pontuação de Serviços", (doc) => {
    services.forEach((service) => {
      doc
        .fontSize(12)
        .text(`Serviço: ${service.name}`, { continued: true })
        .text(`Pontuação: ${service.points}`);
      doc.text("------------------------");
    });
  });
};

// Relatório de Endereços dos Clientes
export const generateClientAddressesPDF = (addresses: any[]) => {
  return GenerateBasePDF("Relatório de Endereços dos Clientes", (doc) => {
    addresses.forEach((address) => {
      doc
        .fontSize(12)
        .text(`Cliente: ${address.idUser}`, { continued: true })
        .text(
          `Endereço: ${address.street}, ${address.number}, ${address.complement}, ${address.locality}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`
        )
        .text(`Telefone: ${address.phoneNumber}`);
      doc.text("------------------------");
    });
  });
};

// Relatório de Receitas
export const generateRevenueReportPDF = (revenues: any[]) => {
  return GenerateBasePDF("Relatório de Receitas", (doc) => {
    revenues.forEach((revenue) => {
      doc
        .fontSize(12)
        .text(`Período: ${revenue.period}`, { continued: true })
        .text(`Total Recebido: ${revenue.total}`);
      doc.text("------------------------");
    });
  });
};

// Relatório de Serviços Mais Vendidos
export const generateTopServicesPDF = (services: any[]) => {
  return GenerateBasePDF("Relatório de Serviços Mais Vendidos", (doc) => {
    services.forEach((service) => {
      doc
        .fontSize(12)
        .text(`Serviço: ${service.name}`, { continued: true })
        .text(`Quantidade Vendida: ${service.quantity}`)
        .text(`Total Arrecadado: ${service.total}`);
      doc.text("------------------------");
    });
  });
};

// Relatório de Despesas
export const generateExpensesPDF = (expenses: any[]) => {
  return GenerateBasePDF("Relatório de Despesas", (doc) => {
    expenses.forEach((expense) => {
      doc
        .fontSize(12)
        .text(`Tipo de Despesa: ${expense.type}`, { continued: true })
        .text(`Data: ${expense.date}`)
        .text(`Valor: ${expense.amount}`);
      doc.text("------------------------");
    });
  });
};

// Relatório de Receita por Cliente
export const generateRevenueByClientPDF = (revenues: any[]) => {
  return GenerateBasePDF("Relatório de Receita por Cliente", (doc) => {
    revenues.forEach((revenue) => {
      doc
        .fontSize(12)
        .text(`Cliente: ${revenue.clientName}`, { continued: true })
        .text(`Total Gasto: ${revenue.total}`);
      doc.text("------------------------");
    });
  });
};
