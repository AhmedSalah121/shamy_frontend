'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { ParticipantBill } from '@/types';

interface PayInstapayModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: ParticipantBill;
  recipient: {
    userId: number;
    userName: string;
    instapayHandle?: string | null;
  };
  onPayInstapay: (txRef: string, paidToUserId: number) => Promise<void>;
}

export const PayInstapayModal: React.FC<PayInstapayModalProps> = ({
  isOpen,
  onClose,
  bill,
  recipient,
  onPayInstapay,
}) => {
  const [txnRef, setTxnRef] = useState(`TXN-${Math.floor(1000000 + Math.random() * 9000000)}`);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyHandle = () => {
    if (recipient.instapayHandle && navigator.clipboard) {
      navigator.clipboard.writeText(recipient.instapayHandle);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!txnRef.trim()) return;

    setIsSubmitting(true);
    try {
      await onPayInstapay(txnRef.trim(), recipient.userId);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Instant Transfer via InstaPay ⚡"
      description="Transfer directly to the front-payer or order creator with zero fees."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Details & Handle */}
        <div className="p-4 rounded-2xl bg-[#E6EFF7] border border-[#93BBE0] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#0E4D92]">Sending Money To:</span>
            <span className="text-xs font-bold text-[#301314]">{recipient.userName}</span>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#93BBE0]">
            <div>
              <span className="text-[10px] text-[#73504F] uppercase font-bold block">
                InstaPay Address (IPA)
              </span>
              <span className="text-sm font-black text-[#0E4D92]">
                {recipient.instapayHandle || 'karim@instapay'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyHandle}
              className="px-3 py-1.5 rounded-lg bg-[#E6EFF7] hover:bg-[#93BBE0] text-[#0E4D92] text-xs font-bold transition-colors"
            >
              {copied ? 'Copied! ✓' : 'Copy'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#73504F]">Amount to Transfer:</span>
            <span className="text-lg font-black text-[#0E4D92]">{bill.totalAmount} EGP</span>
          </div>
        </div>

        {/* Transaction Reference */}
        <div>
          <label htmlFor="txn-ref" className="text-xs font-bold text-[#301314] block mb-1">
            InstaPay Transaction Reference (Ref No.) *
          </label>
          <input
            id="txn-ref"
            type="text"
            required
            value={txnRef}
            onChange={(e) => setTxnRef(e.target.value)}
            placeholder="e.g. TXN-9843217"
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#0E4D92] text-sm text-[#301314]"
          />
          <p className="text-[11px] text-[#73504F] mt-1">
            Found on your InstaPay receipt after completing the bank transfer.
          </p>
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
            disabled={isSubmitting || !txnRef.trim()}
            className="px-5 py-2 rounded-xl bg-[#0E4D92] hover:bg-[#093A70] disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors"
          >
            {isSubmitting ? 'Confirming...' : 'Submit InstaPay Proof'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
