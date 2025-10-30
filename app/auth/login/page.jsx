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
      <linearGradient id="loginLogoGradient" x1="12" y1="20" x2="28" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0EA5E9" />
        <stop offset="1" stopColor="#3B82F6" />
      </linearGradient>
    </defs>
    <path d="M12 10H28" stroke="url(#loginLogoGradient)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M20 10V30" stroke="url(#loginLogoGradient)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M16 30C16 27.7909 17.7909 26 20 26C22.2091 26 24 27.7909 24 30" stroke="url(#loginLogoGradient)" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const { login, error, loading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);

    try {
      const res = await login(email, password);

      if (res?.otpSent && res?.user_id) {
        router.push(`/auth/verify-otp?user_id=${res.user_id}&destination=${encodeURIComponent(email)}`);
        return;
      }

      const user = res?.user;
      if (!user) throw new Error('Invalid login response.');

      switch (user.role) {
        case 'admin':
          router.push(`/admin/dashboard`);
          break;
        case 'company':
          router.push(`/company/dashboard`);
          break;
        default:
          router.push(`/`);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message === 'Invalid credentials.'
          ? 'Invalid email or password.'
          : err?.response?.data?.message || err.message || 'Login failed.';

      setLocalError(msg);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 font-sans text-gray-800 overflow-hidden">
      <motion.div 
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl flex overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={formVariants}
      >
        {/* Left Image */}
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('/auth-background.jpg')" }} />

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-10">
          {/* Header */}
          <div className="text-center mb-6">
            <Link href="/" className="inline-flex items-center justify-center gap-2 mb-2">
              <TechLogoIcon className="h-9 w-9" />
              <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 to-blue-600 text-transparent bg-clip-text">
                E-COMMERCES
              </span>
            </Link>
            <h2 className="text-2xl font-bold text-gray-800 mt-2">Sign in to your account</h2>
            <p className="text-gray-500 text-sm mt-1">Welcome back! Please enter your details.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
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
                  className="w-full py-2.5 pl-9 pr-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 text-sm bg-gray-50"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
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
                  className="w-full py-2.5 pl-9 pr-9 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 text-sm bg-gray-50"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="text-right mt-2">
                <Link href="/auth/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-800 transition">
                  Forgot Password?
                </Link>
              </div>
            </div>

            {(localError || error) && <p className="text-red-500 text-sm">{localError || error}</p>}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-5"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              {loading ? 'Signing In...' : 'Sign In'}
            </motion.button>
          </form>

          {/* OR divider & Google login */}
          <div className="flex items-center justify-center space-x-3 text-gray-400 text-sm my-4">
            <span className="border-t border-gray-200 flex-grow"></span>
            <span>OR</span>
            <span className="border-t border-gray-200 flex-grow"></span>
          </div>

          <div className="text-center">
            <a
              href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/redirect`}
              className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 48 48">
                <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
              </svg>
              Login with Google
            </a>
          </div>

          <p className="text-center text-sm text-gray-500 mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-800 transition">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
