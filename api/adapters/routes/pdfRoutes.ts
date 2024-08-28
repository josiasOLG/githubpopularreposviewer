import { Router } from "express";
import { PdfController } from "../controllers/PdfController";

const router = Router();

router.get("/clients/:barberId", PdfController.getClientsPDF);
router.get("/subscriptions/:barberId", PdfController.getSubscriptionsPDF);
router.get("/appointments/:barberId", PdfController.getAppointmentsPDF);
router.get("/availability/:barberId", PdfController.getAvailabilityPDF);
router.get("/service-points/:barberId", PdfController.getServicePointsPDF);
router.get("/client-addresses/:barberId", PdfController.getClientAddressesPDF);
router.get("/revenue-report/:barberId", PdfController.getRevenueReportPDF);
router.get("/top-services/:barberId", PdfController.getTopServicesPDF);
router.get("/expenses/:barberId", PdfController.getExpensesPDF);
router.get("/revenue-by-client/:barberId", PdfController.getRevenueByClientPDF);

export default router;
