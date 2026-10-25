import { Router } from 'express';
import {
  getBills,
  getBillById,
  createBill,
  updateBill,
  updateBillStatus,
  deleteBill,
  getBillSummary,
  getCategories
} from '../controllers/billController.js';
import { getBillPayments } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createBillSchema,
  updateBillSchema,
  updateBillStatusSchema
} from '../utils/validators.js';

const router = Router();

// Public metadata route
router.get('/categories', getCategories);

// All bill management operations require authentication
router.use(authenticate);

router.get('/summary', getBillSummary);
router.get('/', getBills);
router.post('/', validate(createBillSchema), createBill);
router.get('/:id', getBillById);
router.patch('/:id', validate(updateBillSchema), updateBill);
router.patch('/:id/status', validate(updateBillStatusSchema), updateBillStatus);
router.delete('/:id', deleteBill);
router.get('/:id/payments', getBillPayments);

export default router;
