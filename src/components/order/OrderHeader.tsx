'use client';

import React from 'react';
import { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { StatusBadge } from '../common/StatusBadge';
import { CountdownTimer } from '../common/CountdownTimer';

interface OrderHeaderProps {
  order: Order;
  onJoin: () => void;
  onLeave: () => void;
  onOpenSettleModal: () => void;
  onBroadcastArrived: () => void;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({
  order,
  onJoin,
  onLeave,
  onOpenSettleModal,
  onBroadcastArrived,
}) => {
  const { user } = useAuth();

  const isCreator = user?.id === order.creatorId;
  const isHero = user?.id === order.pickupHero?.id;
  const isParticipant = order.participants.some((p) => p.userId === user?.id);
  const isDeadlinePassed = Boolean(order.isDeadlinePassed) || new Date(order.deadline).getTime() <= Date.now();
  const isArrivedOrPast =
    order.status === 'DELIVERED' ||
    order.status === 'SETTLING' ||
    order.status === 'COMPLETED' ||
    order.status === 'CANCELLED';
  const canLeaveOrder = isParticipant && !isCreator && !isDeadlinePassed && !isArrivedOrPast && order.status === 'OPEN';

  return (
    <div className="bg-[#F7EFE9] rounded-xl border border-[#DFCFC5] p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left: Info */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-lg bg-[#EFE3DB] text-[#9E2A22] border border-[#DFCFC5] text-xs font-bold flex items-center gap-1.5">
              <span>🍽️</span> {order.restaurantName}
            </span>
            <StatusBadge status={order.status} size="md" />
            {isCreator && (
              <span className="px-2.5 py-0.5 rounded-lg bg-[#E2ECF5] text-[#0E4D92] border border-[#93BBE0] text-[11px] font-bold">
                👑 You are Creator
              </span>
            )}
            {isHero && (
              <span className="px-2.5 py-0.5 rounded-lg bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] text-[11px] font-bold">
                🦸‍♂️ You are Pickup Hero
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#301314] tracking-tight">
            {order.title}
          </h1>

          {order.description && (
            <p className="text-sm text-[#73504F] max-w-2xl leading-relaxed">
              {order.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 pt-1 text-xs text-[#73504F]">
            {order.restaurantPhone && (
              <span className="flex items-center gap-1 font-medium">
                <span>📞</span> {order.restaurantPhone}
              </span>
            )}
            {order.menuUrl && (
              <a
                href={order.menuUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#0E4D92] hover:text-[#9E2A22] font-semibold underline underline-offset-2 flex items-center gap-1"
              >
                <span>📜</span> View Restaurant Menu ↗
              </a>
            )}
            <span className="flex items-center gap-1 font-medium bg-[#EFE3DB] px-2.5 py-1 rounded-lg border border-[#DFCFC5]">
              <span>Deadline:</span>
              <CountdownTimer deadline={order.deadline} />
            </span>
            <span className="flex items-center gap-1 font-medium">
              <span>🛵</span> Est. Delivery: <strong>{order.deliveryFee} EGP</strong>
            </span>
          </div>

          {/* Creator Details */}
          <div className="flex items-center gap-2 pt-2 text-xs border-t border-[#E3D0C7] mt-2">
            <span className="text-[#9D7B7A]">Initiated by:</span>
            <span className="font-bold text-[#301314]">{order.creator.name}</span>
            {order.creator.instapayHandle && (
              <span className="px-2 py-0.5 rounded-lg bg-[#E2ECF5] text-[#0E4D92] font-semibold text-[11px]">
                ⚡ {order.creator.instapayHandle}
              </span>
            )}
            {order.creator.phoneNumber && (
              <span className="text-[#73504F] text-[11px]">📱 {order.creator.phoneNumber}</span>
            )}
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
          {!isParticipant ? (
            <button
              onClick={onJoin}
              disabled={isDeadlinePassed || isArrivedOrPast || order.status !== 'OPEN'}
              className="px-6 py-2.5 rounded-xl bg-[#9E2A22] hover:bg-[#85221B] disabled:opacity-50 text-white font-bold text-sm shadow-sm transition-all active:scale-95"
            >
              + Join This Breakfast Run
            </button>
          ) : (
            canLeaveOrder && (
              <button
                onClick={onLeave}
                className="px-4 py-2 rounded-xl bg-[#EAE0D8] border border-[#DFCFC5] text-[#73504F] hover:text-[#9E2A22] hover:border-[#9E2A22] font-medium text-xs transition-colors"
              >
                Leave Order
              </button>
            )
          )}

          {/* Creator Settle Trigger */}
          {isCreator && order.status !== 'SETTLING' && order.status !== 'COMPLETED' && (
            <button
              onClick={onOpenSettleModal}
              className="px-5 py-2.5 rounded-xl bg-[#0E4D92] hover:bg-[#093A70] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>💰</span> Trigger Settlement & Fakka
            </button>
          )}

          {/* Order Arrived broadcast button */}
          {(isHero || isCreator) && order.status !== 'DELIVERED' && order.status !== 'SETTLING' && order.status !== 'COMPLETED' && (
            <button
              onClick={onBroadcastArrived}
              className="px-5 py-2.5 rounded-xl bg-[#BD5346] hover:bg-[#A94438] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <span>📢</span> Broadcast &quot;Order Arrived!&quot;
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
