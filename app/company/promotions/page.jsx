"use client";

import React, { useEffect, useState, useMemo } from "react";
import { usePromotionsStore } from "../../stores/usePromotionsStore";
import toast from "react-hot-toast";
import { 
  Plus, Tag, AlertCircle, Loader2, Database, 
  ShieldCheck, Calendar, Zap, TrendingUp, Percent 
} from "lucide-react";

import AddPromotionForm from "../../components/company/promotions/AddPromotionForm";
import EditPromotionModal from "../../components/company/promotions/EditPromotionModal";
import ConfirmDeleteModalPromotions from "../../components/company/promotions/ConfirmDeleteModalPromotions";
import PromotionCard from "../../components/company/promotions/PromotionCard.jsx";

export default function PromotionList() {
  const { promotions, fetchPromotions, deletePromotion, loading, error } = usePromotionsStore();

  const [editingPromotion, setEditingPromotion] = useState(null);
  const [deletingPromotionId, setDeletingPromotionId] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const activePromos = useMemo(() => {
      const now = new Date();
      return promotions.filter(p => new Date(p.end_date) > now).length;
  }, [promotions]);

  const handleConfirmDelete = async () => {
    if (!deletingPromotionId) return;
    const tid = toast.loading("Purging Promo Node...");
    try {
      await deletePromotion(deletingPromotionId);
      toast.success("Protocol Purged", { id: tid });
      setDeletingPromotionId(null);
    } catch (err) {
      toast.error("Purge Failed", { id: tid });
    }
  };

  if (loading && promotions.length === 0) return (
    <div className="h-[60vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Promo Registry...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <Percent className="w-3 h-3" /> Value Protocols
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter">Promotion Schema</h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">Manage active discount nodes and value overrides</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
                <Plus size={16} /> New Promo Node
            </span>
        </button>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatCard label="Registry Nodes" value={promotions.length} sub="Total Protocols" icon={Database} color="blue" />
          <StatCard label="Active Syncs" value={activePromos} sub="Live Reductions" icon={Zap} color="cyan" />
      </div>

      {/* 3. CONTENT AREA */}
      <main>
        {error ? (
          <div className="p-12 text-center bg-red-50 rounded-[32px] border border-red-100">
            <AlertCircle className="mx-auto mb-4 text-red-500" size={32} />
            <p className="text-xs font-black text-red-600 uppercase tracking-widest">{error}</p>
          </div>
        ) : promotions.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[40px] border border-dashed border-slate-200 flex flex-col items-center gap-4">
             <Tag className="text-slate-100" size={48} />
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No discount nodes detected</p>
             <button onClick={() => setIsAddModalOpen(true)} className="text-blue-600 font-black text-[10px] uppercase underline tracking-widest">Initialize First Node</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotions.map((promo) => (
              <PromotionCard
                key={promo.id}
                promotion={promo}
                onEdit={setEditingPromotion}
                onDelete={setDeletingPromotionId}
              />
            ))}
          </div>
        )}
      </main>

      {/* 4. MODALS */}
      <AddPromotionForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />

      {editingPromotion && (
        <EditPromotionModal
          isOpen={!!editingPromotion}
          onClose={() => setEditingPromotion(null)}
          promotion={editingPromotion}
        />
      )}

      <ConfirmDeleteModalPromotions
        isOpen={!!deletingPromotionId}
        onClose={() => setDeletingPromotionId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color }) {
    return (
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
                <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h4>
                <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">{sub}</p>
            </div>
            <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-transform group-hover:scale-110 ${color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-cyan-50 text-cyan-600'}`}>
                <Icon size={28} />
            </div>
        </div>
    );
}