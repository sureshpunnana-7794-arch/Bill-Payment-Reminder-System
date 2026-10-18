import React from 'react';
import {
  Zap,
  Smartphone,
  Wifi,
  CreditCard,
  Droplets,
  Flame,
  Tv,
  Home,
  ShieldCheck,
  FileText,
  HelpCircle
} from 'lucide-react';

export const CategoryIcon = ({ category, className = "w-5 h-5", ...props }) => {
  switch (category) {
    case 'Electricity':
      return <Zap className={className} {...props} />;
    case 'Mobile':
      return <Smartphone className={className} {...props} />;
    case 'Broadband':
      return <Wifi className={className} {...props} />;
    case 'CreditCard':
      return <CreditCard className={className} {...props} />;
    case 'Water':
      return <Droplets className={className} {...props} />;
    case 'PipedGas':
      return <Flame className={className} {...props} />;
    case 'DTH':
      return <Tv className={className} {...props} />;
    case 'Rent':
      return <Home className={className} {...props} />;
    case 'Insurance':
      return <ShieldCheck className={className} {...props} />;
    default:
      return <FileText className={className} {...props} />;
  }
};
