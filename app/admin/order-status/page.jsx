"use client";

import React, { useEffect, useState } from 'react';
import { useOrderStatusStore } from "../../stores/useOrderStatus";
import toast from "react-hot-toast";
import { 
  Plus, Edit, Trash2, X, AlertTriangle, 
  ListChecks, CheckCircle2, Loader2, Database,
  Settings2, ChevronRight, Hash
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

export default function OrderStatusManager() {
  const {
    orderStatuses,
    fetchOrderStatuses,
    createOrderStatus,
    updateOrderStatus,
    deleteOrderStatus,
    loading,
    error,
  } = useOrderStatusStore();

  const [modalState, setModalState] = useState({ type: null, data: null });
  const [inputValue, setInputValue] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrderStatuses();
  }, [fetchOrderStatuses]);

  const openModal = (type, data = null) => {
    setModalState({ type, data });
    setInputValue(type === 'edit' && data ? data.status : '');
    setActionLoading(false);
  };

  const closeModal = () => {
    setModalState({ type: null, data: null });
    setInputValue('');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (actionLoading || !inputValue.trim()) return;

    setActionLoading(true);
    const toastId = toast.loading('Processing Protocol...');
    const payload = { status: inputValue.trim() };
    
    try {
      const success = modalState.type === 'add' 
        ? await createOrderStatus(payload) 
        : await updateOrderStatus(modalState.data.id, payload);
      
      if (success) {
        toast.success(`Status Protocol ${modalState.type === 'add' ? 'Deployed' : 'Synced'}`, { id: toastId });
        closeModal();
      }
    } catch (err) {
      toast.error('Transmission Error.', { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (actionLoading || !modalState.data) return;
    setActionLoading(true);
    const toastId = toast.loading('Purging Protocol...');
    
    try {
      const success = await deleteOrderStatus(modalState.data.id);
      if (success) {
        toast.success('Protocol Node Purged', { id: toastId });
        closeModal();
      }
    } catch (err) {
      toast.error('Purge Failed.', { id: toastId });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <Settings2 className="w-3 h-3" /> Workflow Configuration
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Order Status Nodes</h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2">Manage lifecycle protocols for hardware deployments</p>
        </div>
        
        <button 
          onClick={() => openModal('add')}
          className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
                <Plus size={16} /> New Status Protocol
            </span>
        </button>
      </div>

      {/* 2. REGISTRY CONTENT */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        
        <div className="px-8 py-6 border-b border-slate-50 flex items-center gap-3">
            <Database className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest">Active Protocol Registry</h2>
        </div>

        {loading && orderStatuses.length === 0 ? (
          <div className="py-32 flex flex-col items-center gap-4 text-center">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Registry Nodes...</p>
          </div>
        ) : orderStatuses.length === 0 ? (
           <div className="py-32 text-center flex flex-col items-center gap-4">
             <ListChecks className="text-slate-100" size={48} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Protocol Nodes Defined</p>
           </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {orderStatuses.map((os, index) => (
              <div key={os.id} className="flex justify-between items-center px-8 py-5 hover:bg-slate-50/50 transition-all group">
                <div className="flex items-center gap-6">
                   <span className="text-xs font-black text-slate-300 group-hover:text-blue-500 transition-colors">
                     {String(index + 1).padStart(2, '0')}
                   </span>
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
                      <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{os.status}</span>
                   </div>
                </div>

                <div className="flex gap-2">
                   <button 
                     onClick={() => openModal('edit', os)}
                     className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-blue-100"
                   >
                     <Edit size={16} />
                   </button>
                   <button 
                     onClick={() => openModal('delete', os)}
                     className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-red-100"
                   >
                     <Trash2 size={16} />
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- MODALS (Standardized with Dashboard Theme) --- */}
      <AnimatePresence>
        {(modalState.type === 'add' || modalState.type === 'edit') && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                        {modalState.type === 'add' ? 'Register Protocol' : 'Sync Protocol'}
                    </h2>
                    <button onClick={closeModal} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20}/></button>
                </div>
                <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Designation</label>
                        <input
                            type="text"
                            required
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                            placeholder="e.g. DEPLOYED, PENDING_SYNC, TERMINATED"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            autoFocus
                            disabled={actionLoading}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <button type="button" className="py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100" onClick={closeModal}>Abort</button>
                        <button type="submit" disabled={actionLoading || !inputValue.trim()} className="py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                            {actionLoading ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16}/>}
                            Sync Node
                        </button>
                    </div>
                </form>
            </motion.div>
          </div>
        )}

        {modalState.type === 'delete' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeModal} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 text-center">
                <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6 mx-auto">
                    <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Purge Protocol?</h2>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium italic">
                    Removing <span className="text-slate-900 font-bold underline decoration-red-500">{modalState.data?.status}</span> from the registry node.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={closeModal} className="py-4 text-xs font-black uppercase text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">Abort</button>
                  <button onClick={handleDeleteConfirm} disabled={actionLoading} className="py-4 text-xs font-black uppercase text-white bg-red-500 rounded-2xl hover:bg-red-600 shadow-xl shadow-red-200 transition-all">Execute Purge</button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}