import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema(
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
    autoRemind: {
      type: Boolean,
      default: true
    },
    reminderChannels: {
      whatsapp: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    schedule: {
      sevenDays: { type: Boolean, default: true },
      threeDays: { type: Boolean, default: true },
      oneDay: { type: Boolean, default: true },
      dueDay: { type: Boolean, default: true }
    },
    lastTriggeredAt: {
      type: Date,
      default: null
    },
    nextTriggerDate: {
      type: Date,
      default: null
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

reminderSchema.index({ user: 1, bill: 1 }, { unique: true });

export const Reminder = mongoose.model('Reminder', reminderSchema);
