'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import Link from 'next/link';
import { Mail, Lock, Loader2, Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      const user = res?.user || res?.data?.user || res;
      const token = res?.token || res?.data?.token;
  
      if (!user || !token) throw new Error('Authentication failed.');

      useAuthStore.setState({ user, token });
  
      switch (user.role) {
        case 'admin': router.push('/admin/dashboard'); break;
        case 'company': router.push('/company/dashboard'); break;
        default: router.push('/'); 
      }
    } catch (err) {
      const msg = err?.response?.data?.message === 'Invalid credentials.'
          ? 'Invalid Terminal ID or Security Key.'
          : err?.response?.data?.message || err.message || 'Connection failed.';
      setLocalError(msg);
    }
  };

  return (
    <div className="h-screen w-full bg-[#fcfdfe] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="bg-white rounded-[32px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 p-8 sm:p-10">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Link href="/" className="flex items-center group">
                <span className="text-xl sm:text-2xl tracking-tighter bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent uppercase whitespace-nowrap">
                  TECHNOCORE
                </span>
              </Link>
            </div>
            <p className="text-slate-400 text-[9px] uppercase tracking-[0.3em]">
                Secure Terminal Authorization
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email / Phone Input */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">Email Or Phone Number</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors w-4 h-4" />
                <input 
                  type="text" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="Email or phone node" 
                  className="w-full py-3.5 pl-11 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none" 
                  required 
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-widest">Password</label>
                <Link href="/auth/forgot-password" className="text-[9px] text-blue-600 hover:text-blue-700 uppercase tracking-widest">Reset password</Link>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors w-4 h-4" />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••" 
                  className="w-full py-3.5 pl-11 pr-11 bg-slate-50 border border-transparent rounded-2xl text-sm text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Notification */}
            <div className="min-h-[20px]">
                <AnimatePresence mode="wait">
                    {(localError || error) && (
                    <motion.div 
                        initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="bg-red-50 text-red-600 text-[10px] uppercase tracking-widest py-2 px-3 rounded-lg border border-red-100 flex items-center gap-2"
                    >
                        <ShieldAlert className="w-3.5 h-3.5" /> {localError || error}
                    </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading} 
              className="group relative w-full h-14 bg-slate-900 text-white rounded-2xl text-[10px] uppercase tracking-[0.25em] overflow-hidden transition-all active:scale-[0.97] shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                    <>Login <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" /></>
                )}
              </div>
            </button>
          </form>

          {/* External Auth */}
          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <span className="relative px-3 bg-white text-[9px] text-slate-300 uppercase tracking-widest">External Node</span>
            </div>

            <a 
              href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/redirect`} 
              className="w-full flex items-center justify-center gap-3 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all group"
            >
              <svg className="w-4 h-4 grayscale group-hover:grayscale-0 transition-all" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083L43.611,20.083L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
              </svg>
              <span className="text-[10px] text-slate-700 uppercase tracking-widest">Connect with Google</span>
            </a>
          </div>

          {/* Registration */}
          <div className="mt-8 text-center">
            <p className="text-[10px] text-slate-400">
              New node?{' '}
              <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 uppercase tracking-widest transition-colors ml-1">
                Register 
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
