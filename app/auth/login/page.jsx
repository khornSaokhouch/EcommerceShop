'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import Link from 'next/link';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const TechLogoIcon = (props) => (
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      {/* Updated gradient for a slightly deeper, more vibrant blue/indigo */}
      <linearGradient id="loginLogoGradient" x1="12" y1="20" x2="28" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0EA5E9" /> {/* Sky-500 */}
        <stop offset="1" stopColor="#4F46E5" /> {/* Indigo-600 */}
      </linearGradient>
    </defs>
    <path d="M12 10H28" stroke="url(#loginLogoGradient)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M20 10V30" stroke="url(#loginLogoGradient)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M16 30C16 27.7909 17.7909 26 20 26C22.2091 26 24 27.7909 24 30" stroke="url(#loginLogoGradient)" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  // Removed telegramLogin from destructured items
  const { login, error, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  // Email/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      const res = await login(email, password);
      
      // Handle OTP flow
      if (res?.otpSent && res?.user_id) {
        router.push(`/auth/verify-otp?user_id=${res.user_id}&destination=${encodeURIComponent(email)}`);
        return;
      }
      
      const user = res?.user;
      if (!user) throw new Error('Invalid login response.');
      
      // Handle role-based redirection
      switch (user.role) {
        case 'admin': router.push(`/admin/dashboard`); break;
        case 'company': router.push(`/company/dashboard`); break;
        default: router.push(`/`);
      }
    } catch (err) {
      const msg = err?.response?.data?.message === 'Invalid credentials.'
        ? 'Invalid email or password.'
        : err?.response?.data?.message || err.message || 'Login failed.';
      setLocalError(msg);
    }
  };

  // Removed useEffect for Telegram Widget

  const formVariants = { 
    hidden: { opacity: 0, scale: 0.95 }, 
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } } 
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 font-sans text-gray-800">
      
      {/* Centered, elevated card */}
      <motion.div 
        className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-100" 
        initial="hidden" 
        animate="visible" 
        variants={formVariants}
      >
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-2">
            <TechLogoIcon className="h-10 w-10" />
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 to-indigo-600 text-transparent bg-clip-text">E-COMMERCES</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-800 mt-4">Sign in to your account</h2>
          <p className="text-gray-500 text-sm mt-1">Access your dashboard and manage your orders.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email input (Refined Style) */}
          <div>
            <label htmlFor="email" className="sr-only">Email or Phone</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                id="email" 
                type="text" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Email or Phone" 
                // Cleaner input style
                className="w-full py-3 pl-10 pr-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400 text-sm bg-white" 
                required 
                disabled={loading} 
              />
            </div>
          </div>

          {/* Password input (Refined Style) */}
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input 
                id="password" 
                type={showPassword ? 'text' : 'password'} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Password" 
                // Cleaner input style
                className="w-full py-3 pl-10 pr-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition placeholder-gray-400 text-sm bg-white" 
                required 
                disabled={loading} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer" 
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="text-right mt-2">
              <Link href="/auth/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition">Forgot Password?</Link>
            </div>
          </div>

          {(localError || error) && <p className="text-red-500 text-sm text-center font-medium mt-3">{localError || error}</p>}

          {/* Submit Button (Refined Gradient and Hover) */}
          <motion.button 
            type="submit" 
            disabled={loading} 
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-3 rounded-xl hover:shadow-lg hover:shadow-blue-500/50 disabled:opacity-60 transition font-semibold text-base focus:outline-none focus:ring-4 focus:ring-blue-200 mt-6" 
            whileHover={{ scale: 1.01 }} 
            whileTap={{ scale: 0.99 }}
          >
            {loading && <Loader2 className="animate-spin h-5 w-5" />}
            {loading ? 'Signing In...' : 'Sign In'}
          </motion.button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center justify-center space-x-3 text-gray-400 text-sm my-6">
          <span className="border-t border-gray-200 flex-grow"></span>
          <span>OR CONTINUE WITH</span>
          <span className="border-t border-gray-200 flex-grow"></span>
        </div>

        {/* Third-party logins */}
        <div className="flex flex-col gap-3">
          {/* Google login (Refined Button) */}
          <a 
            href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/redirect`} 
            className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 48 48">
              <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
            </svg>
            Login with Google
          </a>
        </div>

        {/* Register Link */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/auth/register" className="font-semibold text-blue-600 hover:text-blue-700 transition">
            Register Here
          </Link>
        </p>
      </motion.div>
    </div>
  );
}