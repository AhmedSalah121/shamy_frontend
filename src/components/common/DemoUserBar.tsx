'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { DEMO_USERS } from '@/config/constants';

export const DemoUserBar: React.FC = () => {
  const { user, switchUser } = useAuth();

  return (
    <aside aria-label="Demo persona switcher" className="bg-[#481617] text-[#FAF4F1] text-xs py-2 px-4 shadow-sm border-b border-[#2D0B0C]">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#68A8CF] animate-pulse"></span>
          <span className="font-medium tracking-wide">Live Persona Switcher:</span>
          <span className="hidden sm:inline text-[#F8CFC7]">
            Switch roles to test Creator controls, Participant ordering, Pickup Hero alerts & Fakka settlement
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {DEMO_USERS.map((demo) => {
            const isActive = user?.id === demo.id;
            return (
              <button
                key={demo.id}
                onClick={() => switchUser(demo.id)}
                className={`px-2.5 py-1 rounded-full font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#9E2A22] text-white shadow-sm ring-1 ring-[#F3B3A6]'
                    : 'bg-[#2D0B0C] text-[#F8CFC7] hover:bg-[#5E1D1E] hover:text-white'
                }`}
                title={`Switch to ${demo.name} (${demo.role})`}
              >
                <span>{demo.name.split(' ')[0]}</span>
                <span className="opacity-75 text-[10px] hidden md:inline">({demo.role.split(' ')[0]})</span>
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
