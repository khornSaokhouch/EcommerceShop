"use client";

import { useEffect, useState, useMemo } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { useStore } from "../../stores/useStore";
import { useAuthStore } from "../../stores/authStore";

import Image from "next/image";
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Edit,
  Trash2,
  Package,
  Loader2,
  AlertCircle,
  Store,
  Tag,
  Plus,
  ArrowUpRight,
  Box,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const PAGE_SIZE = 10; // Standardized to 10 per page

export default function ProductsPage() {
  const { products, loading, error, fetchAllProducts, deleteProduct } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { stores, fetchStores } = useStore();
  const token = useAuthStore((state) => state.token);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStore, setFilterStore] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (token) {
        fetchAllProducts();
        fetchCategories();
        fetchStores();
    }
  }, [token, fetchAllProducts, fetchCategories, fetchStores]);

  // Combined Processing: Filter + Search
  const filteredList = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "all" || p.category_id === Number(filterCategory);
      const matchesStore = filterStore === "all" || p.store_id === Number(filterStore);
      return matchesSearch && matchesCategory && matchesStore;
    }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [products, searchTerm, filterCategory, filterStore]);

  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const displayedProducts = filteredList.slice(startIndex, startIndex + PAGE_SIZE);

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || "Unassigned";
  const getStoreName = (id) => stores.find((s) => s.id === id)?.name || "Direct Node";

  const handleConfirmDelete = async () => {
    setActionLoading(true);
    try {
      await deleteProduct(productToDelete.id);
      toast.success("Unit Purged from Registry");
      setIsDeleteModalOpen(false);
    } catch {
      toast.error("Operation Failed");
    } finally {
      setActionLoading(false);
      setProductToDelete(null);
    }
  };

  if (loading && products.length === 0) return (
    <div className="h-[60vh] flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
        <p className="text-[13px] font-medium text-slate-500 uppercase tracking-[0.3em]">Decrypting Inventory Grid...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[13px] font-medium uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <Package className="w-3 h-3" /> System Catalog
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Hardware Units</h1>
          <p className="text-slate-500 text-[13px] font-medium uppercase tracking-widest mt-1">Manage global hardware deployment registry</p>
        </div>
        
        <button className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[13px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
                <Plus size={16} /> Deploy New Unit
            </span>
        </button>
      </div>

      {/* 2. FILTER & SEARCH TERMINAL */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col xl:flex-row items-center gap-4">
        <div className="relative w-full xl:flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search unit name or hardware UID..."
            value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <FilterSelect icon={Tag} value={filterCategory} onChange={setFilterCategory} options={categories} placeholder="All Categories" />
            <FilterSelect icon={Store} value={filterStore} onChange={setFilterStore} options={stores} placeholder="All Hubs" />
        </div>
      </div>

      {/* 3. REGISTRY TABLE */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest"># ID</th>
                <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">Hardware Node</th>
                <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">Protocol</th>
                <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">Valuation</th>
                <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">Stock Status</th>
                <th className="px-8 py-5 text-right text-[13px] font-medium text-slate-500 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayedProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-24 text-center">
                    <Box className="mx-auto mb-4 text-slate-200" size={40} />
                    <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">Registry Entry Empty</p>
                  </td>
                </tr>
              ) : (
                displayedProducts.map((product, index) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    index={startIndex + index + 1}
                    categoryName={getCategoryName(product.category_id)}
                    storeName={getStoreName(product.store_id)}
                    onDelete={() => {setProductToDelete(product); setIsDeleteModalOpen(true);}}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 4. PAGINATION TERMINAL */}
        {totalPages > 1 && (
          <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">
              Units {startIndex + 1} - {Math.min(startIndex + PAGE_SIZE, filteredList.length)} of {filteredList.length}
            </p>
            <div className="flex gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronLeft size={18}/></button>
              <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronRight size={18}/></button>
            </div>
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Purge Hardware Node?"
        loading={actionLoading}
      >
        Confirm permanent deletion of <span className="text-slate-900 font-bold underline decoration-red-500">{productToDelete?.name}</span> from inventory.
      </ConfirmationModal>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function FilterSelect({ icon: Icon, value, onChange, options, placeholder }) {
    return (
        <div className="relative group min-w-[200px]">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full appearance-none bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-10 text-[13px] font-medium uppercase tracking-widest text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all cursor-pointer"
            >
                <option value="all">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
            </select>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none rotate-90" />
        </div>
    );
}

function ProductRow({ product, index, categoryName, storeName, onDelete }) {
  const quantity = product?.product_items?.[0]?.quantity_in_stock || 0;
  
  return (
    <tr className="hover:bg-slate-50/30 transition-colors group">
      <td className="px-8 py-5 text-xs font-black text-slate-300">
        {String(index).padStart(2, '0')}
      </td>
      <td className="px-8 py-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[18px] p-0.5 bg-slate-100 group-hover:bg-blue-600 transition-colors">
            <div className="w-full h-full rounded-[16px] bg-white border-2 border-white overflow-hidden flex items-center justify-center relative shadow-sm">
                {product.product_image_url ? (
                    <img src={product.product_image_url} alt="" className="w-full h-full object-contain p-1" />
                ) : (
                    <Package size={16} className="text-slate-200" />
                )}
            </div>
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight truncate max-w-[250px]">{product.name}</p>
            <p className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">SKU: {product.id}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-5">
        <div className="space-y-1">
            <p className="text-[11px] font-bold text-blue-600 uppercase tracking-tight">{categoryName}</p>
            <p className="text-[11px] font-medium text-slate-500 uppercase">{storeName}</p>
        </div>
      </td>
      <td className="px-8 py-5 text-sm font-black text-slate-900 tracking-tighter">
        ${Number(product.price).toFixed(0)}
      </td>
      <td className="px-8 py-5">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-widest border ${
            quantity > 10 ? "bg-emerald-50 text-emerald-600 border-emerald-100" : 
            quantity > 0 ? "bg-amber-50 text-amber-600 border-amber-100" : 
            "bg-rose-50 text-rose-600 border-rose-100"
        }`}>
            {quantity > 0 ? `In Stock (${quantity})` : "Depleted"}
        </span>
      </td>
      <td className="px-8 py-5 text-right">
        <div className="flex justify-end gap-2">
          <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-blue-100"><Edit size={16} /></button>
          <button onClick={onDelete} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
        </div>
      </td>
    </tr>
  );
}

function ConfirmationModal({ isOpen, onClose, onConfirm, title, children, loading }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 text-center">
            <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6 mx-auto"><Trash2 className="w-8 h-8 text-red-500" /></div>
            <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{title}</h2>
            <p className="text-[13px] text-slate-500 mb-8 leading-relaxed font-medium">{children}</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onClose} className="py-4 text-[13px] font-bold uppercase text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">Abort</button>
              <button onClick={onConfirm} disabled={loading} className="py-4 text-[13px] font-bold uppercase text-white bg-red-500 rounded-2xl hover:bg-red-600 shadow-xl shadow-red-200 transition-all flex items-center justify-center">
                {loading ? <Loader2 className="animate-spin" size={16}/> : "Execute Purge"}
              </button>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}