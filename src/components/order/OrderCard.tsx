'use client';

import React from 'react';
import Link from 'next/link';
import { Order } from '@/types';
import { StatusBadge } from '../common/StatusBadge';
import { CountdownTimer } from '../common/CountdownTimer';

interface OrderCardProps {
  order: Order;
  key?: any;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="bg-[#F7EFE9] rounded-xl border border-[#DFCFC5] p-6 shadow-xs hover:shadow-md hover:border-[#F3B3A6] transition-all flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-[#EFE3DB] text-[#9E2A22] border border-[#DFCFC5]">
            🍽️ {order.restaurantName}
          </span>
          <StatusBadge status={order.status} size="sm" />
        </div>

        <Link href={`/orders/${order.id}`} className="block">
          <h3 className="text-lg font-bold text-[#301314] group-hover:text-[#9E2A22] transition-colors line-clamp-1">
            {order.title}
          </h3>
          {order.description && (
            <p className="text-xs text-[#73504F] mt-1.5 line-clamp-2 leading-relaxed">
              {order.description}
            </p>
          )}
        </Link>

        {/* Pickup Hero Pill if selected */}
        {order.pickupHero && (
          <div className="mt-4 p-2.5 rounded-lg bg-[#E2ECF5] border border-[#93BBE0] flex items-center gap-2">
            <span className="text-sm">🦸‍♂️</span>
            <div className="text-xs">
              <span className="font-semibold text-[#0E4D92]">Pickup Hero: </span>
              <span className="text-[#301314] font-medium">{order.pickupHero.name}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-[#E3D0C7] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Avatar stack */}
          <div className="flex -space-x-2 overflow-hidden">
            {order.participants.slice(0, 3).map((p, idx) => (
              <div
                key={p.id || idx}
                className="inline-block h-7 w-7 rounded-full ring-2 ring-[#F7EFE9] bg-[#EAE0D8] text-[#9E2A22] text-[10px] font-bold flex items-center justify-center"
                title={p.user?.name}
              >
                {p.user?.name ? p.user.name.charAt(0) : 'P'}
              </div>
            ))}
          </div>
          <span className="text-xs text-[#73504F] font-medium">
            {order.participants.length} {order.participants.length === 1 ? 'person' : 'colleagues'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] text-[#9D7B7A] block uppercase font-medium">Deadline</span>
            <CountdownTimer deadline={order.deadline} className="text-xs" />
          </div>

          <Link
            href={`/orders/${order.id}`}
            className="px-3 py-1.5 rounded-lg bg-[#EAE0D8] text-[#9E2A22] hover:bg-[#9E2A22] hover:text-white font-semibold text-xs transition-colors"
          >
            Enter ➔
          </Link>
        </div>
      </div>
    </div>
  );
};
