"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Search, Bell, Clock, Menu, User, 
  ChevronDown, Globe, Settings, LogOut, ShieldCheck 
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function Header({ user, onMenuButtonClick, onLogoutClick }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isLanguageOpen, setLanguageOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const imageUrl = user?.profile_image_url?.includes('http') 
    ? user.profile_image_url.substring(user.profile_image_url.lastIndexOf('http')) 
    : null;

  return (
    <header className="h-20 bg-white border-b border-slate-100 px-6 flex items-center justify-between shrink-0 relative z-40">
      
      {/* LEFT: Search */}
      <div className="flex items-center gap-4 flex-1">
        <button onClick={onMenuButtonClick} className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-xl">
          <Menu size={20} />
        </button>
        <div className="relative hidden md:block max-w-sm w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search Registry..." 
            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-2.5 pl-11 pr-4 text-[13px] font-medium text-slate-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
          />
        </div>
      </div>

      {/* RIGHT: Dropdowns */}
      <div className="flex items-center gap-4">
        
        {/* Language Selector */}
        <div className="relative">
          <button onClick={() => { setLanguageOpen(!isLanguageOpen); setProfileOpen(false); }} className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-50">
            <Globe size={18} className="text-slate-400" />
            <span className="hidden sm:block text-[13px] font-medium text-slate-500 uppercase tracking-widest">EN</span>
            <ChevronDown size={14} className={`text-slate-300 transition-transform ${isLanguageOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {isLanguageOpen && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-[24px] shadow-2xl p-2 z-50">
                <button className="flex items-center justify-between w-full p-3 rounded-xl hover:bg-blue-50 text-blue-600 font-medium text-[13px]">English <ShieldCheck size={14} /></button>
                <button className="flex items-center w-full p-3 rounded-xl hover:bg-slate-50 text-slate-500 font-medium text-[13px]">Khmer (KH)</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-slate-100 hidden sm:block" />

        {/* Profile Dropdown */}
        <div className="relative">
          <button onClick={() => { setProfileOpen(!isProfileOpen); setLanguageOpen(false); }} className="flex items-center gap-3 p-1 rounded-2xl hover:bg-slate-50">
            <div className="relative w-9 h-9 rounded-xl p-0.5 bg-gradient-to-tr from-blue-600 to-cyan-400">
               <div className="w-full h-full rounded-[10px] overflow-hidden bg-white flex items-center justify-center border-2 border-white relative">
                  {imageUrl ? <Image src={imageUrl} alt="Admin" fill className="object-cover" /> : <User size={18} className="text-blue-600" />}
               </div>
            </div>
            <ChevronDown size={14} className={`text-slate-300 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>
            {isProfileOpen && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-[28px] shadow-2xl overflow-hidden z-50">
                <div className="p-5 bg-slate-50/50 border-b border-slate-100 flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">{user?.name?.[0] || 'A'}</div>
                   <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 uppercase truncate">{user?.name || "Lead Admin"}</p>
                      <p className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">Root Access</p>
                   </div>
                </div>
                <div className="p-2">
                  <Link href="/admin/account" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 text-slate-500 font-medium text-[13px]"><User size={16} /> Profile Info</Link>
                  <Link href="/admin/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-slate-50 text-slate-500 font-medium text-[13px]"><Settings size={16} /> Config Settings</Link>
                  <div className="h-px bg-slate-50 my-1 mx-2" />
                  <button onClick={() => { setProfileOpen(false); onLogoutClick(); }} className="flex items-center gap-3 w-full p-3 rounded-xl hover:bg-red-50 text-red-500 font-medium text-[13px] transition-colors"><LogOut size={16} /> Logout Account</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}