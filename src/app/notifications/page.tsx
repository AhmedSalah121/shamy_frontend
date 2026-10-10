'use client';

import React from 'react';
import Link from 'next/link';
import { useNotifications } from '@/context/NotificationContext';

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, refreshNotifications } = useNotifications();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#301314]">Notifications</h1>
          <p className="text-xs text-[#73504F] mt-0.5">
            Real-time updates on breakfast runs, hero draws & arrival alerts
          </p>
        </div>

        <button
          onClick={refreshNotifications}
          className="px-3 py-1.5 rounded-xl border border-[#DFCFC5] bg-[#EAE0D8] text-xs font-semibold text-[#73504F] hover:text-[#9E2A22] hover:bg-[#DFCFC5] transition-colors"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="bg-[#F7EFE9] rounded-xl border border-[#DFCFC5] p-6 shadow-xs">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl block mb-2">🔕</span>
            <p className="text-sm font-bold text-[#301314]">No notifications yet</p>
            <p className="text-xs text-[#73504F] mt-1">
              You will receive alerts here when orders arrive or when you are chosen as the Pickup Hero!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#E3D0C7]">
            {notifications.map((notif) => {
              const isUnread = !notif.readAt;
              const dateFormatted = new Date(notif.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={notif.id}
                  className={`py-4 flex items-start gap-4 transition-colors ${
                    isUnread ? 'bg-[#F2DFD7]/60 -mx-4 px-4 rounded-xl' : ''
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EFE3DB] border border-[#DFCFC5] flex items-center justify-center text-lg shrink-0">
                    {notif.type === 'ORDER_ARRIVED'
                      ? '🛵'
                      : notif.type === 'HERO_SELECTED'
                      ? '🦸‍♂️'
                      : notif.type === 'ORDER_SETTLING'
                      ? '💰'
                      : '🔔'}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#301314]">{notif.title}</h4>
                      <span className="text-[10px] text-[#9D7B7A] shrink-0">{dateFormatted}</span>
                    </div>

                    <p className="text-xs text-[#73504F] mt-1 leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="mt-2 flex items-center gap-3">
                      {notif.orderId && (
                        <Link
                          href={`/orders/${notif.orderId}`}
                          className="text-xs font-bold text-[#0E4D92] hover:underline"
                        >
                          View Order #{notif.orderId} ➔
                        </Link>
                      )}

                      {isUnread && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-[11px] font-semibold text-[#9E2A22] hover:underline"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
