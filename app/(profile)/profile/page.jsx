'use client';

import { useEffect } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Loader2, Package, Heart, Shield, Edit, User, Mail, Phone, MapPin, ChevronRight, Verified, LayoutDashboard
} from 'lucide-react';
import { useFavouritesStore } from '../../stores/useFavouritesStore';
import { motion } from 'framer-motion';

const springEntry = { type: "spring", damping: 25, stiffness: 120 };

export default function MyProfilePage() {
  const { id } = useParams();
  const { user, loading, error, fetchUserById } = useUserStore();
  const { favourites, fetchFavourites } = useFavouritesStore();

  useEffect(() => {
    if (user?.id) {
      fetchFavourites(user.id);
    }
  }, [user?.id, fetchFavourites]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px] gap-4">
        <div className="relative">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 opacity-20" />
            <Loader2 className="animate-spin h-12 w-12 text-blue-600 absolute inset-0 [animation-delay:0.2s]" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Syncing Registry...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px] p-6 text-center">
        <div className="w-20 h-20 bg-white/50 backdrop-blur-xl border border-red-100 text-red-500 rounded-[32px] flex items-center justify-center mb-6 shadow-xl shadow-red-500/5">
          <Shield className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">System Link Error</h2>
        <p className="text-slate-500 text-sm max-w-xs mb-8 font-medium leading-relaxed">
          The hardware registry node failed to synchronize. Verify your connection.
        </p>
        <button 
           onClick={() => window.location.reload()}
           className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-90"
        >
          Re-initialize Link
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={springEntry}
      className="p-6 sm:p-10 space-y-12"
    >
      
      {/* --- 1. HERO HEADER (LIQUID STYLE) --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-600/10 backdrop-blur-md text-blue-600 text-[9px] font-black uppercase tracking-[0.2em] rounded-lg border border-blue-600/20 shadow-sm">
              Node Active
            </span>
            <Verified className="w-4 h-4 text-blue-500 fill-blue-500/10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
            {user.name}
          </h1>
          <p className="text-slate-400 font-medium text-sm flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" /> {user.email}
          </p>
        </div>
        
        <Link
          href="/edit-profile"
          className="
            group flex items-center justify-center gap-3 px-8 py-4 
            bg-white border border-slate-200 text-slate-900 rounded-2xl 
            hover:bg-blue-600 hover:text-white hover:border-blue-600 
            transition-all duration-500 ease-[0.23,1,0.32,1] 
            font-black text-[10px] uppercase tracking-widest
            shadow-sm hover:shadow-xl hover:shadow-blue-500/20 active:scale-95
          "
        >
          <Edit className="w-4 h-4" />
          Edit Interface
        </Link>
      </div>

      {/* --- 2. QUICK ACTIONS (SQUISHY CARDS) --- */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <LayoutDashboard className="w-4 h-4 text-slate-400" />
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Sub-System Overview</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard 
            icon={Package} 
            label="Total Orders" 
            value={user.orderCount || '0'} 
            color="blue" 
            href="/profile/orders"
          />
          <StatCard 
            icon={Heart} 
            label="Wishlist Items" 
            value={favourites?.length || 0} 
            color="pink" 
            href="/favorites"
          />
          <StatCard 
            icon={Shield} 
            label="Security Level" 
            value="High" 
            color="emerald" 
            href="/security"
          />
        </div>
      </section>

      {/* --- 3. IDENTITY DETAILS (GLASS PANE) --- */}
      <section className="bg-slate-50/50 rounded-[40px] p-2 border border-slate-100">
        <div className="bg-white/80 backdrop-blur-xl rounded-[36px] p-8 sm:p-10 shadow-sm border border-white">
          <h3 className="text-sm font-black text-slate-900 mb-10 uppercase tracking-widest flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 border border-blue-600/20 backdrop-blur-md">
               <User className="w-5 h-5" />
            </div>
            Identity Registry
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-16">
            <InfoItem label="Full Name" value={user.name} icon={User} />
            <InfoItem label="Email Address" value={user.email} icon={Mail} />
            <InfoItem label="Node Terminal" value={user.phone_number || "Disconnected"} icon={Phone} />
            <InfoItem 
              label="Shipping Hub" 
              value="Manage Locations" 
              icon={MapPin} 
              isLink 
              href="/addresses" 
            />
          </div>
        </div>
      </section>

    </motion.div>
  );
}

// --- SUB-COMPONENTS (LIQUID GLASS STYLE) ---

function StatCard({ icon: Icon, label, value, color, href }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-600/10 border-blue-600/20 shadow-blue-500/5",
    pink: "text-pink-600 bg-pink-600/10 border-pink-600/20 shadow-pink-500/5",
    emerald: "text-emerald-600 bg-emerald-600/10 border-emerald-600/20 shadow-emerald-500/5"
  };

  return (
    <Link href={href} className="group active:scale-95 transition-transform duration-500">
      <div className="
        bg-white/60 backdrop-blur-xl p-7 rounded-[32px] border border-white 
        shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-700
        group-hover:bg-white group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)]
        relative overflow-hidden
      ">
        <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 border ${colorMap[color]}`}>
          <Icon className="w-7 h-7" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 opacity-70">{label}</p>
        <div className="flex items-end justify-between">
          <h4 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">{value}</h4>
          <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center transition-all group-hover:bg-blue-600 group-hover:text-white">
            <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function InfoItem({ label, value, icon: Icon, isLink, href }) {
  const content = (
    <div className="group transition-all">
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
        <Icon className="w-3 h-3 text-blue-500" /> {label}
      </p>
      <p className={`
        text-[15px] font-bold transition-all duration-300
        ${isLink 
          ? "text-blue-600 hover:text-blue-800 underline underline-offset-8 decoration-blue-200" 
          : "text-slate-800"
        }
      `}>
        {value}
      </p>
    </div>
  );

  return isLink ? <Link href={href} className="block active:scale-95 transition-transform">{content}</Link> : content;
}