import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    bill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bill',
      required: true,
      index: true
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: [0, 'Payment amount must be greater than zero']
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['UPI', 'CARD', 'NETBANKING', 'DEMO_BBPS'],
      default: 'UPI'
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'],
      default: 'COMPLETED'
    },
    providerName: {
      type: String,
      default: ''
    },
    consumerId: {
      type: String,
      default: ''
    },
    category: {
      type: String,
      default: 'Utilities'
    },
    paymentDetails: {
      upiApp: { type: String, default: '' },
      cardLast4: { type: String, default: '' },
      bankName: { type: String, default: '' },
      isSimulated: { type: Boolean, default: true }
    },
    paidAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      }
    }
  }
);

paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ bill: 1, transactionId: 1 });

export const Payment = mongoose.model('Payment', paymentSchema);
