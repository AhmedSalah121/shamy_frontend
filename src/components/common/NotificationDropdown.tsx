'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import { useNotifications } from '@/context/NotificationContext';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAsRead, refreshNotifications } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-xl bg-[#F7EFE9] border border-[#E3D0C7] shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-[#E3D0C7] flex items-center justify-between bg-[#EFE3DB]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#301314]">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#9E2A22] text-white">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          onClick={refreshNotifications}
          className="text-xs text-[#73504F] hover:text-[#9E2A22] font-semibold transition-colors flex items-center gap-1"
          title="Refresh"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Notification Items */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-[#E3D0C7]">
        {notifications.length === 0 ? (
          <div className="p-8 text-center">
            <span className="text-2xl block mb-1">🔕</span>
            <p className="text-xs font-bold text-[#301314]">No notifications yet</p>
            <p className="text-[11px] text-[#73504F] mt-0.5">
              Alerts for breakfast runs, hero picks & deliveries will appear here.
            </p>
          </div>
        ) : (
          notifications.slice(0, 8).map((notif) => {
            const isUnread = !notif.readAt;
            const dateFormatted = new Date(notif.createdAt).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={notif.id}
                className={`p-3 text-xs flex items-start gap-3 transition-colors ${
                  isUnread ? 'bg-[#F2DFD7]/60' : 'hover:bg-[#EFE3DB]/50'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#EFE3DB] border border-[#E3D0C7] flex items-center justify-center text-sm shrink-0">
                  {notif.type === 'ORDER_ARRIVED'
                    ? '🛵'
                    : notif.type === 'HERO_SELECTED'
                    ? '🦸‍♂️'
                    : notif.type === 'ORDER_SETTLING'
                    ? '💰'
                    : '🔔'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h5 className="font-bold text-[#301314] text-xs truncate">{notif.title}</h5>
                    <span className="text-[10px] text-[#9D7B7A] shrink-0">{dateFormatted}</span>
                  </div>
                  <p className="text-[#73504F] text-[11px] mt-0.5 line-clamp-2 leading-snug">
                    {notif.message}
                  </p>

                  <div className="mt-1.5 flex items-center gap-3">
                    {notif.orderId && (
                      <Link
                        href={`/orders/${notif.orderId}`}
                        onClick={onClose}
                        className="text-[11px] font-bold text-[#0E4D92] hover:text-[#9E2A22] transition-colors"
                      >
                        View Order #{notif.orderId} ➔
                      </Link>
                    )}
                    {isUnread && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-[10px] font-semibold text-[#9E2A22] hover:underline"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[#EFE3DB] border-t border-[#E3D0C7] text-center">
        <Link
          href="/notifications"
          onClick={onClose}
          className="text-xs font-bold text-[#9E2A22] hover:text-[#85221B] transition-colors"
        >
          View all notifications →
        </Link>
      </div>
    </div>
  );
};
