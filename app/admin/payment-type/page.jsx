"use client";

import { useEffect, useState, useMemo } from "react";
import { usePaymentTypeStore } from "../../stores/usePaymentType";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  Plus, Search, RefreshCw, CreditCard, LayoutGrid, List, 
  ChevronLeft, ChevronRight, Loader2, Database, ShieldCheck,
  Edit, Trash2, ArrowUpRight, Zap, Wallet, X, CheckCircle2
} from "lucide-react";

const PAGE_SIZE = 10;

export default function PaymentTypeManager() {
  const { paymentTypes, fetchPaymentTypes, createPaymentType, updatePaymentType, deletePaymentType, loading, error } = usePaymentTypeStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  
  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPaymentTypes();
  }, [fetchPaymentTypes]);

  // Data Processing
  const filteredList = useMemo(() => {
    return paymentTypes.filter(pt => 
      pt.type?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => b.id - a.id);
  }, [paymentTypes, searchTerm]);

  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);
  const paginatedData = filteredList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // Handlers
  const handleOpenForm = (node = null) => {
    setSelectedNode(node);
    setInputValue(node ? node.type : "");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setIsProcessing(true);
    const tid = toast.loading("Processing Protocol...");
    
    try {
      const success = selectedNode 
        ? await updatePaymentType(selectedNode.id, { type: inputValue.trim() })
        : await createPaymentType({ type: inputValue.trim() });
      
      if (success) {
        toast.success(`Protocol ${selectedNode ? 'Updated' : 'Registered'}`, { id: tid });
        setModalOpen(false);
      }
    } catch (err) { toast.error("Transmission Error", { id: tid }); }
    finally { setIsProcessing(false); }
  };

  const handleConfirmDelete = async () => {
    setIsProcessing(true);
    const tid = toast.loading("Purging Node...");
    try {
      const result = await deletePaymentType(selectedNode.id);
      if (result) {
        toast.success("Protocol Purged", { id: tid });
        setDeleteModalOpen(false);
      }
    } catch (err) { toast.error("Purge Failed", { id: tid }); }
    finally { setIsProcessing(false); }
  };

  if (loading && paymentTypes.length === 0) return (
    <div className="h-[60vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Payment Nodes...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* 1. HEADER & STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100">
                    <ShieldCheck className="w-3.5 h-3.5" /> Security Protocol
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Payment Nodes</h1>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2">Configure authorized transaction gateways</p>
            </div>
            <button onClick={() => handleOpenForm()} className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                    <Plus size={16} /> Register Protocol
                </span>
            </button>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Active</p>
                <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{paymentTypes.length}</h4>
                <p className="text-[10px] font-bold text-blue-500 uppercase mt-1">Verified Gateways</p>
            </div>
            <div className="w-16 h-16 rounded-[24px] bg-blue-50 text-blue-600 flex items-center justify-center">
                <Wallet size={28} />
            </div>
        </div>
      </div>

      {/* 2. TOOLBAR */}
      <div className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search gateway ID or type..."
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
           <ViewToggle icon={LayoutGrid} active={viewMode === 'grid'} onClick={() => setViewMode('grid')} />
           <ViewToggle icon={List} active={viewMode === 'table'} onClick={() => setViewMode('table')} />
           <div className="w-px h-4 bg-slate-200 mx-1" />
           <button onClick={() => fetchPaymentTypes()} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><RefreshCw size={18} /></button>
        </div>
      </div>

      {/* 3. CONTENT AREA */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <AnimatePresence mode="wait">
          {filteredList.length === 0 ? (
            <div className="py-32 text-center flex flex-col items-center gap-4">
                <Zap size={48} className="text-slate-100" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No active protocols detected</p>
            </div>
          ) : viewMode === "grid" ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paginatedData.map((pt, idx) => (
                <div key={pt.id} className="bg-white rounded-[24px] border border-slate-100 p-6 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-50 rounded-full -mr-8 -mt-8 transition-transform group-hover:scale-150" />
                    <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-6 relative z-10 group-hover:bg-blue-600 transition-colors">
                        <CreditCard size={20} />
                    </div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">Gateway Protocol</p>
                    <h4 className="text-[15px] font-black text-slate-900 uppercase tracking-tight truncate">{pt.type}</h4>
                    <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[10px] font-black text-blue-600">ID: {String(pt.id).padStart(2, '0')}</span>
                        <div className="flex gap-2">
                            <button onClick={() => handleOpenForm(pt)} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit size={16}/></button>
                            <button onClick={() => {setSelectedNode(pt); setDeleteModalOpen(true);}} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                        </div>
                    </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div key="table" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"># Index</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Hub</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Control</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedData.map((pt, idx) => (
                    <tr key={pt.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-5 text-xs font-black text-slate-300">{String((currentPage-1)*PAGE_SIZE + idx + 1).padStart(2, '0')}</td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 group-hover:bg-blue-600 transition-colors">
                                <Zap size={16} />
                            </div>
                            <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{pt.type}</span>
                         </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg border border-emerald-100">Portal Ready</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2">
                           <button onClick={() => handleOpenForm(pt)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-blue-100"><Edit size={16} /></button>
                           <button onClick={() => {setSelectedNode(pt); setDeleteModalOpen(true);}} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. PAGINATION */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Node Page {currentPage}/{totalPages || 1}</p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronLeft size={16}/></button>
              <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronRight size={16}/></button>
            </div>
          </div>
        )}
      </div>

      {/* --- MODALS --- */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] w-full max-w-lg relative z-10 shadow-2xl border border-slate-100 overflow-hidden font-sans">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{selectedNode ? 'Sync Protocol' : 'Initialize Protocol'}</h2>
                    <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-xl transition-colors"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Designation</label>
                        <input
                            type="text" required autoFocus
                            className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                            placeholder="e.g. BAKONG_DIRECT, VISA_SSL, PAYPAL"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            disabled={isProcessing}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <button type="button" className="py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100" onClick={() => setModalOpen(false)}>Abort</button>
                        <button type="submit" disabled={isProcessing || !inputValue.trim()} className="py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
                            {isProcessing ? <Loader2 className="animate-spin" size={16}/> : <CheckCircle2 size={16}/>} Sync Hub
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
                <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">Purge Protocol?</h2>
                <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">Removing gateway <span className="text-slate-900 font-bold underline decoration-red-500">{selectedNode.type}</span> from authorized protocols.</p>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setDeleteModalOpen(false)} className="py-4 text-xs font-black uppercase text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">Abort</button>
                  <button onClick={handleConfirmDelete} disabled={isProcessing} className="py-4 text-xs font-black uppercase text-white bg-red-500 rounded-2xl hover:bg-red-600 shadow-xl shadow-red-200 transition-all flex items-center justify-center gap-2">
                    {isProcessing ? <Loader2 className="animate-spin" size={16}/> : "Execute Purge"}
                  </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function ViewToggle({ icon: Icon, active, onClick }) {
    return (
        <button onClick={onClick} className={`p-2 rounded-xl transition-all ${active ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"}`}>
            <Icon size={18} />
        </button>
    )
}