'use client';

import React from 'react';
import { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface ArrivalAlertBannerProps {
  order: Order;
  onBroadcastArrived: () => Promise<void>;
}

export const ArrivalAlertBanner: React.FC<ArrivalAlertBannerProps> = ({ order, onBroadcastArrived }) => {
  const { user } = useAuth();
  const isDelivered = order.status === 'DELIVERED' || order.status === 'SETTLING' || order.status === 'COMPLETED';
  const isHero = user?.id === order.pickupHero?.id;
  const isCreator = user?.id === order.creatorId;

  if (isDelivered) {
    return (
      <div className="bg-[#F5E4E0] rounded-xl border-2 border-[#9E2A22] p-5 shadow-sm animate-in fade-in duration-300">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#9E2A22] text-white text-2xl flex items-center justify-center shrink-0 shadow-xs">
            🛵
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-[#9E2A22] text-base">Breakfast Has Arrived!</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-[#FAF4F1] text-[#9E2A22] border border-[#F3B3A6]">
                At Front Desk / Gate
              </span>
            </div>
            <p className="text-xs text-[#73504F] mt-1 leading-relaxed">
              Today&apos;s breakfast from <strong className="text-[#301314]">{order.restaurantName}</strong> has been fetched and delivered! Head over to the pantry or reception to collect your warm food!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Not delivered yet, but user has authority to broadcast
  if (isHero || isCreator) {
    return (
      <div className="bg-[#E2ECF5] rounded-xl border border-[#93BBE0] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🛵</span>
            <div>
              <h4 className="font-bold text-sm text-[#0E4D92]">
                Delivery Arrival Alert Control
              </h4>
              <p className="text-xs text-[#73504F]">
                Did the delivery driver just arrive at the gate? Alert everyone with one click!
              </p>
            </div>
          </div>

          <button
            onClick={onBroadcastArrived}
            className="px-4 py-2.5 rounded-xl bg-[#0E4D92] hover:bg-[#093A70] text-white font-bold text-xs shadow-xs transition-all active:scale-95 flex items-center justify-center gap-2 shrink-0"
          >
            <span>📢</span> Send &quot;Order Arrived! 🥐&quot; Broadcast
          </button>
        </div>
      </div>
    );
  }

  return null;
};
