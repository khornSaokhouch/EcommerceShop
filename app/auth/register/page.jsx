'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import Link from 'next/link';
import { User, Mail, Lock, Phone, Loader2, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Security keys do not match.');
      return;
    }
    if (password.length < 8) {
      toast.error('Key must be at least 8 characters.');
      return;
    }
    try {
      await register({
        name,
        email,
        phone_number: phoneNumber,
        password,
        password_confirmation: confirmPassword,
      });
      toast.success('Unit Registered Successfully');
      setTimeout(() => router.push('/auth/login'), 500);
    } catch (err) {
      toast.error(err.message || 'Registry initialization failed.');
    }
  };

  return (
    // h-screen and overflow-hidden ensures a single-page view without scrolling
    <div className="h-screen w-full bg-[#fcfdfe] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 p-8 sm:p-10">
          
          {/* Header Section */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <Link href="/" className="flex items-center group">
                <span className="text-xl sm:text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent uppercase whitespace-nowrap">
                  TECHNOCORE
                </span>
              </Link>
            </div>
            <p className="text-slate-400 text-[11px] font-medium uppercase tracking-[0.2em]">
                Register New Hardware Unit
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 w-4 h-4 transition-colors" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full py-3 pl-11 pr-4 bg-slate-50 border border-transparent rounded-2xl text-[13px] font-medium text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 w-4 h-4 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="unit@technocore.com"
                  className="w-full py-3 pl-11 pr-4 bg-slate-50 border border-transparent rounded-2xl text-[13px] font-medium text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 w-4 h-4 transition-colors" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="012 345 678"
                  className="w-full py-3 pl-11 pr-4 bg-slate-50 border border-transparent rounded-2xl text-[13px] font-medium text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 w-4 h-4 transition-colors" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-3 pl-11 pr-11 bg-slate-50 border border-transparent rounded-2xl text-[13px] font-medium text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-400 font-medium uppercase tracking-widest ml-1">Confirm Security Key</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 w-4 h-4 transition-colors" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full py-3 pl-11 pr-11 bg-slate-50 border border-transparent rounded-2xl text-[13px] font-medium text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none"
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full h-14 bg-slate-900 text-white rounded-2xl font-medium text-[13px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.97] shadow-xl mt-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>Register <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>
                )}
              </div>
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-[13px] font-medium text-slate-400">
              Authorized already?{' '}
              <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors ml-1">
                Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}