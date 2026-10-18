import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Building2,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  RefreshCw,
  X,
  Sparkles,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { formatCurrency, formatDate } from '../utils/helpers';
import { CategoryIcon } from './CategoryIcon';

export const PaymentModal = ({
  isOpen,
  onClose,
  bill,
  onPaymentSuccess
}) => {
  if (!isOpen || !bill) return null;

  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9812');
  const [cardHolder, setCardHolder] = useState('SURESH KUMAR');
  const [expiry, setExpiry] = useState('08/29');
  const [cvv, setCvv] = useState('382');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessing, setIsProcessing] = useState(false);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleProcessPayment = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      triggerConfetti();
      const paymentDetails = {
        transactionId: `TXN-PAY-${Math.floor(100000000 + Math.random() * 900000000)}`,
        paidAt: new Date().toISOString(),
        paymentMethod: paymentMethod.toUpperCase(),
        amount: bill.amount,
        billId: bill.id,
        providerName: bill.providerName,
        consumerId: bill.consumerId,
        category: bill.category
      };
      onPaymentSuccess(bill.id, paymentDetails);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl text-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <CategoryIcon category={bill.category} className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                BBPS Secure Payment Gateway
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{bill.providerName}</h3>
            </div>
          </div>
        </div>

        {/* Bill Summary Banner */}
        <div className="px-6 py-3.5 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Consumer / Account ID</div>
            <div className="text-sm font-mono font-semibold text-slate-200">{bill.consumerId}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Total Payable</div>
            <div className="text-xl font-extrabold text-emerald-400 font-mono">
              {formatCurrency(bill.amount)}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-slate-800/80 rounded-xl border border-slate-700/80">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                paymentMethod === 'upi'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>UPI & QR</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                paymentMethod === 'card'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('netbanking')}
              className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                paymentMethod === 'netbanking'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Net Banking</span>
            </button>
          </div>

          <form onSubmit={handleProcessPayment} className="space-y-4">
            {/* UPI Option */}
            {paymentMethod === 'upi' && (
              <div className="space-y-4 animate-fadeIn">
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'gpay', label: 'Google Pay', icon: '⚡' },
                    { id: 'phonepe', label: 'PhonePe', icon: '🟣' },
                    { id: 'paytm', label: 'Paytm UPI', icon: '🔵' },
                    { id: 'cred', label: 'CRED UPI', icon: '🪙' },
                  ].map((app) => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id)}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                        selectedUpiApp === app.id
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-800/40 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xl mb-1">{app.icon}</div>
                      <div className="text-[11px] font-semibold truncate">{app.label}</div>
                    </button>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 text-indigo-400">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">Direct UPI ID / QR Instant Verification</div>
                    <div className="text-[11px] text-slate-400">Linked to your connected number for 1-tap approval</div>
                  </div>
                </div>
              </div>
            )}

            {/* Credit / Debit Card Option */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 animate-fadeIn">
                {/* 3D Styled Card Preview */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-purple-950 p-5 border border-indigo-500/30 text-white shadow-xl">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-xs tracking-widest uppercase font-mono text-indigo-300 font-semibold">
                      Debit / Credit Card
                    </span>
                    <span className="font-extrabold italic text-sm text-slate-200">BBPS PAY</span>
                  </div>
                  <div className="font-mono text-lg tracking-widest font-bold mb-4">
                    {cardNumber}
                  </div>
                  <div className="flex justify-between items-end text-xs">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Card Holder</div>
                      <div className="font-semibold tracking-wide">{cardHolder}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase">Expires</div>
                      <div className="font-mono font-semibold">{expiry}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Net Banking Option */}
            {paymentMethod === 'netbanking' && (
              <div className="space-y-3 animate-fadeIn">
                <label className="block text-xs font-medium text-slate-400">Select Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map((bank) => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition cursor-pointer flex items-center justify-between ${
                        selectedBank === bank
                          ? 'bg-indigo-600/20 border-indigo-500 text-white'
                          : 'bg-slate-800/50 border-slate-700/80 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span>{bank}</span>
                      {selectedBank === bank && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Bill Price Breakdown */}
            <div className="pt-3 border-t border-slate-800 text-xs space-y-1.5 text-slate-400">
              <div className="flex justify-between">
                <span>Bill Amount</span>
                <span className="font-mono text-slate-200">{formatCurrency(bill.amount)}</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>Convenience & Platform Fee</span>
                <span>FREE (₹0)</span>
              </div>
              <div className="flex justify-between font-bold text-white text-sm pt-1 border-t border-slate-800">
                <span>Total Amount Due</span>
                <span className="font-mono text-emerald-400">{formatCurrency(bill.amount)}</span>
              </div>
            </div>

            {/* Submit Pay button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-600/25 transition cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authorizing Payment...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authorize & Pay {formatCurrency(bill.amount)}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted & NPCI BBPS Authorized</span>
          </div>
        </div>
      </div>
    </div>
  );
};
