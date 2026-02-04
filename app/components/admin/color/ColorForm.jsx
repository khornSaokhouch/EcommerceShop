"use client"
import { X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const ColorForm = ({ isOpen, onClose, editingColor, onSave }) => {
  const [name, setName] = useState("")

  useEffect(() => {
    if (editingColor) {
      setName(editingColor.name);
    } else {
      setName("");
    }
  }, [editingColor, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] w-full max-w-md relative z-10 shadow-2xl border border-slate-100 overflow-hidden">
          
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editingColor ? "Update Color" : "Add Color"}</h2>
             <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20}/></button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSave({ id: editingColor?.id, name }); }} className="p-8 space-y-6">
            
            {/* Name Input */}
            <div className="space-y-2">
               <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">Color Name</label>
               <input 
                  type="text" value={name} onChange={(e) => setName(e.target.value)} required 
                  placeholder="e.g. Red, Blue, Green"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
               />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <button type="button" onClick={onClose} className="py-4 bg-slate-50 text-slate-400 rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:bg-slate-100">Cancel</button>
               <button type="submit" className="py-4 bg-slate-900 text-white rounded-2xl text-[13px] font-bold uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all">
                  {editingColor ? "Update" : "Create"}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ColorForm
