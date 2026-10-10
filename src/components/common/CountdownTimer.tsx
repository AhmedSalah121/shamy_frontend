'use client';

import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
  deadline: string;
  className?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({ deadline, className = '' }) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isPassed: boolean;
  }>({ hours: 0, minutes: 0, seconds: 0, isPassed: false });

  useEffect(() => {
    const calculateTime = () => {
      const targetTime = new Date(deadline).getTime();
      const now = Date.now();
      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  if (timeLeft.isPassed) {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold text-[#9E2A22] ${className}`}>
        <span>🔒</span>
        <span>Cutoff Passed</span>
      </span>
    );
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <span className={`inline-flex items-center gap-1 font-mono font-bold ${className}`}>
      <span className="text-[#9E2A22] text-xs">⏳</span>
      <span className="text-[#301314] tracking-tight">
        {timeLeft.hours > 0 ? `${pad(timeLeft.hours)}:` : ''}
        {pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
      </span>
      <span className="text-[10px] text-[#73504F] font-sans font-medium">left</span>
    </span>
  );
};
