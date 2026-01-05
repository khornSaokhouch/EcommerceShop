'use client'; // ✅ Client-only

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: 'rounded-2xl border border-white/20 backdrop-blur-md font-sans text-sm',
        duration: 4000,
        style: {
          background: 'rgba(255, 255, 255, 0.8)',
          color: '#0f172a',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)',
        },
        success: {
          iconTheme: {
            primary: '#2563eb',
            secondary: '#ffffff',
          },
        },
      }}
    />
  );
}
