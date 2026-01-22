"use client";

import React from "react";
import { Calendar, Percent, Pencil, Trash2, ShieldCheck, Clock, Zap } from "lucide-react";

export default function PromotionCard({ promotion, onEdit, onDelete }) {
  const now = new Date();
  const start = new Date(promotion.start_date);
  const end = new Date(promotion.end_date);
  end.setHours(23, 59, 59);

  const isExpired = now > end;
  const isUpcoming = now < start;

  return (
    <div className="group relative bg-white border border-slate-100 rounded-[28px] p-6 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col h-full overflow-hidden">
      {/* Background Status Indicator */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-12 -mt-12 opacity-5 transition-transform group-hover:scale-150 ${isExpired ? 'bg-rose-500' : 'bg-emerald-500'}`} />

      {/* Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg group-hover:bg-blue-600 transition-colors">
            <Percent size={20} />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
            isExpired ? "bg-rose-50 text-rose-600 border-rose-100" : 
            isUpcoming ? "bg-blue-50 text-blue-600 border-blue-100" : 
            "bg-emerald-50 text-emerald-600 border-emerald-100 animate-pulse"
        }`}>
            {isExpired ? "Terminated" : isUpcoming ? "Scheduled" : "Active Sync"}
        </span>
      </div>

      <div className="flex-1 space-y-4">
        <div>
            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight line-clamp-1">{promotion.name}</h3>
            <p className="text-[11px] text-slate-400 font-medium italic mt-1 line-clamp-2">"{promotion.description || "No registry metadata provided."}"</p>
        </div>

        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reduction Value</span>
                <span className="text-sm font-black text-blue-600">{promotion.discount_percentage}% OFF</span>
            </div>
            <div className="h-px bg-slate-200/50" />
            <div className="flex items-center gap-3">
                <Clock size={12} className="text-slate-300" />
                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tight">
                    {new Date(promotion.start_date).toLocaleDateString()} — {new Date(promotion.end_date).toLocaleDateString()}
                </span>
            </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex gap-2">
        <button
          onClick={() => onEdit(promotion)}
          className="flex-1 py-3 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-white hover:shadow-xl rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-transparent hover:border-blue-100"
        >
          Modify
        </button>
        <button
          onClick={() => onDelete(promotion.id)}
          className="p-3 bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-white hover:shadow-xl rounded-xl transition-all border border-transparent hover:border-rose-100"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}