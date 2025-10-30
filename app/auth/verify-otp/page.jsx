'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function OtpPage({ destination }) {
  const router = useRouter();
  const { otpUserId, verifyOtp, otpSent, resendOtp } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Redirect if no OTP pending
  useEffect(() => {
    if (!otpSent) router.push('/auth/login');
  }, [otpSent, router]);

  // Countdown for resend button
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendTimer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await verifyOtp(otp);
      const verifiedUser = res.user;

      toast.success('OTP Verified Successfully!');

      switch (verifiedUser.role) {
        case 'admin':
          router.push('/admin/dashboard');
          break;
        case 'company':
          router.push('/company/dashboard');
          break;
        default:
          router.push('/');
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError('');
    setLoading(true);
    try {
      await resendOtp(otpUserId);
      setResendTimer(60);
      setCanResend(false);
      toast.success('OTP Resent Successfully!');
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
      <div className="p-8 sm:p-10 bg-white rounded-3xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-bold text-center text-gray-800">Verify OTP</h2>
        <p className="text-gray-500 text-center">
          Enter the 6-digit OTP sent to <span className="font-semibold">{destination}</span>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/, ''))} // numeric only
            placeholder="Enter OTP"
            className="w-full py-3 px-4 border border-gray-300 rounded-xl text-center text-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            required
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full flex justify-center items-center gap-2 bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 disabled:bg-purple-400 transition"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify OTP'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-4">
          {canResend ? (
            <button
              onClick={handleResend}
              className="flex items-center justify-center gap-2 mx-auto text-purple-600 font-semibold hover:text-purple-500"
            >
              <RefreshCw className="h-4 w-4 animate-spin-slow" /> Resend OTP
            </button>
          ) : (
            <span>Resend OTP in {resendTimer}s</span>
          )}
        </div>
      </div>
    </div>
  );
}
