import { Router } from 'express';
import {
  createPayment,
  getPayments,
  getPaymentById,
  getReceipt
} from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { createPaymentSchema } from '../utils/validators.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createPaymentSchema), createPayment);
router.get('/', getPayments);
router.get('/:id', getPaymentById);
router.get('/:id/receipt', getReceipt);

export default router;
