'use client';

import React, { useState } from 'react';
import { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface PickupHeroCardProps {
  order: Order;
  onPickHero: () => Promise<void>;
}

export const PickupHeroCard: React.FC<PickupHeroCardProps> = ({ order, onPickHero }) => {
  const { user } = useAuth();
  const [isPicking, setIsPicking] = useState(false);
  const [alertError, setAlertError] = useState<string | null>(null);

  const isCreator = user?.id === order.creatorId;
  const hero = order.pickupHero;

  // Eligible participants strictly excluding creator
  const eligibleCount = order.participants.filter((p) => p.userId !== order.creatorId).length;

  const handlePick = async () => {
    setAlertError(null);
    if (eligibleCount === 0) {
      setAlertError('At least one colleague other than the order creator must join to select a Pickup Hero.');
      return;
    }
    setIsPicking(true);
    try {
      await onPickHero();
    } catch (err: any) {
      setAlertError(err.message);
    } finally {
      setIsPicking(false);
    }
  };

  return (
    <div className="bg-[#F7EFE9] rounded-xl border border-[#DFCFC5] p-5 sm:p-6 shadow-xs overflow-hidden relative space-y-4">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#E3D0C7]">
        <div className="flex items-center gap-2">
          <span className="text-xl">🦸‍♂️</span>
          <h3 className="font-bold text-[#301314] text-base">The Pickup Hero</h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#E2ECF5] text-[#0E4D92] border border-[#93BBE0]">
          Section 7 Contract
        </span>
      </div>

      <div>
        {hero ? (
          <div className="p-4 rounded-xl bg-[#E2ECF5] border border-[#93BBE0] flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#0E4D92] text-white text-xl font-black flex items-center justify-center shrink-0 shadow-xs">
              {hero.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-bold text-sm text-[#0E4D92]">{hero.name}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#FAF4F1] text-[#0E4D92] shadow-2xs">
                  🏆 Chosen Hero
                </span>
              </div>
              <p className="text-xs text-[#73504F] mt-1 leading-normal">
                Will pick up today&apos;s breakfast downstairs when the driver arrives!
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                {hero.instapayHandle && (
                  <span className="text-[#0E4D92] font-semibold flex items-center gap-1">
                    <span>⚡</span> {hero.instapayHandle}
                  </span>
                )}
                {hero.phoneNumber && (
                  <span className="text-[#73504F]">📱 {hero.phoneNumber}</span>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-xl bg-[#EFE3DB]/60 border border-[#DFCFC5] text-center space-y-3">
            <p className="text-xs text-[#73504F] leading-relaxed max-w-sm mx-auto">
              Randomly selects one participant to run down to the office gate and fetch the breakfast bag.
            </p>
            {/* <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#FAF4F1] text-[#9E2A22] text-[11px] font-bold border border-[#F3B3A6]">
              <span>⚖️</span>
              <span>Egyptian office rule: Order Creator is never chosen!</span>
            </div> */}

            {alertError && (
              <p className="text-xs text-[#9E2A22] bg-[#F2DFD7] border border-[#F3B3A6] p-2.5 rounded-xl text-left">
                {alertError}
              </p>
            )}

            <div className="pt-1">
              {isCreator ? (
                <button
                  onClick={handlePick}
                  disabled={isPicking || eligibleCount === 0}
                  className="px-5 py-2.5 rounded-xl bg-[#0E4D92] hover:bg-[#093A70] disabled:opacity-50 text-white font-bold text-xs shadow-md transition-all active:scale-95 inline-flex items-center gap-2"
                >
                  {isPicking ? (
                    <>
                      <span className="animate-spin">🔄</span> Rolling the Hero Wheel...
                    </>
                  ) : (
                    <>
                      <span>🎲</span> Roll Hero Wheel ({eligibleCount} eligible)
                    </>
                  )}
                </button>
              ) : (
                <p className="text-[11px] text-[#9D7B7A]">
                  Waiting for the order creator ({order.creator.name}) to roll the dice.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
