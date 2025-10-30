'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useResetPasswordStore } from '../stores/useResetPasswordStore';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const { resetPassword, loading, error, success } = useResetPasswordStore();

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation,
      });
      router.push('/auth/login');
    } catch (_) {}
  };

  if (!token || !email) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Invalid reset password link.</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="p-8 sm:p-10 bg-white rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center">Reset Password</h2>
        <p className="text-gray-500 text-center">
          Enter your new password for <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Password field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {/* Confirmation field */}
          <div className="relative">
            <input
              type={showConfirmation ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              className="w-full py-3 px-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmation(!showConfirmation)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              {showConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 disabled:bg-purple-400 transition-colors"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Reset Password'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          <Link href="/auth/login" className="text-purple-600 hover:text-purple-500 font-semibold">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
