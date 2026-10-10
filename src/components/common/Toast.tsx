'use client';

import React, { useEffect, useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';

const TOAST_DURATION_MS = 5000;

export const Toast: React.FC = () => {
  const { activeToast, clearToast } = useNotifications();
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!activeToast) {
      setProgress(100);
      return;
    }

    setProgress(100);
    const startTime = Date.now();
    const interval = 50;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const remainingPercent = Math.max(0, 100 - (elapsed / TOAST_DURATION_MS) * 100);
      setProgress(remainingPercent);

      if (elapsed >= TOAST_DURATION_MS) {
        clearInterval(timer);
        clearToast();
      }
    }, interval);

    return () => clearInterval(timer);
  }, [activeToast, clearToast]);

  if (!activeToast) return null;

  const isArrival = activeToast.type === 'arrival';

  return (
    <aside
      aria-label="Live notification alert"
      className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-[#301314] text-[#EFE4DC] rounded-xl shadow-2xl border border-[#9E2A22]/50 overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Live pulsing badge icon */}
          <div className="relative shrink-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-inner ${
              isArrival 
                ? 'bg-[#9E2A22] text-white ring-2 ring-[#BD5346]/50' 
                : 'bg-[#481617] text-[#FAF4F1] border border-[#5C1F20]'
            }`}>
              {isArrival ? '🛵' : '🔔'}
            </div>
            {/* Live Indicator Dot */}
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#BD5346] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#9E2A22] ring-2 ring-[#301314]"></span>
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#9E2A22] text-white">
                Live Alert
              </span>
              <h4 className="text-sm font-bold text-white truncate">
                {activeToast.title}
              </h4>
            </div>
            <p className="text-xs text-[#D8C5BC] mt-1 line-clamp-2 leading-relaxed">
              {activeToast.message}
            </p>
          </div>

          <button
            onClick={clearToast}
            aria-label="Dismiss alert"
            className="text-[#BCA59C] hover:text-white p-1 rounded-md transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Live running countdown progress bar */}
      <div className="w-full bg-[#481617] h-1">
        <div
          className="bg-gradient-to-r from-[#9E2A22] via-[#BD5346] to-[#F3B3A6] h-full transition-all ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </aside>
  );
};
