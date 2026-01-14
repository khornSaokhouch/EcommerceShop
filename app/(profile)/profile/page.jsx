'use client';

import { useEffect } from 'react';
import { useUserStore } from '../../stores/userStore';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Loader2, 
  Package, 
  Heart, 
  Shield, 
  Edit, 
  User, 
  Mail, 
  Phone, 
  MapPin,
  ChevronRight,
  Verified
} from 'lucide-react';
import { useFavouritesStore } from '../../stores/useFavouritesStore';
import { motion } from 'framer-motion';

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
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
        <p className="text-sm font-bold text-slate-400 animate-pulse uppercase tracking-widest">Loading Account</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px] p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 mb-2">Profile Error</h2>
        <p className="text-slate-500 text-sm max-w-xs mb-6">
          We couldn't retrieve your profile data. This might be a connection issue.
        </p>
        <button 
           onClick={() => window.location.reload()}
           className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 space-y-10">
      
      {/* 1. HERO HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">
              Personal Account
            </span>
            {user.id && <Verified className="w-4 h-4 text-blue-500" />}
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {user.name}
          </h1>
          <p className="text-slate-500 font-medium flex items-center gap-2 mt-1">
            <Mail className="w-4 h-4" /> {user.email}
          </p>
        </div>
        
        <Link
          href="/edit-profile"
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl hover:bg-blue-600 transition-all font-bold text-sm shadow-xl shadow-slate-200 active:scale-95"
        >
          <Edit className="w-4 h-4" />
          Edit Settings
        </Link>
      </div>

      {/* 2. QUICK ACTIONS / STATS */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Dashboard Overview</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

      {/* 3. DETAILED INFORMATION */}
      <section className="bg-slate-50/50 rounded-[32px] p-1 border border-slate-100">
        <div className="bg-white rounded-[30px] p-6 sm:p-8 shadow-sm">
          <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white">
               <User className="w-4 h-4" />
            </div>
            Identity Details
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-10 gap-x-12">
            <InfoItem label="Full Name" value={user.name} icon={User} />
            <InfoItem label="Email Address" value={user.email} icon={Mail} />
            <InfoItem label="Mobile Number" value={user.phone_number || "Not provided"} icon={Phone} />
            <InfoItem 
              label="Primary Address" 
              value="Manage Shipping Locations" 
              icon={MapPin} 
              isLink 
              href="/addresses" 
            />
          </div>
        </div>
      </section>

    </div>
  );
}

// Sub-components
function StatCard({ icon: Icon, label, value, color, href }) {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    pink: "text-pink-600 bg-pink-50 border-pink-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100"
  };

  return (
    <Link href={href} className="group">
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 relative overflow-hidden">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${colorMap[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-1">{label}</p>
        <div className="flex items-end justify-between">
          <h4 className="text-2xl font-black text-slate-900">{value}</h4>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}

function InfoItem({ label, value, icon: Icon, isLink, href }) {
  const content = (
    <div className="group cursor-default">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2 flex items-center gap-2">
        <Icon className="w-3 h-3" /> {label}
      </p>
      <p className={`text-base font-bold transition-colors ${isLink ? "text-blue-600 hover:text-blue-700 underline underline-offset-4" : "text-slate-800"}`}>
        {value}
      </p>
    </div>
  );

  return isLink ? <Link href={href}>{content}</Link> : content;
}