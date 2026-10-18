import React from 'react';
import {
  Zap,
  Home,
  Sparkles,
  Smartphone,
  Wifi,
  CreditCard,
  Droplets,
  Flame,
  Tv,
  ShieldCheck,
  Tag,
  Receipt
} from 'lucide-react';

export const CATEGORY_STYLES = {
  Utilities: {
    label: 'Utilities',
    icon: Zap,
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dotClass: 'bg-amber-400'
  },
  Rent: {
    label: 'Rent',
    icon: Home,
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    dotClass: 'bg-emerald-400'
  },
  Subscriptions: {
    label: 'Subscriptions',
    icon: Sparkles,
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    dotClass: 'bg-purple-400'
  },
  Electricity: {
    label: 'Electricity',
    icon: Zap,
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    dotClass: 'bg-amber-400'
  },
  Broadband: {
    label: 'Broadband / Wi-Fi',
    icon: Wifi,
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    dotClass: 'bg-sky-400'
  },
  Mobile: {
    label: 'Mobile Postpaid',
    icon: Smartphone,
    badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    dotClass: 'bg-teal-400'
  },
  CreditCard: {
    label: 'Credit Card',
    icon: CreditCard,
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    dotClass: 'bg-indigo-400'
  },
  Water: {
    label: 'Water Utility',
    icon: Droplets,
    badgeClass: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    dotClass: 'bg-cyan-400'
  },
  PipedGas: {
    label: 'Gas / LPG',
    icon: Flame,
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dotClass: 'bg-rose-400'
  },
  DTH: {
    label: 'DTH / Cable',
    icon: Tv,
    badgeClass: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    dotClass: 'bg-violet-400'
  },
  Insurance: {
    label: 'Insurance',
    icon: ShieldCheck,
    badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    dotClass: 'bg-teal-400'
  },
  Other: {
    label: 'Other',
    icon: Tag,
    badgeClass: 'bg-slate-700/40 text-slate-300 border-slate-600/50',
    dotClass: 'bg-slate-400'
  }
};

export const CategoryBadge = ({
  category,
  className = '',
  showIcon = true,
  size = 'md'
}) => {
  const normalizedKey = category || 'Other';
  const config = CATEGORY_STYLES[normalizedKey] || {
    label: category || 'Other',
    icon: Tag,
    badgeClass: 'bg-slate-700/40 text-slate-300 border-slate-600/50',
    dotClass: 'bg-slate-400'
  };

  const IconComponent = config.icon;

  const sizeClasses = size === 'sm'
    ? 'text-[10px] px-2 py-0.5 gap-1'
    : size === 'lg'
    ? 'text-xs px-3 py-1.5 gap-2'
    : 'text-[11px] px-2.5 py-1 gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border shadow-xs tracking-wide whitespace-nowrap transition select-none ${config.badgeClass} ${sizeClasses} ${className}`}
      title={`Category: ${config.label}`}
    >
      {showIcon && (
        <IconComponent className={size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} />
      )}
      <span>{config.label}</span>
    </span>
  );
};

export default CategoryBadge;
