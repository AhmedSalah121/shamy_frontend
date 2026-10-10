'use client';

import React from 'react';
import { Order, OrderItem } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface ItemListProps {
  order: Order;
  onOpenAddModal: () => void;
  onDeleteItem: (itemId: number) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ order, onOpenAddModal, onDeleteItem }) => {
  const { user } = useAuth();
  const isLockedOrClosed = order.status !== 'OPEN' || Boolean(order.isDeadlinePassed);

  const items = order.items || [];
  const totalAmount = items.reduce((acc, i) => acc + (i.totalPrice || i.unitPrice * i.quantity), 0);

  return (
    <div className="bg-[#F7EFE9] rounded-xl border border-[#DFCFC5] p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E3D0C7]">
        <div>
          <h2 className="text-lg font-bold text-[#301314] flex items-center gap-2">
            <span>🍳</span> Breakfast Cart & Orders
            <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-[#EFE3DB] text-[#9E2A22]">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </h2>
          <p className="text-xs text-[#73504F] mt-0.5">
            {isLockedOrClosed
              ? '🔒 Order is locked. Items cannot be modified.'
              : 'Add your breakfast items before the deadline cutoff.'}
          </p>
        </div>

        {!isLockedOrClosed && (
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 rounded-xl bg-[#9E2A22] hover:bg-[#85221B] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>+</span> Add My Items
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 px-4">
          <span className="text-4xl block mb-2">🧆</span>
          <p className="text-sm font-bold text-[#301314]">No items added yet</p>
          <p className="text-xs text-[#73504F] mt-1 max-w-sm mx-auto">
            Be the first to add your Foul, Falafel, or morning coffee to this breakfast order!
          </p>
          {!isLockedOrClosed && (
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 rounded-xl bg-[#EAE0D8] text-[#9E2A22] hover:bg-[#9E2A22] hover:text-white text-xs font-bold transition-colors"
            >
              + Add First Item
            </button>
          )}
        </div>
      ) : (
        <div className="divide-y divide-[#E3D0C7] mt-2">
          {items.map((item) => {
            const isOwner = user?.id === item.userId;
            const itemTotal = item.totalPrice || item.unitPrice * item.quantity;
            const participantName =
              item.participant?.user?.name || (isOwner ? user?.name : 'Colleague');

            return (
              <div
                key={item.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EFE3DB] text-[#9E2A22] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    {item.quantity}x
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#301314]">{item.name}</span>
                      <span className="text-[11px] text-[#73504F] font-medium">
                        (@ {item.unitPrice} EGP)
                      </span>
                      {isOwner && (
                        <span className="px-1.5 py-0.5 rounded-md bg-[#F2DFD7] text-[#9E2A22] text-[10px] font-bold">
                          Mine
                        </span>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-xs text-[#BD5346] italic mt-0.5 flex items-center gap-1">
                        <span>📝</span> &quot;{item.notes}&quot;
                      </p>
                    )}
                    <p className="text-[11px] text-[#9D7B7A] mt-0.5">
                      Ordered by: <strong className="text-[#73504F]">{participantName}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                  <span className="text-sm font-extrabold text-[#301314]">
                    {itemTotal} <span className="text-xs font-medium text-[#73504F]">EGP</span>
                  </span>

                  {isOwner && !isLockedOrClosed && (
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="p-1.5 text-[#9D7B7A] hover:text-[#9E2A22] rounded-lg hover:bg-[#EAE0D8] transition-colors"
                      title="Remove item"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Subtotal Footer */}
          <div className="pt-4 mt-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-[#73504F]">Food Items Total</span>
            <span className="font-extrabold text-[#301314] text-base">
              {totalAmount} <span className="text-xs font-normal text-[#73504F]">EGP</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
