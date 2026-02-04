"use client"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const TypeForm = ({ isOpen, onClose, editingType, onSave, categories }) => {
  const [name, setName] = useState("")
  const [status, setStatus] = useState(true)
  const [categoryId, setCategoryId] = useState("")

  useEffect(() => {
    if (editingType) {
      setName(editingType.name);
      setStatus(!!editingType.status);
      setCategoryId(editingType.category_id || "");
    } else {
      setName(""); setStatus(true); setCategoryId("");
    }
  }, [editingType, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl border border-slate-100 overflow-hidden">
          
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editingType ? "Update Type" : "Create Type"}</h2>
             <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20}/></button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSave({ id: editingType?.id, name, status, category_id: categoryId }); }} className="p-8 space-y-6">
            
            {/* Category Selection */}
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">Parent Category</label>
              <select
                value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
              >
                <option value="">Select Category</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>

            {/* Name Input */}
            <div className="space-y-2">
               <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">Type Name</label>
               <input 
                  type="text" value={name} onChange={(e) => setName(e.target.value)} required 
                  placeholder="e.g. Laptop, Desktop, Monitor"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
               />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div>
                  <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">Type Status</p>
                  <p className="text-[11px] font-medium text-slate-400 uppercase">Set type as {status ? 'Active' : 'Disabled'}</p>
               </div>
               <button
                  type="button"
                  onClick={() => setStatus(!status)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${status ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-300'}`}
               >
                  <span className={`${status ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out underline-none`} />
               </button>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <button type="button" onClick={onClose} className="py-4 bg-slate-50 text-slate-400 rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:bg-slate-100">Cancel</button>
               <button type="submit" className="py-4 bg-slate-900 text-white rounded-2xl text-[13px] font-bold uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all">
                  {editingType ? "Update Type" : "Create Type"}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default TypeForm
