'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';

interface SettleOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultFee: number;
  onSettle: (fee: number) => Promise<void>;
}

export const SettleOrderModal: React.FC<SettleOrderModalProps> = ({
  isOpen,
  onClose,
  defaultFee,
  onSettle,
}) => {
  const [fee, setFee] = useState<number>(defaultFee || 30);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSettle(fee);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settle Breakfast Order 💰"
      description="Sets order status to SETTLING, splits delivery fee equally across participants, and calculates individual bills."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="final-fee" className="text-xs font-bold text-[#301314] block mb-1">
            Final Delivery & Service Fee (EGP) *
          </label>
          <input
            id="final-fee"
            type="number"
            min="0"
            step="5"
            required
            value={fee}
            onChange={(e) => setFee(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314]"
          />
          <p className="text-[11px] text-[#73504F] mt-1">
            This fee will be divided equally amongst all participants in the order.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#FAF0ED] border border-[#F3B3A6]/50 text-xs text-[#73504F] space-y-1">
          <p className="font-bold text-[#9E2A22]">✨ What happens next?</p>
          <p>• Everyone gets their exact bill amount (Items + Split delivery fee).</p>
          <p>• Participants can submit cash with exact change (&quot;Fakka&quot;) or pay through InstaPay.</p>
          <p>• Upfront cash payers get reimbursed systematically.</p>
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
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-[#0E4D92] hover:bg-[#093A70] disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors"
          >
            {isSubmitting ? 'Calculating...' : 'Confirm & Trigger Settlement'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
