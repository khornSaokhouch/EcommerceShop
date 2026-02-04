"use client"

import { useEffect, useState, useMemo } from "react"
import { useSizeStore } from "../../stores/useSizeStore"
import { useAuthStore } from "../../stores/authStore"
import toast from "react-hot-toast"
import { Plus, Search, Loader2, Ruler, Database } from "lucide-react"
import SizesTable from "../../components/admin/size/SizesTable"
import SizeForm from "../../components/admin/size/SizeForm"
import DeleteSizeModal from "../../components/admin/size/DeleteSizeModal"

export default function SizesPage() {
  const {
    sizes, loading, fetchSizes, saveSize, deleteSize
  } = useSizeStore()

  const token = useAuthStore((state) => state.token)

  const [editingSize, setEditingSize] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [search, setSearch] = useState("")

  const stats = useMemo(() => {
    return {
      total: sizes.length
    }
  }, [sizes])

  useEffect(() => {
    if (token) {
      fetchSizes()
    }
  }, [fetchSizes, token])

  const handleOpenForm = (size = null) => {
    setEditingSize(size)
    setIsFormOpen(true)
  }

  const handleSave = async (data) => {
    try {
      await saveSize(data)
      setIsFormOpen(false)
      toast.success("Size Saved Successfully")
    } catch (err) {
      toast.error(err.message || "Operation Failed")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteSize(deleteConfirmId)
      setDeleteConfirmId(null)
      toast.success("Size Deleted")
    } catch (err) {
      toast.error("Deletion Failed")
    }
  }

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[13px] font-medium uppercase tracking-[0.2em] mb-4 border border-green-100">
                    <Ruler className="w-3 h-3" /> Size 
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Sizes Dashboard</h1>
                <p className="text-slate-500 text-[13px] font-medium uppercase tracking-widest mt-2">Manage product size options</p>
            </div>
            <button
                onClick={() => handleOpenForm()}
                className="group relative px-8 py-4 bg-green-600 text-white rounded-2xl font-bold text-[13px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-green-700 via-green-600 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                    <Plus size={16} />Add Size
                </span>
            </button>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-center gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Sizes</p>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stats.total}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center shadow-inner">
                    <Database size={20} />
                </div>
            </div>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-green-600 transition-colors" />
          <input
            type="text"
            placeholder="Search size name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-[13px] font-medium text-slate-500 focus:bg-white focus:ring-4 focus:ring-green-500/5 transition-all outline-none"
          />
        </div>
      </div>

      {/* 3. Content Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm min-h-[400px]">
         {loading ? (
           <div className="py-32 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-green-600" size={32} />
              <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">Loading Sizes</p>
           </div>
         ) : (
           <SizesTable
              sizes={sizes}
              search={search}
              onEdit={handleOpenForm}
              onDelete={setDeleteConfirmId}
           />
         )}
      </div>

      <SizeForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingSize={editingSize}
        onSave={handleSave}
      />

      <DeleteSizeModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        size={sizes.find(s => s.id === deleteConfirmId)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
