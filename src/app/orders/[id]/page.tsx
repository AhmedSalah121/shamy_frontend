'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrder } from '@/context/OrderContext';
import { OrderHeader } from '@/components/order/OrderHeader';
import { OrderStatusTimeline } from '@/components/order/OrderStatusTimeline';
import { ItemList } from '@/components/order/ItemList';
import { AddItemModal } from '@/components/order/AddItemModal';
import { PickupHeroCard } from '@/components/order/PickupHeroCard';
import { ArrivalAlertBanner } from '@/components/order/ArrivalAlertBanner';
import { FrontPayersSection } from '@/components/order/FrontPayersSection';
import { SettleOrderModal } from '@/components/settlement/SettleOrderModal';
import { BillBreakdownView } from '@/components/settlement/BillBreakdownView';

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = Number(params?.id);

  const {
    currentOrder,
    bills,
    isLoading,
    error,
    loadOrder,
    joinOrder,
    leaveOrder,
    settleOrder,
    pickHero,
    markArrived,
    addItem,
    deleteItem,
    payCash,
    payInstapay,
    returnChange,
    confirmReimbursement,
  } = useOrder();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrder(orderId);
    }
  }, [orderId, loadOrder]);

  if (isLoading && !currentOrder) {
    return (
      <div className="py-24 text-center">
        <span className="inline-block w-8 h-8 border-3 border-[#9E2A22] border-t-transparent rounded-full animate-spin"></span>
        <p className="text-xs text-[#73504F] mt-3 font-medium">Loading breakfast run #{orderId}...</p>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <span className="text-4xl block mb-2">⚠️</span>
        <h2 className="text-lg font-bold text-[#301314]">Breakfast Session Not Found</h2>
        <p className="text-xs text-[#73504F] mt-1">{error || 'Unable to load order details.'}</p>
        <Link
          href="/"
          className="mt-4 inline-block px-4 py-2 rounded-xl bg-[#9E2A22] text-white text-xs font-bold"
        >
          Back to Homepage
        </Link>
      </div>
    );
  }

  const isSettlingOrCompleted =
    currentOrder.status === 'SETTLING' || currentOrder.status === 'COMPLETED';

  return (
    <div className="space-y-8">
      {/* Breadcrumb navigation */}
      <div className="flex items-center gap-2 text-xs text-[#73504F]">
        <Link href="/" className="hover:text-[#9E2A22] font-medium">
          Home
        </Link>
        <span>/</span>
        <span className="text-[#301314] font-bold">Order #{currentOrder.id}</span>
        <span className="text-[#9D7B7A]">({currentOrder.restaurantName})</span>
      </div>

      {/* Main Order Header */}
      <OrderHeader
        order={currentOrder}
        onJoin={() => joinOrder(currentOrder.id)}
        onLeave={() => leaveOrder(currentOrder.id)}
        onOpenSettleModal={() => setIsSettleModalOpen(true)}
        onBroadcastArrived={() => markArrived(currentOrder.id)}
      />

      {/* Status Timeline Stepper */}
      <OrderStatusTimeline currentStatus={currentOrder.status} />

      {/* Arrival Alert Banner (Celebratory when delivered, or action if pending) */}
      <ArrivalAlertBanner
        order={currentOrder}
        onBroadcastArrived={() => markArrived(currentOrder.id)}
      />

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 cols): Items List and Settlement */}
        <div className="lg:col-span-2 space-y-8">
          {/* Breakfast items ordered so far */}
          <ItemList
            order={currentOrder}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onDeleteItem={(itemId) => deleteItem(currentOrder.id, itemId)}
          />

          {/* Bill Breakdown & Fakka / Change Tracker (Section 9) */}
          {isSettlingOrCompleted && bills && (
            <BillBreakdownView
              bills={bills}
              onPayCash={(amountGiven, paidToUserId, notes) =>
                payCash(currentOrder.id, {
                  amountGiven,
                  paidToUserId,
                  paymentMethod: 'CASH',
                  notes,
                })
              }
              onPayInstapay={(txRef, paidToUserId) =>
                payInstapay(currentOrder.id, {
                  amountGiven: currentOrder.myItemsTotal || 43,
                  paidToUserId,
                  paymentMethod: 'INSTAPAY',
                  transactionReference: txRef,
                })
              }
              onReturnChange={(participantId) =>
                returnChange(currentOrder.id, participantId)
              }
              onConfirmReimbursement={(participantId) =>
                confirmReimbursement(currentOrder.id, participantId)
              }
            />
          )}
        </div>

        {/* Right Column (1 col): Pickup Hero & Upfront Cash Payers */}
        <div className="space-y-6">
          {/* Pickup Hero Randomizer */}
          <PickupHeroCard
            order={currentOrder}
            onPickHero={() => pickHero(currentOrder.id)}
          />

          {/* Upfront Multi-Payer Section (Egyptian Office Cash Fronting) */}
          <FrontPayersSection
            order={currentOrder}
            onFrontPayerAdded={() => loadOrder(currentOrder.id)}
          />
        </div>
      </div>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={async (req) => {
          await addItem(currentOrder.id, req);
        }}
      />

      {/* Settle Order Modal */}
      <SettleOrderModal
        isOpen={isSettleModalOpen}
        onClose={() => setIsSettleModalOpen(false)}
        defaultFee={currentOrder.deliveryFee || 30}
        onSettle={async (fee) => {
          await settleOrder(currentOrder.id, fee);
        }}
      />
    </div>
  );
}
