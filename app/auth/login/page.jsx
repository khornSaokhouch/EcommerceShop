'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import Link from 'next/link';
import { Mail, Lock, Loader2, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// --- TechnoCore Logo ---
const TechLogoIcon = () => (
  <div className="relative flex items-center justify-center w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl shadow-blue-200">
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 8L3 12L7 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 8L21 12L17 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 4L10 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
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

  return (
    <div className="h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-50 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[30%] h-[30%] rounded-full bg-cyan-50 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10 flex flex-col"
      >
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/5 border border-slate-100 p-8 md:p-12 overflow-y-auto">
          
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <Link href="/"><TechLogoIcon /></Link>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Access Core</h2>
            <p className="text-slate-500 text-sm mt-2 font-medium italic">Secure terminal login for TechnoCore units.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Path</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
                <input 
                  type="text" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Email or Phone" 
                  className="w-full py-4 pl-12 pr-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-slate-900" 
                  required 
                  disabled={loading} 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Security Key</label>
                <Link href="/auth/forgot-password" strokeWidth={2} className="text-[10px] font-bold text-blue-600 hover:underline uppercase tracking-tighter">Lost Access?</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-4 h-4" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full py-4 pl-12 pr-12 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-slate-900" 
                  required 
                  disabled={loading} 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {(localError || error) && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                className="p-3 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 text-red-600 text-xs font-bold"
              >
                <ShieldCheck className="w-4 h-4" /> {localError || error}
              </motion.div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-xl shadow-blue-200 hover:shadow-blue-400 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>Initialize Session <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Social Auth */}
          <div className="mt-10">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative px-4 bg-white text-[10px] font-black text-slate-300 uppercase tracking-widest">External Link</span>
            </div>

            <a 
              href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/redirect`} 
              className="w-full flex items-center justify-center gap-3 py-3.5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083L43.611,20.083L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              <span className="text-xs font-bold text-slate-700">Authorize with Google</span>
            </a>
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs font-medium text-slate-400">
              New to the core?{' '}
              <Link href="/auth/register" className="font-black text-blue-600 hover:text-blue-700 uppercase tracking-tighter">
                Register Unit
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}