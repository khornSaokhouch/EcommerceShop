"use client";
import React from "react";
import { Trash2 } from "lucide-react";

export default function ConfirmDeleteModalPromotions({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <div className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 text-center font-sans">
            <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6 mx-auto">
                <Trash2 className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Purge Protocol?</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">Removing this promotion node will terminate the associated discount protocol permanently.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onClose} className="py-4 text-xs font-black uppercase text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100">Abort</button>
              <button onClick={onConfirm} className="py-4 text-xs font-black uppercase text-white bg-red-500 rounded-2xl hover:bg-red-600 shadow-xl shadow-red-200 transition-all">Execute</button>
            </div>
        </div>
    </div>
  );
}
