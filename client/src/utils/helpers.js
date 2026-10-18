// Helper utility functions

export const formatCurrency = (amount, currency = 'INR') => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

export const getDaysRemaining = (dueDateString) => {
  if (!dueDateString) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(dueDateString);
  dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const getUrgencyInfo = (dueDateString, isPaid) => {
  if (isPaid) {
    return {
      status: 'paid',
      label: 'Paid',
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      dotClass: 'bg-emerald-400',
      isUrgent: false,
      daysRemaining: 0
    };
  }

  const days = getDaysRemaining(dueDateString);

  if (days < 0) {
    return {
      status: 'overdue',
      label: `Overdue by ${Math.abs(days)} day${Math.abs(days) > 1 ? 's' : ''}`,
      badgeClass: 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse',
      dotClass: 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]',
      isUrgent: true,
      daysRemaining: days
    };
  } else if (days === 0) {
    return {
      status: 'today',
      label: 'Due Today!',
      badgeClass: 'bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse',
      dotClass: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
      isUrgent: true,
      daysRemaining: 0
    };
  } else if (days === 1) {
    return {
      status: 'tomorrow',
      label: 'Due Tomorrow',
      badgeClass: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
      dotClass: 'bg-amber-400',
      isUrgent: true,
      daysRemaining: 1
    };
  } else if (days <= 3) {
    return {
      status: 'soon',
      label: `Due in ${days} days`,
      badgeClass: 'bg-orange-500/15 text-orange-300 border border-orange-500/30',
      dotClass: 'bg-orange-400',
      isUrgent: true,
      daysRemaining: days
    };
  } else {
    return {
      status: 'upcoming',
      label: `Due in ${days} days`,
      badgeClass: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30',
      dotClass: 'bg-indigo-400',
      isUrgent: false,
      daysRemaining: days
    };
  }
};

export const formatPhoneDisplay = (phone) => {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  return phone;
};
