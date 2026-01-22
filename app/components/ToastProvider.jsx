'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Technical Spec Styling
        className: 'rounded-[20px] border border-slate-100 bg-white font-sans text-[11px] font-black uppercase tracking-widest shadow-2xl px-6 py-4',
        duration: 4000,
        style: {
          background: '#ffffff',
          color: '#0f172a',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.08)',
          border: '1px solid #f1f5f9',
          padding: '16px 24px',
        },
        success: {
          iconTheme: {
            primary: '#2563eb', // Technocore Blue
            secondary: '#ffffff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444', // Alert Red
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}