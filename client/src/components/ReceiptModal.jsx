import React from 'react';
import {
  CheckCircle2,
  Printer,
  Download,
  Share2,
  X,
  ShieldCheck,
  Building,
  Calendar,
  Smartphone,
  Receipt
} from 'lucide-react';
import { formatCurrency, formatDate } from '../utils/helpers';
import { CategoryIcon } from './CategoryIcon';

export const ReceiptModal = ({
  isOpen,
  onClose,
  bill,
  connectedPhone
}) => {
  if (!isOpen || !bill) return null;

  const handlePrint = () => {
    window.print();
  };

  const txnId = bill.paymentRef || bill.paymentDetails?.transactionId || `TXN-PAY-${Math.floor(100000000 + Math.random() * 900000000)}`;
  const paidDate = bill.paidAt || bill.paymentDetails?.paidAt || new Date().toISOString();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn print:p-0 print:bg-white">
      <div 
        className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden print:border-none print:shadow-none print:text-black print:bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none print:hidden" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header */}
        <div className="p-6 text-center border-b border-slate-800 print:border-slate-300">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white print:text-black tracking-tight">Payment Successful</h3>
          <p className="text-xs text-slate-400 print:text-slate-600 mt-1">Official BBPS E-Receipt & Tax Invoice</p>
          <div className="mt-3 text-2xl font-extrabold text-emerald-400 font-mono">
            {formatCurrency(bill.amount)}
          </div>
        </div>

        {/* Invoice Meta Grid */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <div>
              <div className="text-slate-400 print:text-slate-600 uppercase text-[10px] font-semibold">Transaction ID</div>
              <div className="font-mono text-slate-200 print:text-black font-semibold truncate" title={txnId}>
                {txnId}
              </div>
            </div>
            <div>
              <div className="text-slate-400 print:text-slate-600 uppercase text-[10px] font-semibold">Payment Date</div>
              <div className="text-slate-200 print:text-black font-semibold">
                {formatDate(paidDate)}
              </div>
            </div>
            <div>
              <div className="text-slate-400 print:text-slate-600 uppercase text-[10px] font-semibold">Billed Mobile</div>
              <div className="font-mono text-slate-200 print:text-black font-semibold">
                {connectedPhone?.formatted || connectedPhone?.phone}
              </div>
            </div>
            <div>
              <div className="text-slate-400 print:text-slate-600 uppercase text-[10px] font-semibold">Status</div>
              <div className="text-emerald-400 font-semibold flex items-center gap-1">
                <span>Completed</span>
              </div>
            </div>
          </div>

          {/* Provider details */}
          <div className="space-y-2 border-t border-slate-800 print:border-slate-300 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Utility Provider:</span>
              <span className="font-semibold text-white print:text-black">{bill.providerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Category:</span>
              <span className="font-semibold text-white print:text-black">{bill.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Consumer Account No:</span>
              <span className="font-mono font-semibold text-white print:text-black">{bill.consumerId}</span>
            </div>
            {bill.billingPeriod && (
              <div className="flex justify-between">
                <span className="text-slate-400 print:text-slate-600">Billing Period:</span>
                <span className="text-slate-300 print:text-black">{bill.billingPeriod}</span>
              </div>
            )}
          </div>

          {/* Amount Breakdown */}
          <div className="border-t border-slate-800 print:border-slate-300 pt-3 space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400 print:text-slate-600">Bill Principal:</span>
              <span className="font-mono text-slate-200 print:text-black">{formatCurrency(bill.amount)}</span>
            </div>
            <div className="flex justify-between text-emerald-400">
              <span>Convenience Charge:</span>
              <span>₹0.00 (Waived)</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white print:text-black pt-2 border-t border-slate-800 print:border-slate-300">
              <span>Total Paid:</span>
              <span className="font-mono text-emerald-400">{formatCurrency(bill.amount)}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between gap-2 print:hidden">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>BBPS Verified</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={onClose}
              className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
