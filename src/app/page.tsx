'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useOrder } from '@/context/OrderContext';
import { OrderCard } from '@/components/order/OrderCard';

export default function HomePage() {
  const { orders, isLoading } = useOrder();
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'SETTLING'>('ALL');

  const filteredOrders = orders.filter((o) => {
    if (filter === 'OPEN') return o.status === 'OPEN';
    if (filter === 'SETTLING') return o.status === 'SETTLING' || o.status === 'COMPLETED';
    return true;
  });

  const totalParticipants = orders.reduce((acc, o) => acc + o.participants.length, 0);

  return (
    <div className="space-y-10">
      {/* Warm Mediterranean / Middle Eastern Hero Section */}
      <section className="relative overflow-hidden rounded-xl bg-linear-to-br from-[#EAE0D8] via-[#F4EBE4] to-[#DEE8F0] border border-[#DFCFC5] p-8 sm:p-12 shadow-xs">
        {/* Decorative shutter accent */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-48 h-48 rounded-full bg-[#0E4D92]/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-40 h-40 rounded-full bg-[#9E2A22]/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#EFE4DC] border border-[#DFCFC5] text-xs font-bold text-[#9E2A22] mb-4 shadow-2xs backdrop-blur-xs">
            <span>✨</span> Egyptian Office Breakfast Solved
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#301314] tracking-tight leading-tight">
            Breakfast runs without the <span className="text-[#9E2A22]">cash chaos</span>.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-[#73504F] leading-relaxed">
            Order your morning Foul & Falafel together before the deadline cutoff. Randomly pick a
            <strong> Pickup Hero</strong>, record who fronted cash at the gate, and calculate exact change
            (&quot;فكة&quot;) or InstaPay splits in seconds.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href="/orders/new"
              className="px-6 py-3 rounded-xl bg-[#9E2A22] hover:bg-[#85221B] text-white font-bold text-sm shadow-md transition-all active:scale-95 flex items-center gap-2"
            >
              <span>+</span> Start New Breakfast Run
            </Link>

            <a
              href="#active-orders"
              className="px-5 py-3 rounded-xl bg-[#F7EFE9] hover:bg-[#EAE0D8] text-[#301314] border border-[#DFCFC5] font-semibold text-sm transition-colors"
            >
              View Active Orders ↓
            </a>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="mt-10 pt-8 border-t border-[#DFCFC5] grid grid-cols-3 gap-4 max-w-xl">
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#9E2A22] block">
              {orders.length}
            </span>
            <span className="text-xs text-[#73504F] font-medium">Breakfast Runs</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#0E4D92] block">
              {totalParticipants}
            </span>
            <span className="text-xs text-[#73504F] font-medium">Hungry Colleagues</span>
          </div>
          <div>
            <span className="text-2xl sm:text-3xl font-black text-[#481617] block">
              0
            </span>
            <span className="text-xs text-[#73504F] font-medium">Lost Banknotes</span>
          </div>
        </div>
      </section>

      {/* 3 Core Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-xl bg-[#F7EFE9] border border-[#DFCFC5] shadow-xs hover:border-[#F3B3A6] transition-colors">
          <div className="w-10 h-10 rounded-lg bg-[#EFE3DB] text-[#9E2A22] flex items-center justify-center text-xl mb-4 border border-[#DFCFC5]">
            📝
          </div>
          <h3 className="font-bold text-[#301314] text-base">1. Synchronized Cart</h3>
          <p className="text-xs text-[#73504F] mt-2 leading-relaxed">
            Every colleague customizes their sandwiches, tahini, and extra cumin before the strict deadline lockout.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#F7EFE9] border border-[#DFCFC5] shadow-xs hover:border-[#93BBE0] transition-colors">
          <div className="w-10 h-10 rounded-lg bg-[#E2ECF5] text-[#0E4D92] flex items-center justify-center text-xl mb-4 border border-[#93BBE0]">
            🦸‍♂️
          </div>
          <h3 className="font-bold text-[#301314] text-base">2. Random Pickup Hero</h3>
          <p className="text-xs text-[#73504F] mt-2 leading-relaxed">
            The wheel randomly chooses one participant to run down to the door. Strictly excludes the creator!
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#F7EFE9] border border-[#DFCFC5] shadow-xs hover:border-[#F3B3A6] transition-colors">
          <div className="w-10 h-10 rounded-lg bg-[#F5E4E0] text-[#9E2A22] flex items-center justify-center text-xl mb-4 border border-[#F3B3A6]">
            💰
          </div>
          <h3 className="font-bold text-[#301314] text-base">3. Fakka & Multi-Payers</h3>
          <p className="text-xs text-[#73504F] mt-2 leading-relaxed">
            Colleagues who paid cash at the door get reimbursed automatically. Precise change calculation down to the Pound.
          </p>
        </div>
      </section>

      {/* Active Orders List Section */}
      <section id="active-orders" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#301314]">
              Today&apos;s Breakfast Runs 🧆
            </h2>
            <p className="text-xs text-[#73504F] mt-0.5">
              Join an open order before cutoff or check your settlement status
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#EAE0D8] border border-[#DFCFC5] self-start sm:self-auto">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'ALL'
                  ? 'bg-[#F7EFE9] text-[#9E2A22] shadow-2xs'
                  : 'text-[#73504F] hover:text-[#301314]'
              }`}
            >
              All Runs ({orders.length})
            </button>
            <button
              onClick={() => setFilter('OPEN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'OPEN'
                  ? 'bg-[#F7EFE9] text-[#9E2A22] shadow-2xs'
                  : 'text-[#73504F] hover:text-[#301314]'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setFilter('SETTLING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === 'SETTLING'
                  ? 'bg-[#F7EFE9] text-[#9E2A22] shadow-2xs'
                  : 'text-[#73504F] hover:text-[#301314]'
              }`}
            >
              Settling & Completed
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <span className="inline-block w-8 h-8 border-3 border-[#9E2A22] border-t-transparent rounded-full animate-spin"></span>
            <p className="text-xs text-[#73504F] mt-3 font-medium">Loading breakfast sessions...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-[#F7EFE9] rounded-xl border border-[#DFCFC5] p-12 text-center">
            <span className="text-4xl block mb-3">🍳</span>
            <h3 className="text-base font-bold text-[#301314]">No breakfast orders found</h3>
            <p className="text-xs text-[#73504F] mt-1 max-w-sm mx-auto">
              Nobody in the office has started an order session yet. Be the morning hero!
            </p>
            <Link
              href="/orders/new"
              className="mt-5 inline-block px-5 py-2.5 rounded-xl bg-[#9E2A22] text-white text-xs font-bold shadow-xs hover:bg-[#85221B] transition-colors"
            >
              + Start First Breakfast Run
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
