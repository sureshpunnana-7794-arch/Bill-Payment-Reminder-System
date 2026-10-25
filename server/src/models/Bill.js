import mongoose from 'mongoose';

const billSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    providerName: {
      type: String,
      required: [true, 'Provider name is required'],
      trim: true
    },
    nickname: {
      type: String,
      trim: true,
      default: ''
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
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
      ],
      default: 'Utilities'
    },
    consumerId: {
      type: String,
      required: [true, 'Consumer / Account ID is required'],
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative']
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required']
    },
    isPaid: {
      type: Boolean,
      default: false,
      index: true
    },
    paidAt: {
      type: Date,
      default: null
    },
    paymentRef: {
      type: String,
      default: null
    },
    autoRemind: {
      type: Boolean,
      default: true
    },
    reminderChannels: {
      whatsapp: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    lateFee: {
      type: Number,
      default: 0,
      min: 0
    },
    billingPeriod: {
      type: String,
      default: 'Current Cycle'
    },
    notes: {
      type: String,
      default: ''
    },
    linkedPhone: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        // Return id string alongside _id for frontend compatibility
        ret.id = ret._id.toString();
        // Format dueDate to YYYY-MM-DD string for seamless UI interop
        if (ret.dueDate instanceof Date) {
          ret.dueDate = ret.dueDate.toISOString().split('T')[0];
        }
        return ret;
      }
    }
  }
);

// Compound indexes for high-speed dashboard analytics and bill retrieval
billSchema.index({ user: 1, dueDate: 1, isPaid: 1 });
billSchema.index({ user: 1, category: 1 });
billSchema.index({ user: 1, isPaid: 1 });

export const Bill = mongoose.model('Bill', billSchema);
