import { Router } from "express";
import {
  createPlans,
  subscribe,
  cancel,
  listPlans,
  listCardTokens,
  getCardTokenController,
  getSubscriptionStatus,
  activateSubscriptionStatus,
  cancelSubscriptionStatus,
  getCustomersController,
  updateCustomerData,
  listInvoices,
  renewSubscription,
  updateBillingInfoController,
} from "../controllers/SubscriptionController";

const router = Router();

router.post("/create-plan", createPlans);
router.post("/get-card-token", getCardTokenController);
router.post("/subscribe", subscribe);
router.get("/plans", listPlans); // Nova rota para listar os planos
router.get("/cards/:id", listCardTokens);
router.get("/status/:userId", getSubscriptionStatus);
router.put("/activate/:userId", activateSubscriptionStatus);
router.put("/cancel", cancelSubscriptionStatus);
router.post("/customers", getCustomersController);
router.post("/customers/update", updateCustomerData);
router.post("/renewSubscription", renewSubscription);
router.get("/list/invoices/:subscriptionId", listInvoices);
router.put("/atualizar/cartao", updateBillingInfoController);

export default router;
