'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Order, FrontPayer } from '@/types';
import { frontPayerService } from '@/services/frontPayerService';
import { Modal } from '../common/Modal';
import { useAuth } from '@/context/AuthContext';

interface FrontPayersSectionProps {
  order: Order;
  onFrontPayerAdded?: () => void;
}

export const FrontPayersSection: React.FC<FrontPayersSectionProps> = ({ order, onFrontPayerAdded }) => {
  const { user } = useAuth();
  const [frontPayers, setFrontPayers] = useState<FrontPayer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [amountPaid, setAmountPaid] = useState<number>(100);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadFrontPayers = useCallback(async () => {
    try {
      const data = await frontPayerService.getFrontPayers(order.id);
      setFrontPayers(data);
    } catch {
      // ignore
    }
  }, [order.id]);

  useEffect(() => {
    loadFrontPayers();
  }, [loadFrontPayers]);

  const totalFronted = frontPayers.reduce((acc, p) => acc + p.amountPaid, 0);

  const handleAddFrontPayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || amountPaid <= 0) return;

    setIsSubmitting(true);
    try {
      await frontPayerService.addFrontPayer(order.id, {
        userId: user.id,
        amountPaid,
        notes: notes.trim() || undefined,
      });
      await loadFrontPayers();
      setIsModalOpen(false);
      setNotes('');
      setAmountPaid(100);
      if (onFrontPayerAdded) onFrontPayerAdded();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7EFE9] rounded-xl border border-[#DFCFC5] p-5 sm:p-6 shadow-xs space-y-4">
      {/* Header section with proper hierarchy & responsive button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E3D0C7]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">🤝</span>
            <h3 className="font-bold text-[#301314] text-base leading-tight">
              Who Paid
            </h3>
            {/* <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EFE3DB] text-[#9E2A22] border border-[#DFCFC5]">
              Section 8
            </span> */} 
          </div>
          {/* <p className="text-xs text-[#73504F] leading-normal">
            Colleagues who paid cash at the door so others can reimburse them
          </p> */}
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EAE0D8] hover:bg-[#DFCFC5] text-[#9E2A22] text-xs font-bold transition-colors border border-[#DFCFC5] shrink-0 self-start sm:self-center shadow-2xs"
        >
          <span>+</span> I Fronted Cash at Door
        </button>
      </div>

      {/* Main Content Area */}
      <div>
        {frontPayers.length === 0 ? (
          <div className="py-8 px-4 text-center rounded-xl bg-[#EFE3DB]/60 border border-dashed border-[#DFCFC5]">
            <span className="text-2xl block mb-1">💵</span>
            <p className="text-xs font-bold text-[#301314]">No upfront cash recorded yet</p>
            {/* <p className="text-[11px] text-[#73504F] mt-0.5 max-w-xs mx-auto">
              Did someone hand cash to the courier upon arrival? Click above to record it.
            </p> */}
          </div>
        ) : (
          <div className="space-y-2.5">
            {frontPayers.map((payer) => (
              <div
                key={payer.id}
                className="p-3.5 rounded-xl bg-[#EFE3DB] border border-[#DFCFC5] flex items-center justify-between gap-3 hover:border-[#F3B3A6] transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#9E2A22] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {payer.userName.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#301314] truncate">
                        {payer.userName}
                      </span>
                      {payer.instapayHandle && (
                        <span className="text-[10px] text-[#0E4D92] font-semibold bg-[#E2ECF5] px-1.5 py-0.5 rounded-md">
                          ⚡ {payer.instapayHandle}
                        </span>
                      )}
                    </div>
                    {payer.notes && (
                      <p className="text-[11px] text-[#73504F] italic mt-0.5 truncate">
                        &quot;{payer.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-sm font-extrabold text-[#9E2A22]">
                    {payer.amountPaid} <span className="text-xs font-normal text-[#73504F]">EGP</span>
                  </span>
                  <span className="block text-[10px] text-[#9D7B7A]">Fronted upfront</span>
                </div>
              </div>
            ))}

            {/* Total Fronted Summary Bar */}
            <div className="mt-3 pt-3 border-t border-[#E3D0C7] flex items-center justify-between text-xs px-1">
              <span className="font-semibold text-[#73504F]">Total Cash Fronted:</span>
              <span className="text-sm font-black text-[#0E4D92] bg-[#E2ECF5] px-2.5 py-1 rounded-lg border border-[#93BBE0]">
                {totalFronted} EGP
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Record Front Payer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Upfront Cash Payment 💵"
        description="Egyptian Office Scenario: Record cash given to the delivery driver at the door so colleagues can reimburse you."
      >
        <form onSubmit={handleAddFrontPayer} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-[#301314] block mb-1">
              Who is Paying?
            </label>
            <div className="p-3 rounded-xl bg-[#EFE3DB] text-xs font-semibold text-[#301314] flex items-center gap-2 border border-[#DFCFC5]">
              <span className="w-6 h-6 rounded-full bg-[#9E2A22] text-white flex items-center justify-center text-[10px]">
                {user?.name.charAt(0)}
              </span>
              <span>{user?.name}</span>
              <span className="text-[#0E4D92] text-[11px]">({user?.instapayHandle || 'No handle'})</span>
            </div>
          </div>

          <div>
            <label htmlFor="amount-paid" className="text-xs font-bold text-[#301314] block mb-1">
              Amount You Paid (EGP) *
            </label>
            <input
              id="amount-paid"
              type="number"
              step="5"
              min="5"
              required
              value={amountPaid}
              onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFCFC5] bg-[#FAF4F1] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314]"
            />
            <div className="flex gap-2 mt-2">
              {[50, 100, 200, 350, 400].map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => setAmountPaid(preset)}
                  className="px-2 py-1 text-[11px] rounded-lg bg-[#EAE0D8] text-[#73504F] hover:bg-[#DFCFC5] hover:text-[#301314] font-medium"
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="front-notes" className="text-xs font-bold text-[#301314] block mb-1">
              Notes (e.g. Paid cash at gate 2, Covered remainder in 50s)
            </label>
            <input
              id="front-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Paid cash at gate 2..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#DFCFC5] bg-[#FAF4F1] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314] placeholder-[#9D7B7A]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#DFCFC5] text-[#73504F] text-xs font-medium hover:bg-[#EAE0D8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || amountPaid <= 0}
              className="px-5 py-2 rounded-xl bg-[#9E2A22] hover:bg-[#85221B] disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors"
            >
              {isSubmitting ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
