'use client';

import { useEffect } from 'react';
import { useUserStore } from '../../stores/userStore';
import Image from 'next/image';
import Link from 'next/link';
import { 
  User, Mail, Phone, Calendar, ShieldCheck, 
  Loader2, Edit, Cpu, Zap, Lock 
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminProfilePage() {
  const { user, loading, fetchUser } = useUserStore();

  useEffect(() => { 
    fetchUser(); 
  }, [fetchUser]);

  const getCleanImageUrl = (url) => {
    if (!url) return null;
    const lastHttpIndex = url.lastIndexOf('http');
    return lastHttpIndex > 0 ? url.substring(lastHttpIndex) : url;
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px] gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        <p className="text-[13px] font-medium text-slate-500 uppercase tracking-[0.3em]">Accessing Identity Node...</p>
      </div>
    );
  }

  const currentImageUrl = getCleanImageUrl(user.profile_image_url);
  const userInitial = user.name ? user.name[0].toUpperCase() : "A";

  return (
    <div className="p-4 sm:p-8 animate-in fade-in duration-700">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[13px] font-medium uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <Cpu className="w-3 h-3" /> System Terminal
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            Admin <span className="text-blue-600">Identity</span>
          </h1>
        </div>
        
        <Link
          href="/admin/edit-profile"
          className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[13px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl flex items-center gap-2"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Edit className="w-3.5 h-3.5 relative z-10" />
          <span className="relative z-10">Modify Identity</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. IDENTITY CARD (Left Column) */}
        <div className="lg:col-span-4">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 opacity-20 blur-3xl rounded-full -mr-32 -mt-32" />
            
            <div className="relative w-36 h-36 rounded-[40px] p-1 bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-xl mb-6">
              <div className="w-full h-full rounded-[36px] overflow-hidden bg-white flex items-center justify-center border-4 border-slate-900 relative">
                {currentImageUrl ? (
                  <Image src={currentImageUrl} alt="Avatar" fill className="object-cover" />
                ) : (
                  <span className="text-4xl font-black text-blue-600">{userInitial}</span>
                )}
              </div>
            </div>

            <span className="text-[13px] font-medium text-blue-400 uppercase tracking-widest mb-1">Lead Administrator</span>
            <h2 className="text-2xl font-black uppercase tracking-tight mb-2">{user.name}</h2>
            <p className="text-[13px] text-slate-400 font-medium mb-6">{user.email}</p>

            <div className="w-full pt-6 border-t border-white/10 flex justify-center gap-6">
              <div className="text-center">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Access Level</p>
                <div className="flex items-center justify-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[13px] font-medium uppercase tracking-wider">Root</span>
                </div>
              </div>
              <div className="w-px bg-white/10" />
              <div className="text-center">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">Status</p>
                <div className="flex items-center justify-center gap-1.5 text-cyan-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-[13px] font-medium uppercase tracking-wider">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. DETAILS GRID (Right Column) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-slate-100 shadow-sm h-full">
            <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
              <User className="w-3.5 h-3.5" /> Identity Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12">
              <DetailItem 
                icon={User} 
                label="Full Name" 
                value={user.name} 
              />
              <DetailItem 
                icon={Mail} 
                label="Registry Email" 
                value={user.email} 
              />
              <DetailItem 
                icon={Phone} 
                label="Terminal Phone" 
                value={user.phone_number || "Node Offline (Not Set)"} 
              />
              <DetailItem 
                icon={Calendar} 
                label="System Join Date" 
                value={new Date(user.created_at).toLocaleDateString()} 
              />
            </div>

            <div className="mt-12 pt-8 border-t border-slate-50">
              <div className="flex items-center gap-3 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-sm shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-emerald-800 uppercase tracking-widest mb-0.5">Secure Terminal Node</p>
                  <p className="text-[11px] font-medium text-emerald-600">AES-256 Bit Encryption enabled on this identity session.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENT: DETAIL ITEM ---
function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="group">
      <div className="flex items-center gap-2 text-slate-400 mb-1.5">
        <Icon size={14} />
        <p className="text-[11px] font-bold uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-[13px] font-medium text-slate-900 tracking-tight">{value}</p>
    </div>
  );
}