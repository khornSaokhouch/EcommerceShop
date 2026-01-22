"use client";

import { useState, useEffect, useMemo } from "react";
import { useProductStore } from "../../stores/useProductStore";
import { useUserStore } from "../../stores/userStore";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit, Trash2, Package, Search, AlertTriangle, 
  Loader2, ChevronLeft, ChevronRight, LayoutGrid, Tag, Box, 
  ShieldCheck, ArrowUpRight, Zap
} from "lucide-react";
import AddEditProductForm from "../../components/company/Product/AddEditProductForm";

export default function ProductManagement() {
  const { products, fetchProducts, createProduct, updateProduct, deleteProduct, loading } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { user } = useUserStore();
  const currentUserId = user?.id;

  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    const userProducts = products.filter((p) => p.user_id === currentUserId);
    return userProducts.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = filterCategory === "all" || p.category_id === Number(filterCategory);
      return matchSearch && matchCat;
    }).sort((a, b) => b.id - a.id);
  }, [products, searchTerm, filterCategory, currentUserId]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSave = async (formData) => {
    setActionLoading(true);
    const tid = toast.loading("Syncing Node Data...");
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData);
        toast.success("Unit Protocol Updated", { id: tid });
      } else {
        await createProduct(formData);
        toast.success("New Unit Initialized", { id: tid });
      }
      setEditingProduct(null);
      setIsCreating(false);
    } catch (e) {
      toast.error("Registry Sync Failed", { id: tid });
    } finally { setActionLoading(false); }
  };

  const handleConfirmDelete = async () => {
    setActionLoading(true);
    const tid = toast.loading("Purging Node...");
    try {
      await deleteProduct(productToDelete.id);
      toast.success("Unit Purged from Registry", { id: tid });
      setIsDeleteModalOpen(false);
    } catch { toast.error("Purge Failed", { id: tid }); }
    finally { setActionLoading(false); setProductToDelete(null); }
  };

  if (loading && products.length === 0) return (
    <div className="h-[60vh] flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Inventory Grid...</p>
    </div>
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <Box className="w-3 h-3" /> Hardware Registry
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter">Product Catalog</h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">Manage local hardware unit deployments</p>
        </div>
        
        <button 
          onClick={() => { setIsCreating(true); setEditingProduct(null); }}
          className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
                <Plus size={16} /> Deploy New Unit
            </span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text" placeholder="Search by name or SKU..." value={searchTerm}
            onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
          />
        </div>
        <select
            value={filterCategory} onChange={(e) => {setFilterCategory(e.target.value); setCurrentPage(1);}}
            className="px-6 py-3 bg-slate-50 border-none rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all cursor-pointer"
        >
            <option value="all">All Classifications</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Registry Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"># ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hardware Unit</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Valuation</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Status</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedProducts.length === 0 ? (
                <tr><td colSpan="6" className="py-32 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">Registry Entry Empty</td></tr>
              ) : (
                paginatedProducts.map((p, idx) => (
                  <ProductRow key={p.id} product={p} index={(currentPage-1)*itemsPerPage + idx + 1} categories={categories} onEdit={setEditingProduct} onDelete={() => {setProductToDelete(p); setIsDeleteModalOpen(true);}} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Units {(currentPage-1)*itemsPerPage + 1} - {Math.min(currentPage*itemsPerPage, filteredProducts.length)} of {filteredProducts.length}</p>
                <div className="flex gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronLeft size={18}/></button>
                    <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronRight size={18}/></button>
                </div>
            </div>
        )}
      </div>

      <AnimatePresence>
        {(editingProduct || isCreating) && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => {setEditingProduct(null); setIsCreating(false);}} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
             <AddEditProductForm product={editingProduct} onSave={handleSave} onCancel={() => {setEditingProduct(null); setIsCreating(false);}} loading={actionLoading} />
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete} title="Purge Hardware Unit?" loading={actionLoading}>
        Confirm permanent deletion of <span className="text-slate-900 font-bold underline decoration-red-500">{productToDelete?.name}</span> from the hardware registry.
      </ConfirmationModal>
    </div>
  );
}

// --- SUB COMPONENTS ---

function ProductRow({ product, index, categories, onEdit, onDelete }) {
    const cat = categories.find(c => c.id === product.category_id)?.name || "Unassigned";
    const quantity = product?.product_items?.[0]?.quantity_in_stock || 0;
    
    return (
        <tr className="hover:bg-slate-50/30 transition-colors group">
            <td className="px-8 py-5 text-xs font-black text-slate-300">{String(index).padStart(2, '0')}</td>
            <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-[16px] p-0.5 bg-slate-100 group-hover:bg-blue-600 transition-colors">
                        <div className="w-full h-full rounded-[14px] bg-white border-2 border-white overflow-hidden flex items-center justify-center shadow-sm">
                            {product.product_image_url ? <img src={product.product_image_url} className="object-contain p-1" /> : <Package size={16} className="text-slate-200" />}
                        </div>
                    </div>
                    <div>
                        <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[200px]">{product.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic">Node SKU: {product.id}</p>
                    </div>
                </div>
            </td>
            <td className="px-8 py-5">
                <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">{cat}</span>
            </td>
            <td className="px-8 py-5 font-black text-slate-900 tracking-tighter">${Number(product.price).toFixed(0)}</td>
            <td className="px-8 py-5">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${quantity > 10 ? "bg-emerald-500 animate-pulse" : quantity > 0 ? "bg-amber-500" : "bg-rose-500"}`} />
                    <span className="text-[10px] font-black uppercase text-slate-600">{quantity > 0 ? `In Stock (${quantity})` : "Depleted"}</span>
                </div>
            </td>
            <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(product)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-blue-100"><Edit size={16}/></button>
                    <button onClick={onDelete} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-red-100"><Trash2 size={16}/></button>
                </div>
            </td>
        </tr>
    );
}

function ConfirmationModal({ isOpen, onClose, onConfirm, title, children, loading }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 text-center">
            <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6 mx-auto"><Trash2 className="w-8 h-8 text-red-500" /></div>
            <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">{title}</h2>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium italic">{children}</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={onClose} className="py-4 text-xs font-black uppercase text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100">Abort</button>
              <button onClick={onConfirm} disabled={loading} className="py-4 text-xs font-black uppercase text-white bg-red-500 rounded-2xl hover:bg-red-600 shadow-xl shadow-red-200 flex items-center justify-center">
                {loading ? <Loader2 className="animate-spin" size={16}/> : "Purge Unit"}
              </button>
            </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}