"use client"

import { useEffect, useState, useMemo } from "react"
import { useOrderStatusStore } from "../../stores/useOrderStatus"
import { useAuthStore } from "../../stores/authStore"
import toast from "react-hot-toast"
import { Plus, Search, Loader2, ListChecks, Database } from "lucide-react"
import OrderStatusTable from "../../components/admin/order-status/OrderStatusTable"
import OrderStatusForm from "../../components/admin/order-status/OrderStatusForm"
import DeleteOrderStatusModal from "../../components/admin/order-status/DeleteOrderStatusModal"

export default function OrderStatusPage() {
  const {
    orderStatuses, loading, fetchOrderStatuses, createOrderStatus, updateOrderStatus, deleteOrderStatus
  } = useOrderStatusStore()

  const token = useAuthStore((state) => state.token)

  const [editingStatus, setEditingStatus] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [search, setSearch] = useState("")

  const stats = useMemo(() => {
    return {
      total: orderStatuses.length
    }
  }, [orderStatuses])

  useEffect(() => {
    if (token) {
      fetchOrderStatuses()
    }
  }, [fetchOrderStatuses, token])

  const handleOpenForm = (status = null) => {
    setEditingStatus(status)
    setIsFormOpen(true)
  }

  const handleSave = async (data, statusId) => {
    try {
      if (statusId) {
        await updateOrderStatus(statusId, data)
      } else {
        await createOrderStatus(data)
      }
      setIsFormOpen(false)
      toast.success(statusId ? "Status Updated" : "Status Created")
    } catch (err) {
      toast.error(err.message || "Operation Failed")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteOrderStatus(deleteConfirmId)
      setDeleteConfirmId(null)
      toast.success("Status Deleted")
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
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-600 rounded-full text-[13px] font-medium uppercase tracking-[0.2em] mb-4 border border-orange-100">
                    <ListChecks className="w-3 h-3" /> Order Status
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Order Status Management</h1>
                <p className="text-slate-500 text-[13px] font-medium uppercase tracking-widest mt-2">Manage order lifecycle statuses</p>
            </div>
            <button
                onClick={() => handleOpenForm()}
                className="group relative px-8 py-4 bg-orange-600 text-white rounded-2xl font-bold text-[13px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-700 via-orange-600 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                    <Plus size={16} />Add Status
                </span>
            </button>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-center gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Statuses</p>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stats.total}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-inner">
                    <Database size={20} />
                </div>
            </div>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-orange-600 transition-colors" />
          <input
            type="text"
            placeholder="Search status name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-[13px] font-medium text-slate-500 focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all outline-none"
          />
        </div>
      </div>

      {/* 3. Content Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm min-h-[400px]">
         {loading ? (
           <div className="py-32 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-orange-600" size={32} />
              <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">Loading Order Statuses</p>
           </div>
         ) : (
           <OrderStatusTable
              orderStatuses={orderStatuses}
              search={search}
              onEdit={handleOpenForm}
              onDelete={setDeleteConfirmId}
           />
         )}
      </div>

      <OrderStatusForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingStatus={editingStatus}
        onSave={handleSave}
      />

      <DeleteOrderStatusModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        orderStatus={orderStatuses.find(s => s.id === deleteConfirmId)}
        onConfirm={handleDelete}
      />
    </div>
  )
}