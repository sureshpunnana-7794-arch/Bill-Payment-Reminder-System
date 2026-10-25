import mongoose from 'mongoose';
import { Bill } from '../models/Bill.js';
import { Reminder } from '../models/Reminder.js';
import { Notification } from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { VALID_CATEGORIES } from '../utils/validators.js';

export const getBills = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      search,
      category,
      status, // 'paid' | 'pending' | 'urgent'
      year,
      month,
      page = 1,
      limit = 100,
      sort = 'dueDate'
    } = req.query;

    const query = { user: userId };

    // Search filter
    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { providerName: regex },
        { nickname: regex },
        { consumerId: regex }
      ];
    }

    // Category filter
    if (category && category !== 'all') {
      query.category = category;
    }

    // Status filter
    if (status === 'paid') {
      query.isPaid = true;
    } else if (status === 'pending') {
      query.isPaid = false;
    } else if (status === 'urgent') {
      query.isPaid = false;
      const threeDaysAhead = new Date();
      threeDaysAhead.setDate(threeDaysAhead.getDate() + 3);
      query.dueDate = { $lte: threeDaysAhead };
    }

    // Month & Year filter
    if (year !== undefined && month !== undefined) {
      const y = parseInt(year, 10);
      const m = parseInt(month, 10);
      const startOfMonth = new Date(Date.UTC(y, m, 1, 0, 0, 0));
      const endOfMonth = new Date(Date.UTC(y, m + 1, 0, 23, 59, 59, 999));
      query.dueDate = { $gte: startOfMonth, $lte: endOfMonth };
    }

    const sortOption = {};
    if (sort === 'dueDate') sortOption.dueDate = 1;
    else if (sort === 'dueDateDesc') sortOption.dueDate = -1;
    else if (sort === 'amountDesc') sortOption.amount = -1;
    else if (sort === 'amountAsc') sortOption.amount = 1;
    else sortOption.createdAt = -1;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const [bills, totalCount] = await Promise.all([
      Bill.find(query).sort(sortOption).skip(skip).limit(take),
      Bill.countDocuments(query)
    ]);

    return sendSuccess(res, 'Bills retrieved successfully', {
      bills,
      pagination: {
        total: totalCount,
        page: parseInt(page, 10),
        limit: take,
        pages: Math.ceil(totalCount / take)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getBillById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid bill identifier format.', 400);
    }

    const bill = await Bill.findOne({ _id: id, user: req.user.id });
    if (!bill) {
      return sendError(res, 'Bill not found or access denied.', 404);
    }

    return sendSuccess(res, 'Bill details fetched', bill);
  } catch (error) {
    next(error);
  }
};

export const createBill = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const {
      providerName,
      nickname,
      category,
      consumerId,
      amount,
      dueDate,
      autoRemind = true,
      reminderChannels = { whatsapp: true, sms: true, push: true },
      lateFee = 0,
      billingPeriod = 'Current Cycle',
      notes = '',
      linkedPhone = ''
    } = req.body;

    const bill = new Bill({
      user: userId,
      providerName,
      nickname: nickname || providerName,
      category,
      consumerId,
      amount,
      dueDate: new Date(dueDate),
      isPaid: false,
      autoRemind,
      reminderChannels,
      lateFee,
      billingPeriod,
      notes,
      linkedPhone: linkedPhone || req.user.phone
    });

    await bill.save();

    // Create associated Reminder record
    await Reminder.create({
      user: userId,
      bill: bill._id,
      autoRemind,
      reminderChannels,
      schedule: {
        sevenDays: true,
        threeDays: true,
        oneDay: true,
        dueDay: true
      }
    });

    // Record creation activity in Notification feed
    await Notification.create({
      user: userId,
      title: `New Bill Linked: ${bill.providerName}`,
      message: `Bill of ₹${bill.amount.toLocaleString('en-IN')} connected to ${bill.linkedPhone || 'account'}. Proactive reminders enabled.`,
      type: 'info',
      read: false,
      billId: bill._id
    });

    return sendSuccess(res, 'Bill added and reminder scheduled successfully', bill, 201);
  } catch (error) {
    next(error);
  }
};

export const updateBill = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid bill identifier format.', 400);
    }

    const bill = await Bill.findOne({ _id: id, user: req.user.id });
    if (!bill) {
      return sendError(res, 'Bill not found or access denied.', 404);
    }

    const fieldsToUpdate = [
      'providerName',
      'nickname',
      'category',
      'consumerId',
      'amount',
      'dueDate',
      'autoRemind',
      'reminderChannels',
      'lateFee',
      'billingPeriod',
      'notes'
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'dueDate') {
          bill.dueDate = new Date(req.body.dueDate);
        } else {
          bill[field] = req.body[field];
        }
      }
    });

    await bill.save();

    // If autoRemind or reminderChannels were updated, sync Reminder model
    if (req.body.autoRemind !== undefined || req.body.reminderChannels !== undefined) {
      await Reminder.findOneAndUpdate(
        { user: req.user.id, bill: bill._id },
        {
          ...(req.body.autoRemind !== undefined && { autoRemind: req.body.autoRemind }),
          ...(req.body.reminderChannels !== undefined && { reminderChannels: req.body.reminderChannels })
        },
        { upsert: true }
      );
    }

    return sendSuccess(res, 'Bill updated successfully', bill);
  } catch (error) {
    next(error);
  }
};

export const updateBillStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isPaid } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid bill identifier format.', 400);
    }

    const bill = await Bill.findOne({ _id: id, user: req.user.id });
    if (!bill) {
      return sendError(res, 'Bill not found or access denied.', 404);
    }

    bill.isPaid = isPaid;
    if (isPaid) {
      bill.paidAt = new Date();
      bill.paymentRef = `BBPS-PAY-${Math.floor(100000000 + Math.random() * 900000000)}`;
    } else {
      bill.paidAt = null;
      bill.paymentRef = null;
    }

    await bill.save();

    // Log notification
    await Notification.create({
      user: req.user.id,
      title: isPaid ? `Bill Marked as Paid: ${bill.providerName}` : `Bill Reopened: ${bill.providerName}`,
      message: isPaid
        ? `₹${bill.amount.toLocaleString('en-IN')} marked as paid. Excluded from pending monthly dues.`
        : `₹${bill.amount.toLocaleString('en-IN')} marked as pending. Added back to monthly obligations.`,
      type: isPaid ? 'success' : 'info',
      read: false,
      billId: bill._id
    });

    return sendSuccess(res, isPaid ? 'Bill marked as paid' : 'Bill marked as pending', bill);
  } catch (error) {
    next(error);
  }
};

export const deleteBill = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid bill identifier format.', 400);
    }

    const bill = await Bill.findOneAndDelete({ _id: id, user: req.user.id });
    if (!bill) {
      return sendError(res, 'Bill not found or access denied.', 404);
    }

    // Clean up associated reminders
    await Reminder.deleteMany({ bill: bill._id });

    return sendSuccess(res, `Bill "${bill.providerName}" removed from your account.`);
  } catch (error) {
    next(error);
  }
};

export const getBillSummary = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const now = new Date();
    const currentYear = parseInt(req.query.year || now.getFullYear(), 10);
    const currentMonth = parseInt(req.query.month !== undefined ? req.query.month : now.getMonth(), 10);

    const startOfMonth = new Date(Date.UTC(currentYear, currentMonth, 1, 0, 0, 0));
    const endOfMonth = new Date(Date.UTC(currentYear, currentMonth + 1, 0, 23, 59, 59, 999));

    const todayStart = new Date(now);
    todayStart.setUTCHours(0, 0, 0, 0);

    const todayEnd = new Date(now);
    todayEnd.setUTCHours(23, 59, 59, 999);

    const inThreeDays = new Date(now);
    inThreeDays.setUTCDate(inThreeDays.getUTCDate() + 3);
    inThreeDays.setUTCHours(23, 59, 59, 999);

    const [
      allTimeStats,
      monthlyBills,
      urgentStats,
      categoryStats
    ] = await Promise.all([
      // Overall stats across all user bills
      Bill.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: null,
            totalBills: { $sum: 1 },
            unpaidCount: { $sum: { $cond: [{ $eq: ['$isPaid', false] }, 1, 0] } },
            paidCount: { $sum: { $cond: [{ $eq: ['$isPaid', true] }, 1, 0] } },
            totalUnpaidAmount: { $sum: { $cond: [{ $eq: ['$isPaid', false] }, '$amount', 0] } },
            totalPaidAmount: { $sum: { $cond: [{ $eq: ['$isPaid', true] }, '$amount', 0] } }
          }
        }
      ]),

      // Selected month bills
      Bill.find({
        user: userId,
        dueDate: { $gte: startOfMonth, $lte: endOfMonth }
      }),

      // Urgent counts (overdue, due today, due soon)
      Bill.aggregate([
        { $match: { user: userId, isPaid: false } },
        {
          $group: {
            _id: null,
            overdueCount: { $sum: { $cond: [{ $lt: ['$dueDate', todayStart] }, 1, 0] } },
            dueTodayCount: {
              $sum: {
                $cond: [
                  { $and: [{ $gte: ['$dueDate', todayStart] }, { $lte: ['$dueDate', todayEnd] }] },
                  1,
                  0
                ]
              }
            },
            dueSoonCount: {
              $sum: {
                $cond: [
                  { $and: [{ $gt: ['$dueDate', todayEnd] }, { $lte: ['$dueDate', inThreeDays] }] },
                  1,
                  0
                ]
              }
            }
          }
        }
      ]),

      // Category breakdown
      Bill.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            unpaidAmount: { $sum: { $cond: [{ $eq: ['$isPaid', false] }, '$amount', 0] } },
            paidAmount: { $sum: { $cond: [{ $eq: ['$isPaid', true] }, '$amount', 0] } }
          }
        },
        { $sort: { totalAmount: -1 } }
      ])
    ]);

    // Calculate monthly summary
    const monthlyUnpaid = monthlyBills.filter((b) => !b.isPaid);
    const monthlyPaid = monthlyBills.filter((b) => b.isPaid);
    const monthlyTotalDue = monthlyUnpaid.reduce((sum, b) => sum + b.amount, 0);
    const monthlyTotalPaid = monthlyPaid.reduce((sum, b) => sum + b.amount, 0);

    const overall = allTimeStats[0] || {
      totalBills: 0,
      unpaidCount: 0,
      paidCount: 0,
      totalUnpaidAmount: 0,
      totalPaidAmount: 0
    };

    const urgent = urgentStats[0] || {
      overdueCount: 0,
      dueTodayCount: 0,
      dueSoonCount: 0
    };

    return sendSuccess(res, 'Dashboard summary calculated successfully', {
      selectedPeriod: {
        year: currentYear,
        month: currentMonth,
        totalBills: monthlyBills.length,
        unpaidCount: monthlyUnpaid.length,
        paidCount: monthlyPaid.length,
        totalDue: monthlyTotalDue,
        totalPaid: monthlyTotalPaid
      },
      allTime: {
        totalBills: overall.totalBills,
        unpaidCount: overall.unpaidCount,
        paidCount: overall.paidCount,
        totalUnpaidAmount: overall.totalUnpaidAmount,
        totalPaidAmount: overall.totalPaidAmount
      },
      urgency: {
        overdueCount: urgent.overdueCount,
        dueTodayCount: urgent.dueTodayCount,
        dueSoonCount: urgent.dueSoonCount,
        totalUrgent: urgent.overdueCount + urgent.dueTodayCount + urgent.dueSoonCount
      },
      categories: categoryStats.map((c) => ({
        category: c._id,
        count: c.count,
        totalAmount: c.totalAmount,
        unpaidAmount: c.unpaidAmount,
        paidAmount: c.paidAmount
      }))
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = (req, res) => {
  return sendSuccess(res, 'Categories retrieved', {
    categories: VALID_CATEGORIES
  });
};
