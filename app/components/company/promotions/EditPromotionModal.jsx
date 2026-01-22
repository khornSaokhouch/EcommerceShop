"use client";

import React, { useEffect, useState } from "react";
import { usePromotionsStore } from "../../../stores/usePromotionsStore";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { X, Percent, Calendar, Zap, Loader2, Save } from "lucide-react";

export default function EditPromotionModal({ promotion, isOpen, onClose }) {
  const { updatePromotion, loading } = usePromotionsStore();
  const [formData, setFormData] = useState(promotion);

  useEffect(() => {
    if (promotion) {
      setFormData({
        ...promotion,
        start_date: promotion.start_date.split("T")[0],
        end_date: promotion.end_date.split("T")[0],
      });
    }
  }, [promotion]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const tid = toast.loading("Syncing Node Protocol...");
    try {
      await updatePromotion(formData.id, formData);
      toast.success("Registry Synced Successfully", { id: tid });
      onClose();
    } catch (err) {
      toast.error(err.message || "Transmission Error", { id: tid });
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-[32px] w-full max-w-xl relative z-10 shadow-2xl border border-slate-100 overflow-hidden font-sans"
        >
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Sync Protocol</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Modifying node UID: #{formData.id}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20}/></button>
          </div>

          <form onSubmit={handleUpdate} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TechnicalInput icon={Zap} label="Node Designation" name="name" value={formData.name} onChange={handleChange} required />
                <TechnicalInput icon={Percent} label="Reduction Value (%)" name="discount_percentage" type="number" value={formData.discount_percentage} onChange={handleChange} required />
                <TechnicalInput icon={Calendar} label="New Start Date" name="start_date" type="date" value={formData.start_date} onChange={handleChange} required />
                <TechnicalInput icon={Calendar} label="New End Date" name="end_date" type="date" value={formData.end_date} onChange={handleChange} required />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Intelligence</label>
               <textarea 
                 name="description" rows="3" value={formData.description} onChange={handleChange}
                 className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none"
               />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <button type="button" onClick={onClose} className="py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100">Abort</button>
               <button type="submit" disabled={loading} className="group relative py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98]">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16}/>}
                    Execute Update
                  </span>
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Use same TechnicalInput helper as defined in AddPromotionForm
const TechnicalInput = ({ icon: Icon, label, ...props }) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
            <input 
                {...props} 
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" 
            />
        </div>
    </div>
);