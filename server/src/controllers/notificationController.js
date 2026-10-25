import mongoose from 'mongoose';
import { Notification } from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    return sendSuccess(res, 'Notifications fetched successfully', notifications);
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid notification identifier format.', 400);
    }

    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { read: true },
      { returnDocument: 'after' }
    );

    if (!notification) {
      return sendError(res, 'Notification not found.', 404);
    }

    return sendSuccess(res, 'Notification marked as read', notification);
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user.id, read: false }, { read: true });
    return sendSuccess(res, 'All notifications marked as read.');
  } catch (error) {
    next(error);
  }
};

export const clearAllNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({ user: req.user.id });
    return sendSuccess(res, 'Notification feed cleared.');
  } catch (error) {
    next(error);
  }
};
