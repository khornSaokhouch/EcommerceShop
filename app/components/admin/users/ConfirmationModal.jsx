// app/admin/users/components/ConfirmationModal.jsx
"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2 } from "lucide-react"

export function ConfirmationModal({ isOpen, onClose, onConfirm, userName }) {
  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-center items-center p-4 "
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 uppercase tracking-tighter">Delete User</h2>
                  <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">Protocol: Direct Purge</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-[13px] font-medium text-slate-700">
                Are you sure you want to delete <span className="font-bold text-red-600 uppercase">{userName}</span>? This action is irreversible.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 text-[13px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={onConfirm}
                className="flex-1 px-4 py-2.5 text-[13px] font-bold uppercase tracking-widest text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
              >
                OKAY
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}