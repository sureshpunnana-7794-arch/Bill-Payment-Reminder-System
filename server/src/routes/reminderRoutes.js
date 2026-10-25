import { Router } from 'express';
import {
  getReminders,
  saveReminder,
  updateReminder,
  deleteReminder,
  triggerTestNotification
} from '../controllers/reminderController.js';
import { authenticate } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { saveReminderSchema } from '../utils/validators.js';

const router = Router();

router.use(authenticate);

router.get('/', getReminders);
router.post('/', validate(saveReminderSchema), saveReminder);
router.patch('/:id', validate(saveReminderSchema), updateReminder);
router.delete('/:id', deleteReminder);
router.post('/:id/test', triggerTestNotification);

export default router;
