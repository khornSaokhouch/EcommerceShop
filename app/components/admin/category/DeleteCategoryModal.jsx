"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Trash2, AlertCircle } from "lucide-react"

const DeleteCategoryModal = ({ isOpen, onClose, category, onConfirm }) => {
  if (!isOpen || !category) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 text-center">
          <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6 mx-auto">
            <Trash2 className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Purge Node?</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
             Removing <span className="text-slate-900 font-bold underline decoration-red-500">{category.name}</span> will clear this classification from the hardware registry.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onClose} className="py-4 text-xs font-black uppercase text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100">Cancel</button>
            <button onClick={onConfirm} className="py-4 text-xs font-black uppercase text-white bg-red-500 rounded-2xl hover:bg-red-600 shadow-xl shadow-red-200">Execute</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default DeleteCategoryModal