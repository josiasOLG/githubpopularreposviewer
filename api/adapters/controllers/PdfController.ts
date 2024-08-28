import { Request, Response } from "express";
import {
  generateClientsPDF,
  generateSubscriptionsPDF,
  generateAppointmentsPDF,
  generateAvailabilityPDF,
  generateServicePointsPDF,
  generateClientAddressesPDF,
  generateRevenueReportPDF,
  generateTopServicesPDF,
  generateExpensesPDF,
  generateRevenueByClientPDF,
} from "../../utils/GeneratePDFs";
import { AppointmentRepository } from "../repositories/AppointmentRepository";
import { SubscriptionRepository } from "../repositories/SubscriptionRepository";
import { BarberServiceRepository } from "../repositories/BarberServiceRepository";
import { FinancialRepository } from "../repositories/FinancialRepository";
import { AvailabilityRepository } from "../repositories/AvailabilityRepository";
import { AddressRepository } from "../repositories/AddressRepository";
import { createReadStream } from "fs";
import { promisify } from "util";
import { pipeline } from "stream";
import { join } from "path";
import { tmpdir } from "os";

const appointmentRepository = new AppointmentRepository();
const subscriptionRepository = new SubscriptionRepository();
const availabilityRepository = new AvailabilityRepository();
const barberServiceRepository = new BarberServiceRepository();
const addressRepository = new AddressRepository();
const financialRepository = new FinancialRepository();

const streamPipeline = promisify(pipeline);

const generatePDFResponse = async (doc: any, res: Response) => {
  const filePath = join(tmpdir(), `${Date.now()}.pdf`);
  const writeStream = doc.pipe(require("fs").createWriteStream(filePath));

  await new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });

  const readStream = createReadStream(filePath);
  const chunks: any[] = [];

  for await (const chunk of readStream) {
    chunks.push(chunk);
  }

  const base64 = Buffer.concat(chunks).toString("base64");
  res.json({ base64 });
};

export class PdfController {
  static async getClientsPDF(req: Request, res: Response) {
    const barberId = req.params.barberId;
    if (!barberId) {
      return res.status(400).json({ message: "Barber ID is required" });
    }
    const clients = await appointmentRepository.getClientsByBarberId(barberId);
    const doc = generateClientsPDF(clients);
    await generatePDFResponse(doc, res);
  }

  static async getSubscriptionsPDF(req: Request, res: Response) {
    const barberId = req.params.barberId;
    if (!barberId) {
      return res.status(400).json({ message: "Barber ID is required" });
    }
    const subscriptions =
      await subscriptionRepository.getAllSubscriptionsByBarberId(barberId);
    const doc = generateSubscriptionsPDF(subscriptions);
    await generatePDFResponse(doc, res);
  }

  static async getAppointmentsPDF(req: Request, res: Response) {
    const barberId = req.params.barberId;
    if (!barberId) {
      return res.status(400).json({ message: "Barber ID is required" });
    }
    const appointments =
      await appointmentRepository.getAllAppointmentsByBarberId(barberId);
    const doc = generateAppointmentsPDF(appointments);
    await generatePDFResponse(doc, res);
  }

  static async getAvailabilityPDF(req: Request, res: Response) {
    const barberId = req.params.barberId;
    if (!barberId) {
      return res.status(400).json({ message: "Barber ID is required" });
    }
    const availabilities =
      await availabilityRepository.getAllAvailabilityByBarberId(barberId);
    const doc = generateAvailabilityPDF(availabilities);
    await generatePDFResponse(doc, res);
  }

  static async getServicePointsPDF(req: Request, res: Response) {
    const barberId = req.params.barberId;
    if (!barberId) {
      return res.status(400).json({ message: "Barber ID is required" });
    }
    const services = await barberServiceRepository.getAllServicesByBarberId(
      barberId
    );
    const doc = generateServicePointsPDF(services);
    await generatePDFResponse(doc, res);
  }

  static async getClientAddressesPDF(req: Request, res: Response) {
    const barberId = req.params.barberId;
    if (!barberId) {
      return res.status(400).json({ message: "Barber ID is required" });
    }
    const addresses = await addressRepository.getAllAddressesByBarberId(
      barberId
    );
    const doc = generateClientAddressesPDF(addresses);
    await generatePDFResponse(doc, res);
  }

  static async getRevenueReportPDF(req: Request, res: Response) {
    const barberId = req.params.barberId;
    if (!barberId) {
      return res.status(400).json({ message: "Barber ID is required" });
    }
    const revenues = await financialRepository.getRevenueByBarberId(barberId);
    const doc = generateRevenueReportPDF(revenues);
    await generatePDFResponse(doc, res);
  }

  static async getTopServicesPDF(req: Request, res: Response) {
    const barberId = req.params.barberId;
    if (!barberId) {
      return res.status(400).json({ message: "Barber ID is required" });
    }
    const services = await financialRepository.getTopServicesByBarberId(
      barberId
    );
    const doc = generateTopServicesPDF(services);
    await generatePDFResponse(doc, res);
  }

  static async getExpensesPDF(req: Request, res: Response) {
    const barberId = req.params.barberId;
    if (!barberId) {
      return res.status(400).json({ message: "Barber ID is required" });
    }
    const expenses = await financialRepository.getExpensesByBarberId(barberId);
    const doc = generateExpensesPDF(expenses);
    await generatePDFResponse(doc, res);
  }

  static async getRevenueByClientPDF(req: Request, res: Response) {
    const barberId = req.params.barberId;
    if (!barberId) {
      return res.status(400).json({ message: "Barber ID is required" });
    }
    const revenues = await financialRepository.getRevenueByClientByBarberId(
      barberId
    );
    const doc = generateRevenueByClientPDF(revenues);
    await generatePDFResponse(doc, res);
  }
}
