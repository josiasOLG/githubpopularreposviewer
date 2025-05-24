import { Router } from 'express';
import {
  createAddressController,
  createAddressFromCepController,
  createOrUpdateAddressController,
  deleteAddressController,
  fetchAddressByCepController,
  getAddressByIdController,
  updateAddressController,
} from '../controllers/AddressController';

const router = Router();

router.post('/', createAddressController);
router.get('/:id', getAddressByIdController);
router.get('/cep/:cep', fetchAddressByCepController);
router.post('/cep/:cep', createAddressFromCepController);
router.put('/:id', updateAddressController);
router.put('/create-or-update/:id', createOrUpdateAddressController);
router.delete('/:id', deleteAddressController);

export default router;
