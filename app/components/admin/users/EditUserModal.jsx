"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Trash2, AlertCircle, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export function EditUserModal({ user, isOpen, onClose, onSave }) {
  const [selectedRole, setSelectedRole] = useState(user?.role || "user");

  useEffect(() => { if (user) setSelectedRole(user.role); }, [user]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100">
            <h2 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-tight">Modify Permissions</h2>
            <div className="space-y-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black">{user.name[0]}</div>
                    <div className="min-w-0"><p className="text-xs font-black text-slate-900 uppercase truncate">{user.name}</p><p className="text-[10px] font-bold text-slate-400 truncate">{user.email}</p></div>
                </div>
                <div className="relative">
                    <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} className="w-full appearance-none bg-white border border-slate-200 rounded-xl py-3 px-4 text-xs font-bold text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all">
                        <option value="user">Standard Node</option>
                        <option value="company">Merchant Node</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <button onClick={onClose} className="py-3 text-xs font-black uppercase text-slate-400 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all">Cancel</button>
                    <button onClick={() => onSave(user.id, selectedRole)} className="py-3 text-xs font-black uppercase text-white bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all">Apply</button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, userName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 text-center">
            <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6 mx-auto"><Trash2 className="w-8 h-8 text-red-500" /></div>
            <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Purge Node?</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">Removing <span className="text-slate-900 font-bold underline decoration-red-500">{userName}</span> from the central hardware registry.</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onClose} className="py-4 text-xs font-black uppercase text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">Abort</button>
              <button onClick={onConfirm} className="py-4 text-xs font-black uppercase text-white bg-red-500 rounded-2xl hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all">Execute Purge</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}