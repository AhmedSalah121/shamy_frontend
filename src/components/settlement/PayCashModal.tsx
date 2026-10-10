'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ParticipantBill, FrontPayer } from '@/types';

interface PayCashModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: ParticipantBill;
  frontPayers: Array<{ userId: number; userName: string; instapayHandle?: string | null }>;
  creatorId: number;
  creatorName: string;
  onPayCash: (amountGiven: number, paidToUserId: number, notes?: string) => Promise<void>;
}

export const PayCashModal: React.FC<PayCashModalProps> = ({
  isOpen,
  onClose,
  bill,
  frontPayers,
  creatorId,
  creatorName,
  onPayCash,
}) => {
  const amountDue = bill.totalAmount;
  // Default banknote suggestion to the nearest higher banknote (50, 100, 200)
  const defaultNote = amountDue <= 50 ? 50 : amountDue <= 100 ? 100 : 200;

  const [amountGiven, setAmountGiven] = useState<number>(defaultNote);
  const [paidToUserId, setPaidToUserId] = useState<number>(
    frontPayers[0]?.userId || creatorId
  );
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeDue = Math.max(0, amountGiven - amountDue);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amountGiven < amountDue) return;

    setIsSubmitting(true);
    try {
      const generatedNote = notes.trim() || (changeDue > 0 ? `Needs ${changeDue} EGP change` : 'Exact amount');
      await onPayCash(amountGiven, paidToUserId, generatedNote);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cash Payment & Fakka Tracker 💵"
      description="Egyptian Office Fakka Calculator: Hand your banknote and track the change due."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount Due Banner */}
        <div className="p-4 rounded-2xl bg-[#FAF0ED] border border-[#F3B3A6] flex items-center justify-between">
          <div>
            <span className="text-xs text-[#73504F] font-medium block">Total Amount Due</span>
            <span className="text-2xl font-black text-[#9E2A22]">
              {amountDue} <span className="text-sm font-semibold">EGP</span>
            </span>
          </div>
          <div className="text-right text-xs text-[#73504F]">
            <p>Food: {bill.itemsTotal} EGP</p>
            <p>Delivery: {bill.addedFee} EGP</p>
          </div>
        </div>

        {/* Banknote Given */}
        <div>
          <label htmlFor="cash-given" className="text-xs font-bold text-[#301314] block mb-1">
            Cash Banknote Given (EGP) *
          </label>
          <input
            id="cash-given"
            type="number"
            min={amountDue}
            step="1"
            required
            value={amountGiven}
            onChange={(e) => setAmountGiven(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-sm font-bold text-[#301314]"
          />

          {/* Quick Egyptian Banknotes Presets */}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-[#73504F]">Banknotes:</span>
            {[20, 50, 100, 200].map((note) => (
              <button
                type="button"
                key={note}
                onClick={() => setAmountGiven(note)}
                className={`px-2.5 py-1 text-xs rounded-lg font-bold border transition-colors ${
                  amountGiven === note
                    ? 'bg-[#9E2A22] text-white border-[#9E2A22]'
                    : 'bg-[#FAF4F1] text-[#73504F] border-[#EBDCD7] hover:bg-[#F3B3A6]'
                }`}
              >
                {note} EGP
              </button>
            ))}
          </div>
        </div>

        {/* Change Due (Fakka) Box */}
        <div className="p-4 rounded-2xl bg-[#EBF4F9] border border-[#93BBE0] flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-[#0E4D92] block">
              Change Due (&quot;فكة&quot; Fakka)
            </span>
            <p className="text-[11px] text-[#73504F] mt-0.5">
              Collector must return this amount to you
            </p>
          </div>
          <span className="text-2xl font-black text-[#0E4D92]">
            {changeDue} <span className="text-sm font-semibold">EGP</span>
          </span>
        </div>

        {/* Recipient Selection */}
        <div>
          <label htmlFor="paid-to-user" className="text-xs font-bold text-[#301314] block mb-1">
            Handing Cash To: *
          </label>
          <select
            id="paid-to-user"
            value={paidToUserId}
            onChange={(e) => setPaidToUserId(parseInt(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-xs font-medium text-[#301314]"
          >
            {frontPayers.length > 0 ? (
              frontPayers.map((fp) => (
                <option key={fp.userId} value={fp.userId}>
                  {fp.userName} (Fronted Cash at Door)
                </option>
              ))
            ) : (
              <option value={creatorId}>{creatorName} (Order Creator)</option>
            )}
          </select>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#EBDCD7] text-[#73504F] text-xs font-medium hover:bg-[#F6EEEA]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || amountGiven < amountDue}
            className="px-5 py-2 rounded-xl bg-[#9E2A22] hover:bg-[#85221B] disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Record Cash & Change Due'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
