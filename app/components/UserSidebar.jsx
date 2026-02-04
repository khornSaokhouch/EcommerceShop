"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";
import { useAuthStore } from "../stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Package, Heart, MapPin, Shield, LogOut, AlertCircle, Loader2, MessageCircle, ShoppingCart,Pencil 
} from "lucide-react";
import toast from "react-hot-toast";

// --- LIQUID MODAL ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, isConfirming }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white/80 backdrop-blur-3xl rounded-[40px] p-8 w-full max-w-sm relative z-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
            <AlertCircle className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter uppercase">{title}</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">{children}</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onClose} className="py-4 text-[11px] font-black uppercase tracking-widest text-slate-500 bg-slate-100/50 rounded-2xl hover:bg-slate-100 transition-all active:scale-95">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={isConfirming} className="py-4 text-[11px] font-black uppercase tracking-widest text-white bg-red-500 rounded-2xl hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-500/20 flex items-center justify-center gap-2">
              {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Logout"}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function UserSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, fetchUser } = useUserStore();
  const { logout } = useAuthStore();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) { toast.error("Logout failed"); }
    finally { setIsLoggingOut(false); setIsLogoutModalOpen(false); }
  };

const navLinks = [
  { name: "Personal Info", href: "/profile", icon: User },
  { name: "My Messages", href: "/chat", icon: MessageCircle },
  { name: "Edit Profile", href: "/edit-profile", icon: Pencil }, // ✅ FIX
  { name: "Order History", href: "/profile/orders", icon: Package },
  { name: "Wishlist", href: "/favorites", icon: Heart },
  { name: "Shopping Cart", href: "/shopping-cart", icon: ShoppingCart },
  { name: "Addresses", href: "/addresses", icon: MapPin },
  { name: "Security", href: "/security", icon: Shield },
];


  if (loading) return (
    <div className="bg-white/50 backdrop-blur-md rounded-[32px] p-6 border border-white animate-pulse">
      <div className="h-20 bg-slate-200/50 rounded-2xl mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-slate-100/50 rounded-xl" />)}
      </div>
    </div>
  );

  if (!user) return null;

  const currentImageUrl = user.profile_image_url?.includes('http') ? user.profile_image_url.substring(user.profile_image_url.lastIndexOf('http')) : null;
  const userInitial = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Sign Out?"
        isConfirming={isLoggingOut}
      >
        You will need to log back in to access your secure hardware registry and messages.
      </ConfirmationModal>

      <div className="flex flex-col gap-4">
        {/* --- USER CARD (LIQUID GLASS) --- */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-[32px] p-6 border border-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] relative overflow-hidden group">
          {/* Animated Background Pulse */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-[20px] p-[2px] bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-lg shadow-blue-500/20">
               <div className="w-full h-full rounded-[18px] overflow-hidden bg-white flex items-center justify-center relative">
                 {currentImageUrl ? (
                    <Image src={currentImageUrl} alt="Profile" fill className="object-cover" />
                 ) : (
                    <span className="text-xl font-black text-blue-600">{userInitial}</span>
                 )}
               </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-black text-slate-900 truncate tracking-tight">{user.name || "User"}</h2>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Active Node</p>
            </div>
          </div>
        </div>

        {/* --- DESKTOP NAV (LIQUID LINKS) --- */}
        <div className="hidden lg:block bg-white/60 backdrop-blur-xl rounded-[32px] p-3 border border-white shadow-sm">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-500 ease-[0.23,1,0.32,1]
                    active:scale-95 group
                    ${isActive 
                      ? "bg-blue-600/10 text-blue-600 border border-blue-600/20 backdrop-blur-md shadow-[0_10px_20px_rgba(37,99,235,0.05)]" 
                      : "text-slate-500 hover:bg-white/80 hover:text-blue-600 border border-transparent hover:border-white"
                    }
                  `}
                >
                  <link.icon className={`w-5 h-5 transition-colors ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 pt-3 border-t border-slate-100/50">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex w-full items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold text-red-500 hover:bg-red-50/50 transition-all active:scale-95"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* --- MOBILE NAV (LIQUID PILLS) --- */}
        <div className="lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar px-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-500 border
                    active:scale-90
                    ${isActive 
                      ? "bg-blue-600/10 text-blue-600 border-blue-600/20 backdrop-blur-md shadow-lg shadow-blue-500/5" 
                      : "bg-white/80 text-slate-500 border-white backdrop-blur-md"
                    }
                  `}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap bg-red-500/10 text-red-600 border border-red-500/20 backdrop-blur-md"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}