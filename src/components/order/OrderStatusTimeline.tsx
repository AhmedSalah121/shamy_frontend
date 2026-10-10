import React from 'react';
import { OrderStatus } from '@/types';
import { ORDER_STATUS_FLOW } from '@/config/constants';

interface OrderStatusTimelineProps {
  currentStatus: OrderStatus;
}

export const OrderStatusTimeline: React.FC<OrderStatusTimelineProps> = ({ currentStatus }) => {
  const currentIndex = ORDER_STATUS_FLOW.indexOf(currentStatus as any);

  const stepLabels: Record<string, { label: string; icon: string }> = {
    OPEN: { label: 'Open', icon: '📝' },
    LOCKED: { label: 'Locked', icon: '🔒' },
    ORDERED: { label: 'Ordered', icon: '📞' },
    DELIVERED: { label: 'Delivered', icon: '🥐' },
    SETTLING: { label: 'Settling & Fakka', icon: '💰' },
    COMPLETED: { label: 'Completed', icon: '🎉' },
  };

  return (
    <div className="bg-[#F7EFE9] rounded-xl border border-[#DFCFC5] p-4 sm:p-6 shadow-xs">
      <div className="text-xs font-bold text-[#73504F] uppercase tracking-wider mb-4 flex items-center justify-between">
        <span>Order Progress Timeline</span>
        <span className="text-[11px] font-medium text-[#9E2A22]">
          Step {Math.max(1, currentIndex + 1)} of {ORDER_STATUS_FLOW.length}
        </span>
      </div>

      <div className="relative">
        {/* Connecting progress line */}
        <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-[#F2E8E4] -translate-y-1/2 z-0" />

        <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-0 relative z-10">
          {ORDER_STATUS_FLOW.map((step, idx) => {
            const isCompleted = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const info = stepLabels[step];

            return (
              <div key={step} className="flex flex-col items-center text-center p-2 rounded-xl transition-all">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-2xs ${
                    isCurrent
                      ? 'bg-[#9E2A22] text-white ring-4 ring-[#F3B3A6] scale-110'
                      : isCompleted
                      ? 'bg-[#0E4D92] text-white'
                      : 'bg-[#FAF0ED] text-[#73504F] border border-[#EBDCD7]'
                  }`}
                >
                  {isCompleted ? '✓' : info.icon}
                </div>

                <span
                  className={`text-xs mt-2 font-medium ${
                    isCurrent
                      ? 'font-bold text-[#9E2A22]'
                      : isCompleted
                      ? 'text-[#0E4D92] font-semibold'
                      : 'text-[#9D7B7A]'
                  }`}
                >
                  {info.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
