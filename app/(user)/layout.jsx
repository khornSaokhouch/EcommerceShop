"use client";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import { Store, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function UserLayout({ children }) {
  return (
    <div className="relative min-h-screen bg-[#fcfdfe]">
      {/* Navbar Fixed Top */}
      <div className="flex-grow pt-24">
        <Navbar />
      </div>

      {/* Page Content */}
      <main>{children}</main>

      <Footer />

      {/* --- TECHNOCORE ACTIVATION BUTTON (BECOME SELLER) --- */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Link href="/become-to-seller">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="relative group flex items-center bg-slate-900 text-white p-2 pr-6 rounded-[24px] shadow-[0_20px_50px_-12px_rgba(37,99,235,0.4)] border border-white/5 overflow-hidden active-float"
          >
            {/* 1. THE LOADING SPINNER BORDER (ANIMATION) */}
            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
              {/* Spinning Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-white/5" />
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-600 opacity-100"
              />
              
              {/* Icon Container */}
              <div className="relative z-10 w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center shadow-inner">
                 <Store className="w-4 h-4 text-blue-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>

            {/* 2. TEXT CONTENT */}
            <div className="ml-3 flex flex-col">
              <span className="text-[13px] font-black uppercase tracking-widest flex items-center gap-2">
                Become Seller
                <ArrowRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>

            {/* 3. HOVER GRADIENT GLOW */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
        </Link>
      </motion.div>

      {/* Styles for the float and glow */}
      <style jsx global>{`
        @keyframes active-float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        .active-float {
          animation: active-float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}