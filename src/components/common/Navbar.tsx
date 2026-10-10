'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationDropdown } from './NotificationDropdown';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#F4EBE4]/95 backdrop-blur-md border-b border-[#DFCFC5] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-9 h-9 rounded-xl bg-[#9E2A22] text-[#FAF4F1] flex items-center justify-center font-bold text-base shadow-xs group-hover:bg-[#85221B] transition-colors">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
            </span>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-[#301314]">Shamy</span>
              <p className="text-[10px] text-[#73504F] -mt-0.5 font-medium">Egyptian Office Breakfast</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1 pl-4 border-l border-[#DFCFC5]">
            <Link
              href="/"
              className="px-3 py-1.5 text-sm font-medium text-[#301314] hover:text-[#9E2A22] hover:bg-[#EAE0D8] rounded-xl transition-colors"
            >
              Active Orders
            </Link>
            <Link
              href="/orders/new"
              className="px-3 py-1.5 text-sm font-medium text-[#73504F] hover:text-[#9E2A22] hover:bg-[#EAE0D8] rounded-xl transition-colors"
            >
              Start Breakfast Run
            </Link>
          </nav>
        </div>

        {/* User & Actions */}
        <div className="flex items-center gap-3">
          {/* Notifications Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              aria-label="Toggle notifications dropdown"
              aria-expanded={isNotifOpen}
              className={`relative p-2 rounded-xl text-[#73504F] hover:text-[#9E2A22] hover:bg-[#EAE0D8] transition-colors border ${
                isNotifOpen ? 'bg-[#EAE0D8] border-[#DFCFC5] text-[#9E2A22]' : 'border-transparent'
              }`}
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#9E2A22] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Component */}
            <NotificationDropdown
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
            />
          </div>

          {/* New Order CTA */}
          <Link
            href="/orders/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#9E2A22] text-white text-xs font-semibold shadow-xs hover:bg-[#85221B] transition-colors"
          >
            <span>+</span> Start Run
          </Link>

          {/* Active User Chip */}
          {user && (
            <Link
              href="/profile"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-xl bg-[#EAE0D8] border border-[#DFCFC5] hover:border-[#9E2A22] transition-colors group"
            >
              <div className="w-7 h-7 rounded-lg bg-[#9E2A22] text-white text-xs font-bold flex items-center justify-center shrink-0">
                {user.name.charAt(0)}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-[#301314] leading-tight group-hover:text-[#9E2A22] transition-colors">
                  {user.name.split(' ')[0]}
                </p>
                {user.instapayHandle && (
                  <p className="text-[10px] text-[#0E4D92] font-semibold leading-tight flex items-center gap-0.5">
                    <span>⚡</span> {user.instapayHandle}
                  </p>
                )}
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
