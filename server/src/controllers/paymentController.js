import mongoose from 'mongoose';
import { Payment } from '../models/Payment.js';
import { Bill } from '../models/Bill.js';
import { Notification } from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const createPayment = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { billId, amount, paymentMethod = 'UPI', transactionId, paymentDetails = {} } = req.body;

    if (!mongoose.Types.ObjectId.isValid(billId)) {
      return sendError(res, 'Invalid bill identifier format.', 400);
    }

    const bill = await Bill.findOne({ _id: billId, user: userId });
    if (!bill) {
      return sendError(res, 'Bill not found or access denied.', 404);
    }

    if (bill.isPaid) {
      return sendError(res, 'This bill has already been paid and marked as settled.', 400);
    }

    const finalAmount = amount || bill.amount;
    const txnId = transactionId || `TXN-PAY-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create Payment record
    const payment = new Payment({
      user: userId,
      bill: bill._id,
      transactionId: txnId,
      amount: finalAmount,
      paymentMethod,
      status: 'COMPLETED',
      providerName: bill.providerName,
      consumerId: bill.consumerId,
      category: bill.category,
      paymentDetails: {
        ...paymentDetails,
        isSimulated: true
      },
      paidAt: new Date()
    });

    await payment.save();

    // Update Bill
    bill.isPaid = true;
    bill.paidAt = payment.paidAt;
    bill.paymentRef = txnId;
    await bill.save();

    // Create Notification
    await Notification.create({
      user: userId,
      title: `Payment Successful: ${bill.providerName}`,
      message: `Payment of ₹${finalAmount.toLocaleString('en-IN')} authorized via ${paymentMethod}. Transaction ID: ${txnId}.`,
      type: 'success',
      read: false,
      billId: bill._id
    });

    return sendSuccess(res, 'Payment authorized and settled successfully', {
      payment,
      bill
    }, 201);
  } catch (error) {
    next(error);
  }
};

export const getPayments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 50 } = req.query;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    const take = parseInt(limit, 10);

    const [payments, total] = await Promise.all([
      Payment.find({ user: userId })
        .populate('bill', 'providerName consumerId category dueDate')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take),
      Payment.countDocuments({ user: userId })
    ]);

    return sendSuccess(res, 'Payment history retrieved', {
      payments,
      pagination: {
        total,
        page: parseInt(page, 10),
        limit: take,
        pages: Math.ceil(total / take)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid payment identifier format.', 400);
    }

    const payment = await Payment.findOne({ _id: id, user: req.user.id }).populate('bill');
    if (!payment) {
      return sendError(res, 'Payment record not found.', 404);
    }

    return sendSuccess(res, 'Payment record fetched', payment);
  } catch (error) {
    next(error);
  }
};

export const getReceipt = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid payment identifier format.', 400);
    }

    const payment = await Payment.findOne({ _id: id, user: req.user.id }).populate('bill');
    if (!payment) {
      return sendError(res, 'Receipt not found for this transaction.', 404);
    }

    const receipt = {
      receiptNumber: `RCPT-${payment.transactionId.replace(/\D/g, '').slice(-8)}`,
      transactionId: payment.transactionId,
      billId: payment.bill?._id,
      providerName: payment.providerName || payment.bill?.providerName,
      consumerId: payment.consumerId || payment.bill?.consumerId,
      category: payment.category || payment.bill?.category,
      amount: payment.amount,
      convenienceFee: 0,
      totalPaid: payment.amount,
      paymentMethod: payment.paymentMethod,
      paymentStatus: payment.status,
      paidAt: payment.paidAt,
      isBbpsCertified: true,
      timestamp: new Date().toISOString()
    };

    return sendSuccess(res, 'Official E-Receipt generated', receipt);
  } catch (error) {
    next(error);
  }
};

export const getBillPayments = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 'Invalid bill identifier format.', 400);
    }

    const payments = await Payment.find({ bill: id, user: req.user.id }).sort({ createdAt: -1 });
    return sendSuccess(res, 'Bill payment history retrieved', payments);
  } catch (error) {
    next(error);
  }
};
