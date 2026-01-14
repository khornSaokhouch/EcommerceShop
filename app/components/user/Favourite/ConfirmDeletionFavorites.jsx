"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, Trash2 } from "lucide-react";

const ConfirmDeletionFavorites = ({ isOpen, onClose, onConfirm }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        {/* Modal */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 mx-auto">
            <Trash2 className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Remove Item?</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
            This unit will be removed from your reserved wishlist. You can always add it back later.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onClose} 
              className="py-3.5 text-sm font-bold text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm} 
              className="py-3.5 text-sm font-bold text-white bg-red-500 rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-100"
            >
              Remove
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default ConfirmDeletionFavorites;