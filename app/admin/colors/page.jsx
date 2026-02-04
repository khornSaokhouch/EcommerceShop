"use client"

import { useEffect, useState, useMemo } from "react"
import { useColorStore } from "../../stores/useColorStore"
import { useAuthStore } from "../../stores/authStore"
import toast from "react-hot-toast"
import { Plus, Search, Loader2, Palette, Database } from "lucide-react"
import ColorsTable from "../../components/admin/color/ColorsTable"
import ColorForm from "../../components/admin/color/ColorForm"
import DeleteColorModal from "../../components/admin/color/DeleteColorModal"

export default function ColorsPage() {
  const {
    colors, loading, fetchColors, saveColor, deleteColor
  } = useColorStore()

  const token = useAuthStore((state) => state.token)

  const [editingColor, setEditingColor] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [search, setSearch] = useState("")

  const stats = useMemo(() => {
    return {
      total: colors.length
    }
  }, [colors])

  useEffect(() => {
    if (token) {
      fetchColors()
    }
  }, [fetchColors, token])

  const handleOpenForm = (color = null) => {
    setEditingColor(color)
    setIsFormOpen(true)
  }

  const handleSave = async (data) => {
    try {
      await saveColor(data)
      setIsFormOpen(false)
      toast.success("Color Saved Successfully")
    } catch (err) {
      toast.error(err.message || "Operation Failed")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteColor(deleteConfirmId)
      setDeleteConfirmId(null)
      toast.success("Color Deleted")
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
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[13px] font-medium uppercase tracking-[0.2em] mb-4 border border-blue-100">
                    <Palette className="w-3 h-3" /> Color Hub
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Colors Dashboard</h1>
                <p className="text-slate-500 text-[13px] font-medium uppercase tracking-widest mt-2">Manage product color options</p>
            </div>
            <button
                onClick={() => handleOpenForm()}
                className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[13px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                    <Plus size={16} />Add Color
                </span>
            </button>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-center gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Colors</p>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stats.total}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                    <Database size={20} />
                </div>
            </div>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search color name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-[13px] font-medium text-slate-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
          />
        </div>
      </div>

      {/* 3. Content Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm min-h-[400px]">
         {loading ? (
           <div className="py-32 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">Loading Colors</p>
           </div>
         ) : (
           <ColorsTable
              colors={colors}
              search={search}
              onEdit={handleOpenForm}
              onDelete={setDeleteConfirmId}
           />
         )}
      </div>

      <ColorForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingColor={editingColor}
        onSave={handleSave}
      />

      <DeleteColorModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        color={colors.find(c => c.id === deleteConfirmId)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
