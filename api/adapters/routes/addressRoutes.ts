import { Router } from "express";
import {
  createAddressController,
  getAddressByIdController,
  updateAddressController,
  deleteAddressController,
  createOrUpdateAddressController,
  fetchAddressByCepController,
} from "../controllers/AddressController";

const router = Router();

router.post("/", createAddressController);
router.get("/:id", getAddressByIdController);
router.get("/cep/:cep", fetchAddressByCepController);
router.put("/:id", updateAddressController);
router.put("/create-or-update/:id", createOrUpdateAddressController);
router.delete("/:id", deleteAddressController);

export default router;
