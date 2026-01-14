'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { Loader2, ShieldCheck, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithToken } = useAuthStore();

  useEffect(() => {
    async function handleAuth() {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        router.push('/auth/login?error=Authentication Failed');
        return;
      }

      if (token) {
        try {
          const user = await loginWithToken(token);
          // Role-based routing aligned with your Technocore logic
          if (user?.role === 'admin') {
            router.push(`/admin/dashboard`);
          } else if (user?.role === 'company') {
            router.push(`/company/dashboard`);
          } else {
            router.push(`/`);
          }
        } catch {
          router.push('/auth/login?error=auth_failed');
        }
      } else {
        router.push('/auth/login?error=no_token');
      }
    }

    handleAuth();
  }, [searchParams, loginWithToken, router]);

  return (
    <div className="h-screen w-full bg-[#fcfdfe] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.02]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center max-w-sm w-full text-center relative z-10"
      >
        {/* Branding Text Replacement for Logo */}
        <div className="mb-10">
          <span className="text-3xl sm:text-4xl font-black tracking-tighter bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent uppercase whitespace-nowrap">
            TECHNOCORE
          </span>
          <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.3em] mt-2">
            System Initialization
          </p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-8 w-full flex flex-col items-center">
          <div className="relative mb-6">
            <Loader2 className="animate-spin h-10 w-10 text-blue-600 relative z-10" />
            <div className="absolute inset-0 h-10 w-10 bg-blue-100 rounded-full blur-xl opacity-40 animate-pulse" />
          </div>

          <h2 className="text-slate-900 font-black text-sm uppercase tracking-widest mb-2">
            Verifying Identity
          </h2>
          <p className="text-slate-400 text-xs font-medium leading-relaxed">
            Synchronizing your node with the <br/> global hardware registry.
          </p>

          <div className="mt-8 pt-6 border-t border-slate-50 w-full flex items-center justify-center gap-3">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secure Session SSL</span>
          </div>
        </div>

        {/* Footer Spec */}
        <div className="mt-10 flex items-center gap-2 opacity-30">
          <Cpu className="w-3 h-3 text-slate-400" />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.4em]">Protocol v4.0.2</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full bg-[#fcfdfe] flex items-center justify-center font-black text-[10px] text-slate-400 uppercase tracking-widest">
        Loading System Interface...
      </div>
    }>
      <AuthCallbackPage />
    </Suspense>
  );
}