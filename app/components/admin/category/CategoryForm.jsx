"use client"
import { X, Save, UploadCloud, Camera, Package, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const CategoryForm = ({ isOpen, onClose, editingCategory, onSave }) => {
  const [name, setName] = useState("")
  const [status, setStatus] = useState(true)
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState("")

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setStatus(!!editingCategory.status);
      setPreview(editingCategory.image_url);
    } else {
      setName(""); setStatus(true); setPreview(""); setImage(null);
    }
  }, [editingCategory, isOpen]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl border border-slate-100 overflow-hidden">
          
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
             <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{editingCategory ? "Update Category" : "Create Category"}</h2>
             <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20}/></button>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); onSave({ id: editingCategory?.id, name, status, image }); }} className="p-8 space-y-8">
            {/* Image Upload */}
            <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-[20px] bg-slate-100 p-1 border-2 border-slate-200 shadow-inner">
                   <div className="w-full h-full rounded-[16px] bg-white flex items-center justify-center overflow-hidden">
                      {preview ? <img src={preview} className="object-contain w-full h-full p-2" /> : <Camera className="text-slate-300" />}
                   </div>
                   <label htmlFor="cat-img" className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                      <UploadCloud size={14} />
                      <input id="cat-img" type="file" className="hidden" onChange={handleFile} />
                   </label>
                </div>
                <div>
                   <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest mb-1">Image Profile</p>
                   <p className="text-[13px] font-medium text-slate-400">Transmitting categorization node <br/> requires a visual identifier.</p>
                </div>
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
               <div>
                  <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">Category availability</p>
                  <p className="text-[11px] font-medium text-slate-400 uppercase">Set classification as {status ? 'Active' : 'Disabled'}</p>
               </div>
               <button
                  type="button"
                  onClick={() => setStatus(!status)}
                  className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${status ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-slate-300'}`}
               >
                  <span className={`${status ? 'translate-x-6' : 'translate-x-1'} inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out underline-none`} />
               </button>
            </div>

            {/* Input */}
            <div className="space-y-2">
               <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">Classification Name</label>
               <input 
                  type="text" value={name} onChange={(e) => setName(e.target.value)} required 
                  placeholder="e.g. VISUAL_PROCESSORS"
                  className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
               />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <button type="button" onClick={onClose} className="py-4 bg-slate-50 text-slate-400 rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:bg-slate-100">Cancel</button>
               <button type="submit" className="py-4 bg-slate-900 text-white rounded-2xl text-[13px] font-bold uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all">
                  {editingCategory ? "Update    Category" : "Create Category"}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default CategoryForm