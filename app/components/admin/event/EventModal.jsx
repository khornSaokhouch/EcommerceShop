"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UploadCloud, Camera, Zap, CheckCircle2 } from "lucide-react";

export default function EventModal({ isOpen, onClose, event, onSave }) {
  const [formData, setFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        start_date: event.start_date ? event.start_date.slice(0, 16) : "",
        end_date: event.end_date ? event.end_date.slice(0, 16) : "",
      });
      setImagePreview(event.event_image_url || null);
    } else {
      setFormData({ name: "", description: "", start_date: "", end_date: "", event_image: null });
      setImagePreview(null);
    }
  }, [event, isOpen]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "event_image" && files && files[0]) {
      setFormData((prev) => ({ ...prev, event_image: files[0] }));
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key]) data.append(key, formData[key]);
    });
    onSave(data, event ? event.id : null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl border border-slate-100 overflow-hidden font-sans"
        >
          <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
              {event ? "Sync Occurence" : "Register Occurence"}
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20}/></button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-[20px] bg-slate-50 p-1 border-2 border-slate-100 shadow-inner">
                   <div className="w-full h-full rounded-[16px] bg-white flex items-center justify-center overflow-hidden">
                      {imagePreview ? <img src={imagePreview} className="object-cover w-full h-full" /> : <Camera className="text-slate-300" />}
                   </div>
                   <label htmlFor="ev-img" className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                      <UploadCloud size={14} />
                      <input id="ev-img" name="event_image" type="file" className="hidden" onChange={handleChange} />
                   </label>
                </div>
                <div>
                   <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest mb-1">Visual node</p>
                   <p className="text-[13px] font-medium text-slate-400">Initialize event registry with <br/> a high-res technical identifier.</p>
                </div>
            </div>

            <StyledInput label="Node Designation" name="name" value={formData.name} onChange={handleChange} placeholder="e.g. SUMMER_SALE_2025" required />
            
            <div className="space-y-2">
               <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">Logic Description</label>
               <textarea name="description" rows="2" value={formData.description} onChange={handleChange} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <StyledInput label="Registry Start" name="start_date" type="datetime-local" value={formData.start_date} onChange={handleChange} required />
                <StyledInput label="Registry End" name="end_date" type="datetime-local" value={formData.end_date} onChange={handleChange} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
               <button type="button" onClick={onClose} className="py-4 bg-slate-50 text-slate-400 rounded-2xl text-[13px] font-bold uppercase tracking-widest hover:bg-slate-100">Abort</button>
               <button type="submit" className="py-4 bg-slate-900 text-white rounded-2xl text-[13px] font-bold uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 size={16}/> {event ? "Update node" : "Execute Registry"}
               </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

const StyledInput = ({ label, ...props }) => (
    <div className="space-y-2">
        <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">{label}</label>
        <input {...props} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none" />
    </div>
);