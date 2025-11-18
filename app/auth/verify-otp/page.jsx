'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { Loader2, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'; // Added motion for entry animation

export default function OtpPage({ destination }) {
  const router = useRouter();
  // Using destructuring to get props/functions from the store
  const { otpUserId, verifyOtp, otpSent, resendOtp } = useAuthStore();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Redirect if no OTP pending
  useEffect(() => {
    // Note: This relies on how otpSent is managed in useAuthStore. 
    // If destination is null/undefined when the component mounts, consider redirecting too.
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

      // Role-based redirection logic
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
    // Setting global loading to prevent double-click or simultaneous form actions
    // Note: The useAuthStore loading state is not used here, so we'll rely on local state.
    setLoading(true); 
    try {
      await resendOtp(otpUserId);
      setResendTimer(60);
      setCanResend(false);
      toast.success('New OTP sent!');
    } catch (err) {
      // Reverting to local state control on error
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = { 
    hidden: { opacity: 0, scale: 0.95 }, 
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } 
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
      <motion.div 
        className="p-8 sm:p-10 bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm space-y-6" // Refined card style
        initial="hidden" 
        animate="visible" 
        variants={cardVariants}
      >
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-800">Two-Step Verification</h2>
            <p className="text-gray-500 text-sm mt-2">
                We sent a 6-digit code to <span className="font-semibold text-gray-700">{destination}</span>
            </p>
        </div>
        
        <form onSubmit={handleVerify} className="space-y-6"> {/* Increased spacing */}
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/, ''))}
            placeholder="Enter OTP"
            // Prominent, centered input style
            className="w-full py-4 px-4 tracking-[1em] text-center font-mono text-xl border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-md"
            required
            disabled={loading}
          />
          
          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading || otp.length < 6}
            // Consistent gradient primary button
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-60 transition font-semibold text-base focus:outline-none focus:ring-4 focus:ring-blue-200"
            whileHover={{ scale: 1.01 }} 
            whileTap={{ scale: 0.99 }}
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Verify Account'}
          </motion.button>
        </form>

        <div className="text-center text-sm mt-6 pt-4 border-t border-gray-100">
          <p className='text-gray-500 mb-2'>Didn't receive the code?</p>
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={loading} // Disable resend while loading/verifying
              className="flex items-center justify-center gap-2 mx-auto text-indigo-600 font-semibold hover:text-indigo-500 transition disabled:text-gray-400 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> 
              Resend Code Now
            </button>
          ) : (
            <p className='text-gray-500 font-medium'>You can resend the code in <span className='text-indigo-600 font-bold'>{resendTimer}</span> seconds.</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}