"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, Globe, ArrowUpRight, Clock, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function StoreCard({ store }) {
  const displayName = store.company_name || "Technocore Partner";
  const displayImage = store.company_image_url;
  const initial = displayName?.charAt(0)?.toUpperCase() ?? "T";

  const slug = store.slug || displayName?.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative flex flex-col h-full bg-white rounded-[32px] border border-slate-100 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-all duration-500"
    >
      
      {/* Card Header (Gradient background) */}
      <div className="relative h-24 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500" />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        {/* Verification Badge Overlay */}
        <div className="absolute top-3 right-3 px-2 py-1 bg-white/20 backdrop-blur-md rounded-lg border border-white/20">
          <ShieldCheck className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Store Logo Section */}
      <div className="relative flex justify-center -mt-10 z-10">
        <div className="w-20 h-20 bg-white rounded-[24px] p-1 shadow-xl shadow-slate-200">
          <div className="w-full h-full rounded-[20px] overflow-hidden bg-slate-50 flex items-center justify-center border-2 border-white">
            {displayImage ? (
              <img src={displayImage} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-black text-blue-600">{initial}</span>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex-1 px-5 pt-4 pb-6 flex flex-col items-center text-center">
        
        <div className="mb-4">
            <div className="flex items-center justify-center gap-1 mb-1">
                <h3 className="text-[15px] font-black text-slate-900 truncate tracking-tight">
                    {displayName}
                </h3>
            </div>
            
            <div className="flex items-center justify-center gap-1.5">
                <MapPin className="w-3 h-3 text-red-500" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {store.city || 'Global Hub'}
                </span>
            </div>
        </div>

        <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 mb-6 font-medium px-2 italic">
          "{store.description || "Leading official distributor of verified high-performance tech."}"
        </p>

        {/* Small Detail Row */}
        <div className="grid grid-cols-2 gap-2 w-full mb-6">
          <div className="flex flex-col items-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
             <Globe className="w-3.5 h-3.5 text-blue-600 mb-1" />
             <span className="text-[8px] font-black text-slate-400 uppercase">Website</span>
             <span className="text-[10px] font-bold text-slate-700 truncate w-full px-1">
               {store.website_url ? "Available" : "Technocore"}
             </span>
          </div>
          <div className="flex flex-col items-center p-2 rounded-2xl bg-slate-50 border border-slate-100">
             <Clock className="w-3.5 h-3.5 text-cyan-500 mb-1" />
             <span className="text-[8px] font-black text-slate-400 uppercase">Status</span>
             <span className="text-[10px] font-bold text-slate-700">Open Now</span>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href={`/store/${slug}`}
          className="group/btn relative w-full py-4 bg-slate-900 text-white rounded-2xl overflow-hidden transition-all active:scale-[0.97]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
          <div className="relative z-10 flex items-center justify-center gap-2">
            <span className="text-[11px] font-black uppercase tracking-[0.15em]">Enter Store</span>
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
          </div>
        </Link>
      </div>
    </motion.div>
  );
}