'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../stores/userStore';

export default function TelegramLoginPopup() {
  const router = useRouter();
  const telegramLogin = useUserStore((state) => state.telegramLogin);

  // Define global function so Telegram widget can call it
  useEffect(() => {
    // Make our login handler global
    window.handleTelegramLogin = async function(user) {
      try {
        await telegramLogin(user); // call your zustand store function
        router.push('/orders');
      } catch (err) {
        console.error(err);
        alert('Telegram login failed');
      }
    };
  }, [telegramLogin, router]);
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-xl text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Login with Telegram</h2>
        <p className="text-gray-500 mb-6">
          To view your orders, please login with Telegram.
        </p>

        {/* Telegram Web Login Button */}
        <div
          className="telegram-login-button"
          dangerouslySetInnerHTML={{
            __html: `
              <script async src="https://telegram.org/js/telegram-widget.js?15"
                data-telegram-login="${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME}"
                data-size="large"
                data-userpic="false"
                data-auth-url="${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/telegram/callback"
                data-request-access="write"
                data-onauth="handleTelegramLogin(user)">
              </script>
            `
          }}
        />
      </div>
    </div>
  );
}
