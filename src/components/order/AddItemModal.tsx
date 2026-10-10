'use client';

import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { AddItemRequest } from '@/types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (req: AddItemRequest) => Promise<void>;
}

const POPULAR_SUGGESTIONS = [
  { name: 'Foul with Olive Oil', price: 18 },
  { name: 'Falafel Stuffed with Baba Ghanoush', price: 16.5 },
  { name: 'Crispy French Fries Packet', price: 22 },
  { name: 'Boiled Eggs with Cumin & Butter', price: 15 },
  { name: 'Alexandrian Foul with Sujuk', price: 32 },
  { name: 'Egyptian Shakshouka Sandwich', price: 25 },
  { name: 'Hot Mint Tea (Shai)', price: 12 },
];

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState<number>(20);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || quantity <= 0 || unitPrice <= 0) return;

    setIsSubmitting(true);
    try {
      await onAdd({
        name: name.trim(),
        quantity,
        unitPrice,
        notes: notes.trim() || undefined,
      });
      // Reset form
      setName('');
      setQuantity(1);
      setUnitPrice(20);
      setNotes('');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectSuggestion = (item: { name: string; price: number }) => {
    setName(item.name);
    setUnitPrice(item.price);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Breakfast Item 🧆"
      description="Pick from popular Egyptian breakfast items or type custom orders"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick presets */}
        <div>
          <label className="text-xs font-semibold text-[#73504F] block mb-1.5">
            Quick Suggestions:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SUGGESTIONS.map((sug) => (
              <button
                type="button"
                key={sug.name}
                onClick={() => selectSuggestion(sug)}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-[#FAF0ED] hover:bg-[#F3B3A6] text-[#301314] font-medium border border-[#EBDCD7] transition-colors"
              >
                {sug.name} ({sug.price} EGP)
              </button>
            ))}
          </div>
        </div>

        {/* Item Name */}
        <div>
          <label htmlFor="item-name" className="text-xs font-bold text-[#301314] block mb-1">
            Item Name *
          </label>
          <input
            id="item-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Foul with Olive Oil, Taameya..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314] placeholder-[#9D7B7A]"
          />
        </div>

        {/* Quantity and Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-[#301314] block mb-1">Quantity</label>
            <div className="flex items-center rounded-xl border border-[#EBDCD7] overflow-hidden">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="px-3 py-2 bg-[#FAF0ED] text-[#9E2A22] font-bold text-sm hover:bg-[#F3B3A6] transition-colors"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold text-sm text-[#301314]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Increase quantity"
                className="px-3 py-2 bg-[#FAF0ED] text-[#9E2A22] font-bold text-sm hover:bg-[#F3B3A6] transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="unit-price" className="text-xs font-bold text-[#301314] block mb-1">
              Unit Price (EGP) *
            </label>
            <input
              id="unit-price"
              type="number"
              step="0.5"
              min="1"
              required
              value={unitPrice}
              onChange={(e) => setUnitPrice(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314]"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="item-notes" className="text-xs font-bold text-[#301314] block mb-1">
            Special Notes / Requests (Optional)
          </label>
          <input
            id="item-notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Extra cumin, spicy tahini on the side, well done..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314] placeholder-[#9D7B7A]"
          />
        </div>

        {/* Total preview */}
        <div className="p-3 rounded-xl bg-[#FAF0ED] flex items-center justify-between text-xs border border-[#F3B3A6]/40">
          <span className="text-[#73504F] font-medium">Item Total:</span>
          <span className="font-extrabold text-[#9E2A22] text-sm">
            {(quantity * unitPrice).toFixed(2)} EGP
          </span>
        </div>

        {/* Submit */}
        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[#EBDCD7] text-[#73504F] text-xs font-medium hover:bg-[#F6EEEA] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="px-5 py-2 rounded-xl bg-[#9E2A22] hover:bg-[#85221B] disabled:opacity-50 text-white text-xs font-bold shadow-xs transition-colors"
          >
            {isSubmitting ? 'Adding...' : 'Add to Order'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
