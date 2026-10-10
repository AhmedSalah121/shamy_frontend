'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationItem } from '@/types';
import { notificationService } from '@/services/notificationService';
import { socketService } from '@/services/socketService';

interface ToastAlert {
  id: string;
  title: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'arrival';
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  activeToast: ToastAlert | null;
  clearToast: () => void;
  markAsRead: (id: number) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  playArrivalChime: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  activeToast: null,
  clearToast: () => {},
  markAsRead: async () => {},
  refreshNotifications: async () => {},
  playArrivalChime: () => {},
});

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeToast, setActiveToast] = useState<ToastAlert | null>(null);

  // Gentle, warm web audio chime synthesizer
  const playArrivalChime = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // Soft musical chords (warm marimba-style bell)
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + idx * 0.12 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 0.9);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.0);
      });
    } catch {
      // Audio play blocked or not supported
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    try {
      const list = await notificationService.getNotifications();
      setNotifications(list);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    refreshNotifications();

    // Listen to real-time socket events
    const unsubArrived = socketService.on('order_arrived', (payload) => {
      playArrivalChime();
      setActiveToast({
        id: String(Date.now()),
        title: '🥐 Order Arrived!',
        message: payload.message,
        type: 'arrival',
      });
      refreshNotifications();
    });

    const unsubHero = socketService.on('pickup_hero_selected', (payload) => {
      setActiveToast({
        id: String(Date.now()),
        title: '🦸‍♂️ Pickup Hero Selected!',
        message: payload.message,
        type: 'info',
      });
      refreshNotifications();
    });

    const unsubNotif = socketService.on('new_notification', (payload) => {
      setNotifications((prev) => [payload, ...prev]);
      setActiveToast({
        id: String(payload.id),
        title: payload.title,
        message: payload.message,
        type: 'info',
      });
    });

    return () => {
      unsubArrived();
      unsubHero();
      unsubNotif();
    };
  }, [playArrivalChime, refreshNotifications]);

  const markAsRead = async (id: number) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
  };

  const clearToast = () => setActiveToast(null);

  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeToast,
        clearToast,
        markAsRead,
        refreshNotifications,
        playArrivalChime,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
