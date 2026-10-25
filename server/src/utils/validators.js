import { z } from 'zod';

export const VALID_CATEGORIES = [
  'Electricity',
  'Mobile',
  'Broadband',
  'CreditCard',
  'Water',
  'PipedGas',
  'DTH',
  'Rent',
  'Insurance',
  'Subscriptions',
  'Utilities',
  'Other'
];

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().trim().email('Invalid email address format').toLowerCase(),
  phone: z.string().trim().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  planType: z.enum(['Standard Account', 'Premium Family Member', 'Enterprise Pro']).optional(),
  avatar: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address format').toLowerCase(),
  password: z.string().min(1, 'Password is required')
});

export const updateMeSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  phone: z.string().trim().min(10).optional(),
  avatar: z.string().optional()
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters')
});

export const createBillSchema = z.object({
  providerName: z.string().trim().min(1, 'Provider name is required'),
  nickname: z.string().trim().optional(),
  category: z.enum(VALID_CATEGORIES, {
    errorMap: () => ({ message: 'Unsupported category selected' })
  }).default('Utilities'),
  consumerId: z.string().trim().min(1, 'Consumer / Account ID is required'),
  amount: z.coerce.number().positive('Amount must be greater than zero'),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Valid due date format (YYYY-MM-DD) is required'
  }),
  autoRemind: z.boolean().optional().default(true),
  reminderChannels: z.object({
    whatsapp: z.boolean().optional().default(true),
    sms: z.boolean().optional().default(true),
    push: z.boolean().optional().default(true)
  }).optional(),
  lateFee: z.coerce.number().min(0).optional().default(0),
  billingPeriod: z.string().optional().default('Current Cycle'),
  notes: z.string().optional().default(''),
  linkedPhone: z.string().optional().default('')
});

export const updateBillSchema = z.object({
  providerName: z.string().trim().min(1).optional(),
  nickname: z.string().trim().optional(),
  category: z.enum(VALID_CATEGORIES).optional(),
  consumerId: z.string().trim().min(1).optional(),
  amount: z.coerce.number().positive().optional(),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val))).optional(),
  autoRemind: z.boolean().optional(),
  reminderChannels: z.object({
    whatsapp: z.boolean().optional(),
    sms: z.boolean().optional(),
    push: z.boolean().optional()
  }).optional(),
  lateFee: z.coerce.number().min(0).optional(),
  billingPeriod: z.string().optional(),
  notes: z.string().optional()
});

export const updateBillStatusSchema = z.object({
  isPaid: z.boolean({ required_error: 'isPaid status flag is required' })
});

export const createPaymentSchema = z.object({
  billId: z.string().min(1, 'Target bill ID is required'),
  amount: z.coerce.number().positive('Payment amount must be greater than zero').optional(),
  paymentMethod: z.enum(['UPI', 'CARD', 'NETBANKING', 'DEMO_BBPS']).default('UPI'),
  transactionId: z.string().optional(),
  paymentDetails: z.object({
    upiApp: z.string().optional(),
    cardLast4: z.string().optional(),
    bankName: z.string().optional(),
    isSimulated: z.boolean().optional().default(true)
  }).optional()
});

export const saveReminderSchema = z.object({
  billId: z.string().min(1, 'Target bill ID is required').optional(),
  autoRemind: z.boolean().optional().default(true),
  reminderChannels: z.object({
    whatsapp: z.boolean().optional().default(true),
    sms: z.boolean().optional().default(true),
    push: z.boolean().optional().default(true)
  }).optional(),
  schedule: z.object({
    sevenDays: z.boolean().optional().default(true),
    threeDays: z.boolean().optional().default(true),
    oneDay: z.boolean().optional().default(true),
    dueDay: z.boolean().optional().default(true)
  }).optional()
});
