import React from 'react';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { OrderProvider } from '@/context/OrderContext';
import { DemoUserBar } from '@/components/common/DemoUserBar';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { Toast } from '@/components/common/Toast';

export const metadata = {
  title: 'Shamy - Egyptian Office Breakfast & Fakka Settlement',
  description: 'Minimal, warm, and collaborative office breakfast ordering with instant Fakka change tracking and pickup hero assignment.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#EFE4DC] text-[#301314] selection:bg-[#F3B3A6] selection:text-[#481617]">
        <AuthProvider>
          <NotificationProvider>
            <OrderProvider>
              <DemoUserBar />
              <Navbar />
              <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
              </main>
              <Footer />
              <Toast />
            </OrderProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
