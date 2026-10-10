'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [instapayHandle, setInstapayHandle] = useState(user?.instapayHandle || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setInstapayHandle(user.instapayHandle || '');
      setPhoneNumber(user.phoneNumber || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    try {
      await updateProfile({
        name: name.trim(),
        instapayHandle: instapayHandle.trim() || undefined,
        phoneNumber: phoneNumber.trim() || undefined,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="bg-[#F7EFE9] rounded-xl border border-[#DFCFC5] p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-4 pb-6 border-b border-[#E3D0C7]">
          <div className="w-16 h-16 rounded-xl bg-[#9E2A22] text-white text-2xl font-black flex items-center justify-center shadow-xs">
            {name ? name.charAt(0) : 'U'}
          </div>
          <div>
            <h1 className="text-xl font-black text-[#301314]">Profile & InstaPay Setup</h1>
            <p className="text-xs text-[#73504F] mt-0.5">
              Set your handle so colleagues can pay you instantly via InstaPay
            </p>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-xs font-bold text-[#166534] flex items-center gap-2">
            <span>✓</span> Profile and InstaPay handle successfully updated!
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="user-name" className="text-xs font-bold text-[#301314] block mb-1">
              Full Name *
            </label>
            <input
              id="user-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314]"
            />
          </div>

          <div>
            <label htmlFor="user-email" className="text-xs font-bold text-[#301314] block mb-1">
              Office Email
            </label>
            <input
              id="user-email"
              type="email"
              disabled
              value={user?.email || ''}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] bg-[#FAF4F1] text-sm text-[#73504F] cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="instapay-handle" className="text-xs font-bold text-[#301314] block mb-1">
              InstaPay Address (IPA) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0E4D92]">
                ⚡
              </span>
              <input
                id="instapay-handle"
                type="text"
                placeholder="e.g. karim@instapay"
                value={instapayHandle}
                onChange={(e) => setInstapayHandle(e.target.value)}
                className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#0E4D92] text-sm text-[#301314]"
              />
            </div>
            <p className="text-[11px] text-[#73504F] mt-1">
              Shown to colleagues when settling up so they can 1-click copy and transfer.
            </p>
          </div>

          <div>
            <label htmlFor="phone-number" className="text-xs font-bold text-[#301314] block mb-1">
              Egyptian Phone Number
            </label>
            <input
              id="phone-number"
              type="tel"
              placeholder="01011112222"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#EBDCD7] focus:outline-hidden focus:border-[#9E2A22] text-sm text-[#301314]"
            />
          </div>

          <div className="pt-4 border-t border-[#F6EEEA] flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-[#9E2A22] hover:bg-[#85221B] disabled:opacity-50 text-white text-xs font-bold shadow-md transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
