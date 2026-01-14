"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";
import { useAuthStore } from "../stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MapPin,
  Shield,
  LogOut,
  Edit,
  AlertCircle,
  Loader2,
  MessageCircle,
  ShoppingCart,
} from "lucide-react";
import toast from "react-hot-toast";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, isConfirming }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100"
        >
          <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">{title}</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">{children}</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onClose} className="py-3 text-sm font-bold text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={isConfirming} className="py-3 text-sm font-bold text-white bg-red-500 rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-2">
              {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Logout"}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

import { motion, AnimatePresence } from 'framer-motion';

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
    { name: "Order History", href: "/profile/orders", icon: Package },
    { name: "Wishlist", href: "/favorites", icon: Heart },
    { name: "Shopping-cart", href: "/shopping-cart", icon: ShoppingCart },
    { name: "Addresses", href: "/addresses", icon: MapPin },
    { name: "Security", href: "/security", icon: Shield },
  ];

  if (loading) return (
    <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 animate-pulse">
      <div className="h-20 bg-slate-100 rounded-2xl mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-slate-50 rounded-xl" />)}
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
        title="Signing Out?"
        isConfirming={isLoggingOut}
      >
        You will need to log back in to access your orders and messages.
      </ConfirmationModal>

      <div className="flex flex-col gap-4">
        {/* User Card */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-500" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-blue-600 to-cyan-400">
               <div className="w-full h-full rounded-[14px] overflow-hidden bg-white flex items-center justify-center border-2 border-white relative">
                 {currentImageUrl ? (
                    <Image src={currentImageUrl} alt="Profile" fill className="object-cover" />
                 ) : (
                    <span className="text-xl font-black text-blue-600">{userInitial}</span>
                 )}
               </div>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-black text-slate-900 truncate">{user.name || "User"}</h2>
              <p className="text-xs font-medium text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:block bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all group ${
                    isActive 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  <link.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 pt-4 border-t border-slate-50">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex w-full items-center gap-3 px-4 py-3.5 rounded-2xl text-[13px] font-bold text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Mobile Nav - Sleek Pill Scroller */}
        <div className="lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                    isActive 
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100" 
                      : "bg-white text-slate-600 border-slate-100"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold whitespace-nowrap bg-red-50 text-red-600 border border-red-100"
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