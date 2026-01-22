"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useCategoryStore } from "../../stores/useCategoryStore"
import { useAuthStore } from "../../stores/authStore"
import toast from "react-hot-toast";
import { 
  Plus, Search, RefreshCw, Package, LayoutGrid, List, 
  ChevronLeft, ChevronRight, Loader2, Database, Tag
} from "lucide-react"
import CategoriesTable from "../../components/admin/category/CategoriesTable"
import CategoryForm from "../../components/admin/category/CategoryForm"
import DeleteCategoryModal from "../../components/admin/category/DeleteCategoryModal"

export default function CategoriesPage() {
  const { categories, loading, error, fetchCategories, saveCategory, deleteCategory, search, setSearch } = useCategoryStore()
  const token = useAuthStore((state) => state.token)

  const [editingCategory, setEditingCategory] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [viewMode, setViewMode] = useState("grid")

  useEffect(() => {
    if (token) fetchCategories();
  }, [fetchCategories, token]);

  const handleOpenForm = (category = null) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleSave = async (data) => {
    try {
      await saveCategory(data);
      setIsFormOpen(false);
      toast.success("Registry Classification Updated");
    } catch (err) {
      toast.error(err.message || "Protocol Failure");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(deleteConfirmId);
      setDeleteConfirmId(null);
      toast.success("Node Classification Purged");
    } catch (err) {
      toast.error("Deletion Failed");
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100">
                    <Tag className="w-3 h-3" /> Classification Hub
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Category Dashboard</h1>
                <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2">Manage system-wide hardware classifications</p>
            </div>
            <button
                onClick={() => handleOpenForm()}
                className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                    <Plus size={16} />Add Category
                </span>
            </button>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Catalog Nodes</p>
                <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{categories.length}</h4>
                <p className="text-[10px] font-bold text-blue-500 uppercase mt-1">Active Classifications</p>
            </div>
            <div className="w-16 h-16 rounded-[24px] bg-blue-50 text-blue-600 flex items-center justify-center">
                <Database size={28} />
            </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search classification..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-xs font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
           <ViewToggle icon={LayoutGrid} active={viewMode === 'grid'} onClick={() => setViewMode('grid')} />
           <ViewToggle icon={List} active={viewMode === 'table'} onClick={() => setViewMode('table')} />
        </div>
      </div>

      {/* 3. Content Table/Grid */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm min-h-[400px]">
         {loading ? (
           <div className="py-32 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Catalog Nodes</p>
           </div>
         ) : (
           <CategoriesTable
              categories={categories}
              search={search}
              viewMode={viewMode}
              onEdit={handleOpenForm}
              onDelete={setDeleteConfirmId}
           />
         )}
      </div>

      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingCategory={editingCategory}
        onSave={handleSave}
      />

      <DeleteCategoryModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        category={categories.find(c => c.id === deleteConfirmId)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

function ViewToggle({ icon: Icon, active, onClick }) {
    return (
        <button 
            onClick={onClick}
            className={`p-2 rounded-xl transition-all ${active ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
        >
            <Icon size={18} />
        </button>
    )
}