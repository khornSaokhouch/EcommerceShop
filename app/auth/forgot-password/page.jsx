'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useResetPasswordStore } from '../../stores/useResetPasswordStore';
import { Mail, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [localError, setLocalError] = useState(null);

  const router = useRouter();
  const { sendResetLink, loading } = useResetPasswordStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    if (!email) {
      setLocalError('Please enter your email.');
      return;
    }

    try {
      const res = await sendResetLink(email);
      // Redirect to reset-password page with token and email
      router.push(`/auth/reset-password?token=${res.token}&email=${encodeURIComponent(email)}`);
    } catch (err) {
      setLocalError(err.message || 'Failed to send reset link.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="p-8 sm:p-10 bg-white rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
        <p className="text-gray-500 text-center">Enter your email to receive a password reset link</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <Mail className="h-5 w-5" />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full py-3 pl-10 pr-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500"
              required
              disabled={loading}
            />
          </div>

          {localError && <p className="text-red-500 text-sm">{localError}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
