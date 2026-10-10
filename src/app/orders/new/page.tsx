'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrder } from '@/context/OrderContext';

export default function NewOrderPage() {
  const router = useRouter();
  const { createOrder } = useOrder();

  const [title, setTitle] = useState('Morning Arabiata Run 🧆');
  const [description, setDescription] = useState('Foul, Falafel & Fries before team standup');
  const [restaurantName, setRestaurantName] = useState('Arabiata');
  const [restaurantPhone, setRestaurantPhone] = useState('19999');
  const [menuUrl, setMenuUrl] = useState('https://menu.arabiata.com');
  const [deliveryFee, setDeliveryFee] = useState<number>(30);
  // Default deadline 45 minutes in the future
  const [deadlineMinutes, setDeadlineMinutes] = useState<number>(45);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !restaurantName.trim()) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const deadlineDate = new Date(Date.now() + deadlineMinutes * 60 * 1000).toISOString();
      const created = await createOrder({
        title: title.trim(),
        description: description.trim() || undefined,
        restaurantName: restaurantName.trim(),
        restaurantPhone: restaurantPhone.trim() || undefined,
        menuUrl: menuUrl.trim() || undefined,
        deadline: deadlineDate,
        visibility: 'PUBLIC',
        deliveryFee,
      });

      router.push(`/orders/${created.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to create breakfast session');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back Link */}
      <div className="flex items-center gap-2 text-xs text-[#73504F]">
        <Link href="/" className="hover:text-[#9E2A22]">
          ← Back to Orders
        </Link>
      </div>

      <div className="bg-[#F7EFE9] rounded-xl border border-[#DFCFC5] p-6 sm:p-8 shadow-xs">
        <div className="pb-6 border-b border-[#E3D0C7]">
          <span className="text-3xl block mb-2">🍳</span>
          <h1 className="text-2xl font-black text-[#301314]">
            Start a Breakfast Run
          </h1>
          <p className="text-xs text-[#73504F] mt-1">
            Initiate a collaborative breakfast order session for your office or team.
          </p>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-[#FDF3F1] border border-[#F3B3A6] text-xs text-[#9E2A22]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Title */}
          <div>
            <label htmlFor="order-title" className="text-xs font-bold text-[#301314] block mb-1">
              Order Session Title *
            </label>
            <input
              id="order-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Morning Arabiata Run 🧆"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314]"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="order-desc" className="text-xs font-bold text-[#301314] block mb-1">
              Short Description / Office Notes
            </label>
            <input
              id="order-desc"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Foul, Falafel & Fries before 10:30 AM"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314]"
            />
          </div>

          {/* Restaurant details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="rest-name" className="text-xs font-bold text-[#301314] block mb-1">
                Restaurant Name *
              </label>
              <input
                id="rest-name"
                type="text"
                required
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                placeholder="e.g. Arabiata, Zooba, Kazaz..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314]"
              />
            </div>

            <div>
              <label htmlFor="rest-phone" className="text-xs font-bold text-[#301314] block mb-1">
                Restaurant Hotline / Phone
              </label>
              <input
                id="rest-phone"
                type="text"
                value={restaurantPhone}
                onChange={(e) => setRestaurantPhone(e.target.value)}
                placeholder="e.g. 19999"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314]"
              />
            </div>
          </div>

          {/* Menu Link & Delivery Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="menu-url" className="text-xs font-bold text-[#301314] block mb-1">
                Menu URL / Digital Menu
              </label>
              <input
                id="menu-url"
                type="url"
                value={menuUrl}
                onChange={(e) => setMenuUrl(e.target.value)}
                placeholder="https://menu.arabiata.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314]"
              />
            </div>

            <div>
              <label htmlFor="est-delivery" className="text-xs font-bold text-[#301314] block mb-1">
                Estimated Delivery Fee (EGP)
              </label>
              <input
                id="est-delivery"
                type="number"
                min="0"
                step="5"
                value={deliveryFee}
                onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314]"
              />
            </div>
          </div>

          {/* Deadline Cutoff */}
          <div>
            <label className="text-xs font-bold text-[#301314] block mb-1">
              Order Deadline (Cutoff Time) *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[20, 35, 45, 60, 90].map((mins) => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDeadlineMinutes(mins)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                    deadlineMinutes === mins
                      ? 'bg-[#9E2A22] text-white border-[#9E2A22]'
                      : 'bg-[#FAF4F1] text-[#73504F] border-[#EBDCD7] hover:bg-[#F3B3A6]'
                  }`}
                >
                  +{mins} mins
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[#73504F] mt-1.5">
              Cutoff will be set to{' '}
              <strong>
                {new Date(Date.now() + deadlineMinutes * 60 * 1000).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </strong>
              . Past this time, the session locks and items cannot be modified.
            </p>
          </div>

          <div className="pt-4 border-t border-[#F6EEEA] flex items-center justify-end gap-3">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl border border-[#EBDCD7] text-[#73504F] text-xs font-medium hover:bg-[#F6EEEA] transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#9E2A22] hover:bg-[#85221B] disabled:opacity-50 text-white text-xs font-bold shadow-md transition-colors"
            >
              {isSubmitting ? 'Creating Run...' : 'Launch Breakfast Run 🚀'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
