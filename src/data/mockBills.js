// Mock Data and Profile Presets for Bill Payment Reminder System

export const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: 'LayoutGrid', color: 'from-blue-500 to-indigo-500' },
  { id: 'Utilities', name: 'Utilities', icon: 'Zap', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  { id: 'Rent', name: 'Rent', icon: 'Home', color: 'from-emerald-400 to-green-600', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  { id: 'Subscriptions', name: 'Subscriptions', icon: 'Sparkles', color: 'from-purple-400 to-pink-500', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  { id: 'Electricity', name: 'Electricity', icon: 'Zap', color: 'from-amber-400 to-orange-500', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
  { id: 'Mobile', name: 'Mobile Postpaid', icon: 'Smartphone', color: 'from-teal-400 to-emerald-500', bg: 'bg-teal-500/15 text-teal-300 border-teal-500/30' },
  { id: 'Broadband', name: 'Broadband / Wi-Fi', icon: 'Wifi', color: 'from-blue-400 to-cyan-500', bg: 'bg-sky-500/15 text-sky-300 border-sky-500/30' },
  { id: 'CreditCard', name: 'Credit Card', icon: 'CreditCard', color: 'from-purple-400 to-pink-500', bg: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' },
  { id: 'Water', name: 'Water Utility', icon: 'Droplets', color: 'from-cyan-400 to-blue-600', bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
  { id: 'PipedGas', name: 'Gas / LPG', icon: 'Flame', color: 'from-rose-400 to-red-500', bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30' },
  { id: 'DTH', name: 'DTH / Cable', icon: 'Tv', color: 'from-indigo-400 to-violet-500', bg: 'bg-violet-500/15 text-violet-300 border-violet-500/30' },
  { id: 'Insurance', name: 'Insurance Premium', icon: 'ShieldCheck', color: 'from-teal-400 to-emerald-500', bg: 'bg-teal-500/15 text-teal-300 border-teal-500/30' },
  { id: 'Other', name: 'Other', icon: 'Tag', color: 'from-slate-400 to-slate-600', bg: 'bg-slate-700/40 text-slate-300 border-slate-600/50' }
];

export const POPULAR_PROVIDERS = {
  Electricity: ['BESCOM Electricity', 'Tata Power - DDL', 'Adani Electricity Mumbai', 'MSEDCL Maharashtra', 'BSES Rajdhani', 'Torrent Power'],
  Mobile: ['Airtel Postpaid 5G', 'Jio Postpaid Plus', 'Vodafone Idea (Vi)', 'BSNL Mobile'],
  Broadband: ['Airtel Xstream Fiber', 'JioFiber Ultra', 'ACT Fibernet Gigabit', 'Tata Play Fiber', 'Hathway Broadband'],
  CreditCard: ['HDFC Bank Regalia Gold', 'ICICI Bank Sapphiro Card', 'SBI Card SimplyCLICK', 'Axis Bank Magnus Card', 'American Express Platinum'],
  Water: ['Bangalore BWSSB Water', 'Delhi Jal Board', 'Mumbai Municipal Corporation (MCGM)', 'Chennai Metro Water'],
  PipedGas: ['Indane Piped Natural Gas', 'Mahanagar Gas (MGL)', 'Indraprastha Gas (IGL)', 'Adani Total Gas', 'Gujarat Gas'],
  DTH: ['Tata Play DTH', 'Airtel Digital TV', 'Dish TV HD', 'Sun Direct'],
  Rent: ['Sobha Emerald Apts Maintenance', 'Prestige Lakeside Club & Rent', 'Owner Direct (Bank Transfer)'],
  Insurance: ['HDFC Life Insurance', 'ICICI Prudential Life', 'Star Health Insurance', 'LIC of India']
};

// Helper to get relative ISO date string
const getRelativeDate = (offsetDays) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const PRESET_PROFILES = [
  {
    phone: '9876543210',
    formatted: '+91 98765 43210',
    name: 'Rahul Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    planType: 'Premium Family Member',
    verified: true,
    bills: [
      {
        id: 'bill-1',
        category: 'Electricity',
        providerName: 'BESCOM Electricity',
        consumerId: 'CA-902837411',
        nickname: 'Home Meter Bangalore',
        amount: 2450,
        dueDate: getRelativeDate(1), // Due tomorrow
        isPaid: false,
        autoRemind: true,
        reminderChannels: { whatsapp: true, sms: true, push: true },
        lateFee: 150,
        billingPeriod: '15 Sep - 14 Oct',
        notes: 'Includes AC summer consumption peak tariff'
      },
      {
        id: 'bill-2',
        category: 'Broadband',
        providerName: 'Airtel Xstream Fiber',
        consumerId: '080-41289942',
        nickname: '300 Mbps Work From Home Line',
        amount: 1179,
        dueDate: getRelativeDate(0), // Due TODAY
        isPaid: false,
        autoRemind: true,
        reminderChannels: { whatsapp: true, sms: false, push: true },
        lateFee: 100,
        billingPeriod: '01 Oct - 31 Oct',
        notes: 'Includes Disney+ Hotstar & Amazon Prime bundled'
      },
      {
        id: 'bill-3',
        category: 'CreditCard',
        providerName: 'HDFC Bank Regalia Gold',
        consumerId: '•••• •••• •••• 4028',
        nickname: 'Primary Travel & Shopping Card',
        amount: 34820,
        dueDate: getRelativeDate(4), // Due in 4 days
        isPaid: false,
        autoRemind: true,
        reminderChannels: { whatsapp: true, sms: true, push: true },
        lateFee: 750,
        billingPeriod: '12 Sep - 11 Oct',
        notes: 'Minimum due ₹3,500; Full payment recommended to avoid 42% APR'
      },
      {
        id: 'bill-4',
        category: 'Mobile',
        providerName: 'Jio Postpaid Plus',
        consumerId: '9876543210',
        nickname: 'Personal Unlimited 5G',
        amount: 599,
        dueDate: getRelativeDate(9), // Due in 9 days
        isPaid: false,
        autoRemind: true,
        reminderChannels: { whatsapp: true, sms: true, push: false },
        lateFee: 50,
        billingPeriod: '20 Sep - 19 Oct',
        notes: '75GB data rollover active'
      },
      {
        id: 'bill-5',
        category: 'PipedGas',
        providerName: 'Indane Piped Natural Gas',
        consumerId: 'PNG-849201',
        nickname: 'Kitchen Gas Connection',
        amount: 860,
        dueDate: getRelativeDate(-2), // Overdue by 2 days
        isPaid: false,
        autoRemind: true,
        reminderChannels: { whatsapp: true, sms: true, push: true },
        lateFee: 80,
        billingPeriod: '01 Sep - 30 Sep',
        notes: 'Overdue! Gas disconnection notice might follow in 5 days'
      },
      {
        id: 'bill-6',
        category: 'Water',
        providerName: 'Bangalore BWSSB Water',
        consumerId: 'BW-094821',
        nickname: 'Apartment Monthly Meter',
        amount: 420,
        dueDate: getRelativeDate(-5),
        isPaid: true,
        paidAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        paymentRef: 'UPI-BWSSB-83948201',
        autoRemind: false,
        reminderChannels: { whatsapp: false, sms: false, push: false },
        lateFee: 0,
        billingPeriod: 'Aug - Sep 2026',
        notes: 'Cleared via UPI PhonePe'
      }
    ]
  },
  {
    phone: '9812345678',
    formatted: '+91 98123 45678',
    name: 'Priya Patel',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    planType: 'Enterprise Pro',
    verified: true,
    bills: [
      {
        id: 'bill-p1',
        category: 'Electricity',
        providerName: 'Tata Power - DDL',
        consumerId: 'TP-10293847',
        nickname: 'Studio Office electricity',
        amount: 4890,
        dueDate: getRelativeDate(2),
        isPaid: false,
        autoRemind: true,
        reminderChannels: { whatsapp: true, sms: true, push: true },
        lateFee: 200,
        billingPeriod: 'Sep 2026'
      },
      {
        id: 'bill-p2',
        category: 'Broadband',
        providerName: 'ACT Fibernet Gigabit',
        consumerId: 'ACT-9482104',
        nickname: 'Dedicated 1Gbps Lease',
        amount: 2359,
        dueDate: getRelativeDate(5),
        isPaid: false,
        autoRemind: true,
        reminderChannels: { whatsapp: true, sms: false, push: true },
        lateFee: 150,
        billingPeriod: 'Oct 2026'
      },
      {
        id: 'bill-p3',
        category: 'CreditCard',
        providerName: 'ICICI Bank Sapphiro Card',
        consumerId: '•••• •••• •••• 9912',
        nickname: 'Business Expense Card',
        amount: 62450,
        dueDate: getRelativeDate(0), // Today
        isPaid: false,
        autoRemind: true,
        reminderChannels: { whatsapp: true, sms: true, push: true },
        lateFee: 1200,
        billingPeriod: 'Sep - Oct 2026'
      }
    ]
  },
  {
    phone: '9123456789',
    formatted: '+91 91234 56789',
    name: 'Vikram Verma',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    planType: 'Individual Basic',
    verified: true,
    bills: [
      {
        id: 'bill-v1',
        category: 'Rent',
        providerName: 'Prestige Lakeside Club & Rent',
        consumerId: 'FLAT-B402',
        nickname: 'Monthly House Rent',
        amount: 32000,
        dueDate: getRelativeDate(1), // Tomorrow
        isPaid: false,
        autoRemind: true,
        reminderChannels: { whatsapp: true, sms: true, push: true },
        lateFee: 1000,
        billingPeriod: 'October Rent'
      },
      {
        id: 'bill-v2',
        category: 'DTH',
        providerName: 'Tata Play DTH',
        consumerId: 'TP-9028172',
        nickname: 'Living Room 4K Pack',
        amount: 699,
        dueDate: getRelativeDate(7),
        isPaid: false,
        autoRemind: true,
        reminderChannels: { whatsapp: true, sms: false, push: false },
        lateFee: 20,
        billingPeriod: 'Monthly'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Urgent: BESCOM Electricity Bill Due Tomorrow',
    message: 'Your bill of ₹2,450 is due on tomorrow. Tap to pay now and avoid ₹150 late fee.',
    timestamp: '10 mins ago',
    type: 'urgent',
    read: false,
    billId: 'bill-1'
  },
  {
    id: 'notif-2',
    title: 'Due Today: Airtel Xstream Fiber',
    message: 'Your broadband payment of ₹1,179 expires at midnight today.',
    timestamp: '1 hour ago',
    type: 'warning',
    read: false,
    billId: 'bill-2'
  },
  {
    id: 'notif-3',
    title: 'Reminder Sent to WhatsApp (+91 98765 43210)',
    message: 'Automated alert delivered for HDFC Credit Card due in 4 days.',
    timestamp: '3 hours ago',
    type: 'info',
    read: true,
    billId: 'bill-3'
  },
  {
    id: 'notif-4',
    title: 'Payment Successful: BWSSB Water',
    message: '₹420 received successfully. Receipt #BWSSB-83948201 generated.',
    timestamp: '2 days ago',
    type: 'success',
    read: true,
    billId: 'bill-6'
  }
];
