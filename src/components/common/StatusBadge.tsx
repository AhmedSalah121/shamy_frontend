import React from 'react';
import { OrderStatus } from '@/types';

interface StatusBadgeProps {
  status: OrderStatus | string;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'OPEN':
        return 'bg-[#EBF4F9] text-[#0E4D92] border-[#93BBE0]';
      case 'LOCKED':
        return 'bg-[#FEF3C7] text-[#92400E] border-[#FCD34D]';
      case 'ORDERED':
        return 'bg-[#EDE9FE] text-[#5B21B6] border-[#DDD6FE]';
      case 'DELIVERED':
        return 'bg-[#DCFCE7] text-[#166534] border-[#86EFAC]';
      case 'SETTLING':
        return 'bg-[#FDEEEB] text-[#9E2A22] border-[#F3B3A6]';
      case 'COMPLETED':
        return 'bg-[#E6EFF7] text-[#0E4D92] border-[#93BBE0]';
      case 'CANCELLED':
        return 'bg-[#FEE2E2] text-[#991B1B] border-[#FCA5A5]';
      default:
        return 'bg-[#F6EEEA] text-[#73504F] border-[#EBDCD7]';
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  }[size];

  const getStatusLabel = () => {
    switch (status) {
      case 'OPEN':
        return '🟢 Accepting Orders';
      case 'LOCKED':
        return '🔒 Deadline Cutoff';
      case 'ORDERED':
        return '📞 Order Placed';
      case 'DELIVERED':
        return '🥐 Arrived at Office';
      case 'SETTLING':
        return '💰 Settling & Fakka';
      case 'COMPLETED':
        return '✅ All Settled';
      case 'CANCELLED':
        return '❌ Cancelled';
      default:
        return status;
    }
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border shadow-2xs transition-colors ${getBadgeStyle()} ${sizeClasses}`}
    >
      {getStatusLabel()}
    </span>
  );
};
