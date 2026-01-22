"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useStore } from "../../stores/useStore"; 
import { useAuthStore } from "../../stores/authStore"; 
import { AnimatePresence, motion } from "framer-motion";
import { 
  Pencil, Trash2, Plus, X, Clock , Store, 
  Loader2, Info, ShieldCheck, Database, Cpu, 
  ArrowUpRight, CheckCircle2, LayoutGrid
} from "lucide-react";
import toast from "react-hot-toast";

export default function StoreManager() {
  const authUser = useAuthStore((state) => state.user);
  const userId = authUser?.id;

  const { stores, fetchStoresByUserId, createStore, updateStore, deleteStore, loading: storeLoading, error } = useStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  
  const hasStore = stores.length > 0;

  useEffect(() => {
    if (userId) fetchStoresByUserId(userId);
  }, [fetchStoresByUserId, userId]);

  const handleOpenForm = (node = null) => {
    setSelectedNode(node);
    setInputValue(node ? node.name : "");
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const { token } = useAuthStore.getState();
  
    setActionLoading(true);
    const tid = toast.loading("Syncing Node Data...");
    try {
      const payload = { name: inputValue.trim(), user_id: userId };
      if (selectedNode) {
        await updateStore(selectedNode.id, payload, token);
        toast.success("Hub Protocol Updated", { id: tid });
      } else {
        await createStore(payload, token);
        toast.success("Hub Node Initialized", { id: tid });
      }
      setModalOpen(false);
      fetchStoresByUserId(userId, token);
    } catch (err) {
      toast.error(err.message || "Protocol Failure", { id: tid });
    } finally {
      setActionLoading(false);
    }
  };
  
  const handleConfirmDelete = async () => {
    setActionLoading(true);
    const tid = toast.loading("Purging Node...");
    try {
      const { token } = useAuthStore.getState();
      await deleteStore(selectedNode.id, token);
      toast.success("Node Purged from Registry", { id: tid });
      setDeleteModalOpen(false);
      fetchStoresByUserId(userId, token);
    } catch {
      toast.error("Operation Failed", { id: tid });
    } finally {
      setActionLoading(false);
    }
  };

  if (storeLoading && !hasStore) return (
    <div className="h-[60vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Hub Registry...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <LayoutGrid className="w-3 h-3" /> Sourcing Network
          </div>
          <h1 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Hub Registry</h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2">Manage primary operational sourcing nodes</p>
        </div>
        
        <button 
            onClick={() => handleOpenForm()}
            disabled={hasStore}
            className={`group relative px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl ${
                hasStore ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-900 text-white shadow-slate-200"
            }`}
        >
            {!hasStore && <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />}
            <span className="relative z-10 flex items-center gap-2">
                <Plus size={16} /> Initialize Hub Node
            </span>
        </button>
      </div>

      {/* 2. REGISTRY STATUS NOTIFICATION */}
      {hasStore && (
        <div className="flex items-center gap-4 p-5 bg-blue-50/50 border border-blue-100 rounded-[24px]">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
                <ShieldCheck size={20} />
            </div>
            <div className="flex-1">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Registry Constraint Active</p>
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Your account is restricted to one operational Hub. Purge current node to re-initialize.</p>
            </div>
        </div>
      )}

      {/* 3. NODE LISTING */}
      <div className="grid grid-cols-1 gap-6">
        {stores.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center gap-4">
             <Database className="text-slate-100" size={48} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No hubs detected in registry</p>
          </div>
        ) : (
          stores.map((store) => (
            <div key={store.id} className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-200 transition-all group">
                <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-[24px] flex items-center justify-center border border-slate-100 shadow-inner group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                        <Store size={32} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Active Hub Node</span>
                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ID: #{store.id}</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{store.name}</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 flex items-center gap-2">
                           <Clock size={12} /> Registry Sync: {new Date(store.updated_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button 
                        onClick={() => handleOpenForm(store)}
                        className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-500 hover:text-blue-600 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest border border-transparent hover:border-blue-100"
                    >
                        <Pencil size={14} /> Update Protocol
                    </button>
                    <button 
                        onClick={() => { setSelectedNode(store); setDeleteModalOpen(true); }}
                        className="p-3 bg-slate-50 text-slate-300 hover:text-red-500 hover:bg-white hover:shadow-xl hover:shadow-red-500/5 rounded-2xl transition-all border border-transparent hover:border-red-100"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
          ))
        )}
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl border border-slate-100 overflow-hidden font-sans">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedNode ? 'Modify Protocol' : 'Initialize Node'}</h2>
                    <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20}/></button>
                </div>
                <form onSubmit={handleSave} className="p-8 space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hub Node Designation</label>
                        <input
                            type="text" required autoFocus
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                            placeholder="e.g. ALPHA_SOURCING_HUB"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={actionLoading}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100" onClick={() => setModalOpen(false)}>Abort</button>
                        <button type="submit" disabled={actionLoading || !inputValue.trim()} className="py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                            {actionLoading ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16}/>} Sync Hub
                        </button>
                    </div>
                </form>
            </motion.div>
          </div>
        )}

        {deleteModalOpen && selectedNode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 text-center font-sans">
                <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6 mx-auto"><Trash2 className="w-8 h-8 text-red-500" /></div>
                <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Purge Node?</h2>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">Removing Hub <span className="text-slate-900 font-bold underline decoration-red-500">{selectedNode.name}</span> will disconnect all catalog associated with this node.</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setDeleteModalOpen(false)} className="py-4 text-xs font-black uppercase text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">Abort</button>
                  <button onClick={handleConfirmDelete} disabled={actionLoading} className="py-4 text-xs font-black uppercase text-white bg-red-500 rounded-2xl hover:bg-red-600 shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-2">
                    {actionLoading ? <Loader2 className="animate-spin" size={16}/> : "Execute Purge"}
                  </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}