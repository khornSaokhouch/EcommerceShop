"use client";

import React from "react";
import Link from "next/link";
import { ShieldCheck, MapPin, Globe, ArrowUpRight, Clock } from "lucide-react";

export default function StoreCard({ store }) {
  const displayName = store.company_name || "Partner";
  const displayImage = store.company_image_url;
  const initial = displayName?.charAt(0)?.toUpperCase() ?? "?";

  const slug = store.slug || displayName?.toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

  return (
    <div className="group relative flex flex-col h-full bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      
      {/* 1. COMPACT HEADER (Reduced Height) */}
      <div className="relative h-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-500/20" />
      </div>

      {/* 2. COMPACT LOGO (Overlapping slightly) */}
      <div className="relative flex justify-center -mt-8 z-10">
        <div className="w-16 h-16 bg-white rounded-2xl p-0.5 shadow-lg border border-slate-50">
          <div className="w-full h-full rounded-[0.9rem] overflow-hidden bg-slate-50 flex items-center justify-center">
            {displayImage ? (
              <img src={displayImage} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-black text-blue-600">{initial}</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. COMPACT CONTENT */}
      <div className="flex-1 pt-3 px-4 pb-5 flex flex-col items-center text-center">
        
        {/* Name & verification */}
        <div className="flex items-center gap-1 mb-0.5">
          <h3 className="text-sm font-bold text-slate-900 truncate max-w-[150px]">
            {displayName}
          </h3>
          <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" />
        </div>

        {/* Location (One Line) */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-2.5 h-2.5 text-red-500" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[120px]">
            {store.city || 'Global'}
          </span>
        </div>

        {/* Short Description (Strict 1 line) */}
        <p className="text-[11px] text-slate-500 line-clamp-1 mb-4 italic">
          {store.description || "Authorized hardware distributor."}
        </p>

        {/* MINI INFO GRID (Combined into smaller blocks) */}
        <div className="grid grid-cols-2 gap-2 w-full mb-5">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-2">
            <Globe className="w-3 h-3 text-blue-500 shrink-0" />
            <div className="text-left overflow-hidden">
                <p className="text-[7px] font-black text-slate-400 uppercase leading-none mb-0.5">Web</p>
                <p className="text-[9px] font-bold text-slate-700 truncate">{store.website_url ? "Portal" : "N/A"}</p>
            </div>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 flex items-center gap-2">
            <Clock className="w-3 h-3 text-cyan-500 shrink-0" />
            <div className="text-left overflow-hidden">
                <p className="text-[7px] font-black text-slate-400 uppercase leading-none mb-0.5">Time</p>
                <p className="text-[9px] font-bold text-slate-700 truncate">{store.business_hours || "09-18"}</p>
            </div>
          </div>
        </div>

        {/* CTA Button (Compact Height) */}
        <Link
          href={`/store/${slug}`}
          className="group/btn relative w-full h-11 flex items-center justify-center bg-slate-900 text-white rounded-xl overflow-hidden transition-all hover:bg-blue-600 active:scale-[0.98]"
        >
          <span className="relative z-10 text-[9px] font-black uppercase tracking-widest">Visit Store</span>
          <ArrowUpRight className="relative z-10 w-3 h-3 ml-2 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
        </Link>
      </div>
    </div>
  );
}