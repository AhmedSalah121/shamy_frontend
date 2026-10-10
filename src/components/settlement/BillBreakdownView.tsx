'use client';

import React, { useState } from 'react';
import { BillBreakdown, ParticipantBill } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { PayCashModal } from './PayCashModal';
import { PayInstapayModal } from './PayInstapayModal';

interface BillBreakdownViewProps {
  bills: BillBreakdown;
  onPayCash: (amountGiven: number, paidToUserId: number, notes?: string) => Promise<void>;
  onPayInstapay: (txRef: string, paidToUserId: number) => Promise<void>;
  onReturnChange: (participantId: number) => Promise<void>;
  onConfirmReimbursement: (participantId: number) => Promise<void>;
}

export const BillBreakdownView: React.FC<BillBreakdownViewProps> = ({
  bills,
  onPayCash,
  onPayInstapay,
  onReturnChange,
  onConfirmReimbursement,
}) => {
  const { user } = useAuth();
  const [selectedCashBill, setSelectedCashBill] = useState<ParticipantBill | null>(null);
  const [selectedInstapayBill, setSelectedInstapayBill] = useState<ParticipantBill | null>(null);

  const isCreator = user?.id === bills.creatorId;
  const isFrontPayer = bills.frontPayers.some((fp) => fp.userId === user?.id);

  // Recipient for InstaPay
  const primaryRecipient = bills.frontPayers[0]
    ? {
        userId: bills.frontPayers[0].userId,
        userName: bills.frontPayers[0].userName,
        instapayHandle: bills.frontPayers[0].instapayHandle,
      }
    : {
        userId: bills.creatorId,
        userName: bills.creatorName,
        instapayHandle: bills.creatorInstapay,
      };

  return (
    <div className="space-y-6">
      {/* Financial Overview Card */}
      <div className="bg-[#F7EFE9] rounded-xl border border-[#DFCFC5] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E3D0C7]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💰</span>
              <h2 className="text-xl font-black text-[#301314]">
                Bill Breakdown & Fakka Tracker
              </h2>
            </div>
            <p className="text-xs text-[#73504F] mt-1">
              Order #{bills.orderId} • Final cost split and reimbursement status
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#EFE3DB] text-[#9E2A22] border border-[#DFCFC5]">
              Status: {bills.status}
            </span>
          </div>
        </div>

        {/* 4 Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-4 rounded-xl bg-[#EFE3DB] border border-[#DFCFC5]">
            <span className="text-[11px] font-bold text-[#73504F] uppercase block">
              Items Subtotal
            </span>
            <span className="text-xl font-extrabold text-[#301314] mt-1 block">
              {bills.itemsTotal} <span className="text-xs font-normal">EGP</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#EFE3DB] border border-[#DFCFC5]">
            <span className="text-[11px] font-bold text-[#73504F] uppercase block">
              Delivery Fee
            </span>
            <span className="text-xl font-extrabold text-[#9E2A22] mt-1 block">
              +{bills.addedDeliveryFee} <span className="text-xs font-normal">EGP</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F5E4E0] border border-[#F3B3A6]">
            <span className="text-[11px] font-bold text-[#9E2A22] uppercase block">
              Grand Total
            </span>
            <span className="text-xl font-black text-[#9E2A22] mt-1 block">
              {bills.grandTotal} <span className="text-xs font-normal">EGP</span>
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#E2ECF5] border border-[#93BBE0]">
            <span className="text-[11px] font-bold text-[#0E4D92] uppercase block">
              Cash Fronted
            </span>
            <span className="text-xl font-black text-[#0E4D92] mt-1 block">
              {bills.totalFronted} <span className="text-xs font-normal">EGP</span>
            </span>
          </div>
        </div>
      </div>

      {/* Participants Individual Bills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#301314]">
            Individual Colleagues&apos; Share ({bills.participants.length})
          </h3>
          <span className="text-xs text-[#73504F]">Delivery split evenly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bills.participants.map((participant) => {
            const isMe = user?.id === participant.userId;
            const reimb = participant.reimbursement;
            const isPending = reimb?.status === 'PENDING';
            const isPaidByParticipant = reimb?.status === 'PAID_BY_PARTICIPANT';
            const isConfirmed = reimb?.status === 'CONFIRMED';
            const hasChangePending =
              reimb && reimb.changeDue > 0 && !reimb.isChangeReturned;

            return (
              <div
                key={participant.participantId}
                className={`bg-[#F7EFE9] rounded-xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                  isMe ? 'border-[#9E2A22] ring-1 ring-[#F3B3A6]' : 'border-[#DFCFC5]'
                }`}
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#E3D0C7]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-[#EFE3DB] text-[#9E2A22] font-extrabold text-sm flex items-center justify-center shrink-0 border border-[#DFCFC5]">
                        {participant.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-[#301314]">
                            {participant.userName}
                          </h4>
                          {isMe && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#9E2A22] text-white">
                              You
                            </span>
                          )}
                        </div>
                        {participant.instapayHandle && (
                          <p className="text-[11px] text-[#0E4D92] font-semibold">
                            ⚡ {participant.instapayHandle}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div>
                      {isConfirmed ? (
                        <span className="px-2.5 py-1 rounded-lg bg-[#DCFCE7] text-[#166534] border border-[#86EFAC] text-xs font-bold">
                          ✓ Settled
                        </span>
                      ) : isPaidByParticipant ? (
                        <span className="px-2.5 py-1 rounded-lg bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] text-xs font-bold">
                          🕒 Paid (Pending Conf.)
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-[#F5E4E0] text-[#9E2A22] border border-[#F3B3A6] text-xs font-bold">
                          ⏳ Pending Payment
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="py-3 text-xs space-y-1.5 text-[#73504F]">
                    {participant.items.map((item) => (
                      <div key={item.id} className="flex justify-between items-center">
                        <span className="truncate pr-2">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-semibold text-[#301314] shrink-0">
                          {item.totalPrice} EGP
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center text-[#9E2A22] font-medium pt-1 border-t border-dashed border-[#DFCFC5]">
                      <span>Delivery Share:</span>
                      <span>+{participant.addedFee} EGP</span>
                    </div>
                  </div>
                </div>

                {/* Footer Totals & Payment Actions */}
                <div className="pt-3 border-t border-[#E3D0C7] space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-semibold text-[#73504F]">Total Due:</span>
                    <span className="text-xl font-black text-[#9E2A22]">
                      {participant.totalAmount}{' '}
                      <span className="text-xs font-medium text-[#73504F]">EGP</span>
                    </span>
                  </div>

                  {/* Fakka details if paid cash */}
                  {reimb && reimb.amountGiven && (
                    <div className="p-3 rounded-xl bg-[#EFE3DB] border border-[#DFCFC5] text-xs space-y-1">
                      <div className="flex justify-between text-[#73504F]">
                        <span>Banknote given:</span>
                        <span className="font-bold text-[#301314]">{reimb.amountGiven} EGP</span>
                      </div>
                      {reimb.changeDue > 0 && (
                        <div className="flex justify-between text-[#0E4D92] font-bold">
                          <span>Change Due (&quot;فكة&quot;):</span>
                          <span>{reimb.changeDue} EGP</span>
                        </div>
                      )}
                      <div className="flex justify-between text-[11px] pt-1">
                        <span>Change Status:</span>
                        <span className={reimb.isChangeReturned ? 'text-[#166534] font-bold' : 'text-[#9E2A22] font-bold'}>
                          {reimb.isChangeReturned ? '✓ Change Returned' : '⏳ Change Awaiting Return'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action buttons depending on state and user identity */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {/* If Pending, allow the participant to pay */}
                    {isPending && isMe && (
                      <>
                        <button
                          onClick={() => setSelectedCashBill(participant)}
                          className="flex-1 px-3 py-2 rounded-xl bg-[#EAE0D8] hover:bg-[#DFCFC5] text-[#9E2A22] text-xs font-bold border border-[#DFCFC5] transition-colors"
                        >
                          💵 Pay Cash (Fakka)
                        </button>
                        <button
                          onClick={() => setSelectedInstapayBill(participant)}
                          className="flex-1 px-3 py-2 rounded-xl bg-[#0E4D92] hover:bg-[#093A70] text-white text-xs font-bold transition-colors"
                        >
                          ⚡ Pay InstaPay
                        </button>
                      </>
                    )}

                    {/* Return Change Button (Collector / Front-payer only) */}
                    {hasChangePending && (isFrontPayer || isCreator) && (
                      <button
                        onClick={() => onReturnChange(participant.participantId)}
                        className="w-full px-3 py-2 rounded-xl bg-[#0E4D92] hover:bg-[#093A70] text-white text-xs font-bold transition-colors shadow-2xs"
                      >
                        🤝 Mark {reimb?.changeDue} EGP Change as Returned
                      </button>
                    )}

                    {/* Confirm Reimbursement Button (Collector / Creator) */}
                    {isPaidByParticipant && (isFrontPayer || isCreator) && (
                      <button
                        onClick={() => onConfirmReimbursement(participant.participantId)}
                        className="w-full px-3 py-2 rounded-xl bg-[#166534] hover:bg-[#14532D] text-white text-xs font-bold transition-colors shadow-2xs"
                      >
                        ✓ Confirm Payment Received
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pay Cash Modal */}
      {selectedCashBill && (
        <PayCashModal
          isOpen={true}
          onClose={() => setSelectedCashBill(null)}
          bill={selectedCashBill}
          frontPayers={bills.frontPayers}
          creatorId={bills.creatorId}
          creatorName={bills.creatorName}
          onPayCash={async (amountGiven, paidToUserId, notes) => {
            await onPayCash(amountGiven, paidToUserId, notes);
            setSelectedCashBill(null);
          }}
        />
      )}

      {/* Pay InstaPay Modal */}
      {selectedInstapayBill && (
        <PayInstapayModal
          isOpen={true}
          onClose={() => setSelectedInstapayBill(null)}
          bill={selectedInstapayBill}
          recipient={primaryRecipient}
          onPayInstapay={async (txRef, paidToUserId) => {
            await onPayInstapay(txRef, paidToUserId);
            setSelectedInstapayBill(null);
          }}
        />
      )}
    </div>
  );
};
