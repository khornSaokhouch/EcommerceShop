"use client"
import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AlertCircle } from "lucide-react"

export const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
            className="relative bg-white rounded-[2.5rem] p-8 w-full max-w-sm shadow-2xl overflow-hidden"
          >
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
                <AlertCircle className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-8">{children}</p>
            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs" onClick={onClose}>Cancel</button>
              <button className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold text-xs shadow-lg shadow-red-200 hover:bg-red-600 transition-colors" onClick={onConfirm}>Delete Forever</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}