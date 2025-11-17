'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';

export default function TelegramSuccessPage({ searchParams }) {
  const router = useRouter();
  const { loginWithToken } = useAuthStore();
  const token = searchParams.token;

  useEffect(() => {
    if (token) {
      loginWithToken(token).then(() => {
        router.push('/');
      });
    }
  }, [token]);

  return <p>Logging you in via Telegram...</p>;
}
