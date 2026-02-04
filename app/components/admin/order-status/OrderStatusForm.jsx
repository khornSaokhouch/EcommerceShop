"use client"
import { X, CheckCircle2, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const OrderStatusForm = ({ isOpen, onClose, editingStatus, onSave }) => {
  const [status, setStatus] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (editingStatus) {
      setStatus(editingStatus.status);
    } else {
      setStatus("");
    }
  }, [editingStatus, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    await onSave({ status }, editingStatus?.id)
    setIsLoading(false)
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] w-full max-w-md relative z-10 shadow-2xl border border-slate-100 overflow-hidden">
          
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editingStatus ? "Update Status" : "Create Status"}</h2>
             <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20}/></button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Name Input */}
            <div className="space-y-2">
               <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">Status Name</label>
               <input 
                  type="text" value={status} onChange={(e) => setStatus(e.target.value)} required 
                  placeholder="e.g. PENDING, PROCESSING, SHIPPED"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all outline-none"
                  disabled={isLoading}
                  autoFocus
               />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <button type="button" onClick={onClose} className="py-4 bg-slate-50 text-slate-400 rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:bg-slate-100">Cancel</button>
               <button type="submit" disabled={isLoading || !status.trim()} className="py-4 bg-orange-600 text-white rounded-2xl text-[13px] font-bold uppercase tracking-widest shadow-xl hover:bg-orange-700 transition-all flex items-center justify-center gap-2">
                  {isLoading ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16}/>}
                  {editingStatus ? "Update" : "Create"}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default OrderStatusForm
