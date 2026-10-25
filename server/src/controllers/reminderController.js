import mongoose from 'mongoose';
import { Reminder } from '../models/Reminder.js';
import { Bill } from '../models/Bill.js';
import { Notification } from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getReminders = async (req, res, next) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id })
      .populate('bill', 'providerName consumerId category dueDate amount isPaid')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 'Reminders fetched successfully', reminders);
  } catch (error) {
    next(error);
  }
};

export const saveReminder = async (req, res, next) => {
  try {
    const { billId, autoRemind = true, reminderChannels, schedule } = req.body;

    if (!mongoose.Types.ObjectId.isValid(billId)) {
      return sendError(res, 'Invalid bill identifier format.', 400);
    }

    const bill = await Bill.findOne({ _id: billId, user: req.user.id });
    if (!bill) {
      return sendError(res, 'Bill not found or access denied.', 404);
    }

    const reminder = await Reminder.findOneAndUpdate(
      { user: req.user.id, bill: bill._id },
      {
        autoRemind,
        ...(reminderChannels && { reminderChannels }),
        ...(schedule && { schedule })
      },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    // Sync bill's autoRemind and reminderChannels
    bill.autoRemind = autoRemind;
    if (reminderChannels) {
      bill.reminderChannels = reminderChannels;
    }
    await bill.save();

    return sendSuccess(res, 'Reminder preferences saved', reminder);
  } catch (error) {
    next(error);
  }
};

export const updateReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid reminder identifier format.', 400);
    }

    const reminder = await Reminder.findOne({ _id: id, user: req.user.id });
    if (!reminder) {
      return sendError(res, 'Reminder not found.', 404);
    }

    if (req.body.autoRemind !== undefined) reminder.autoRemind = req.body.autoRemind;
    if (req.body.reminderChannels) reminder.reminderChannels = req.body.reminderChannels;
    if (req.body.schedule) reminder.schedule = req.body.schedule;

    await reminder.save();

    return sendSuccess(res, 'Reminder settings updated', reminder);
  } catch (error) {
    next(error);
  }
};

export const deleteReminder = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid reminder identifier format.', 400);
    }

    const reminder = await Reminder.findOneAndDelete({ _id: id, user: req.user.id });
    if (!reminder) {
      return sendError(res, 'Reminder not found.', 404);
    }

    return sendSuccess(res, 'Reminder deleted successfully.');
  } catch (error) {
    next(error);
  }
};

export const triggerTestNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { channel = 'whatsapp' } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid reminder identifier format.', 400);
    }

    const reminder = await Reminder.findOne({ _id: id, user: req.user.id }).populate('bill');
    if (!reminder || !reminder.bill) {
      return sendError(res, 'Reminder or associated bill not found.', 404);
    }

    reminder.lastTriggeredAt = new Date();
    await reminder.save();

    // Create a real Notification entry for the test
    const notif = await Notification.create({
      user: req.user.id,
      title: `[Simulated ${channel.toUpperCase()}] Reminder: ${reminder.bill.providerName}`,
      message: `Test alert dispatched to registered number for bill of ₹${reminder.bill.amount}.`,
      type: 'info',
      read: false,
      billId: reminder.bill._id
    });

    return sendSuccess(res, `Simulated ${channel.toUpperCase()} reminder dispatched successfully`, {
      reminder,
      notification: notif,
      isSimulated: true
    });
  } catch (error) {
    next(error);
  }
};
