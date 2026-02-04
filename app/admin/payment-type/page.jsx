"use client"

import { useEffect, useState, useMemo } from "react"
import { usePaymentStore } from "../../stores/usePaymentStore"
import { useAuthStore } from "../../stores/authStore"
import toast from "react-hot-toast"
import { Plus, Search, Loader2, Wallet, Database } from "lucide-react"
import PaymentAccountsTable from "../../components/admin/payment/PaymentAccountsTable"
import PaymentAccountForm from "../../components/admin/payment/PaymentAccountForm"
import DeletePaymentModal from "../../components/admin/payment/DeletePaymentModal"

export default function PaymentAccountsPage() {
  const {
    payments, loading, search, setSearch,
    fetchPayments, savePayment, deletePayment, togglePaymentStatus
  } = usePaymentStore()

  const token = useAuthStore((state) => state.token)

  const [editingPayment, setEditingPayment] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)

  const stats = useMemo(() => {
    return {
      total: payments.length,
      active: payments.filter(p => p.status).length,
      inactive: payments.filter(p => !p.status).length
    }
  }, [payments])

  useEffect(() => {
    if (token) {
      fetchPayments()
    }
  }, [fetchPayments, token])

  const handleOpenForm = (payment = null) => {
    setEditingPayment(payment)
    setIsFormOpen(true)
  }

  const handleSave = async (data) => {
    try {
      await savePayment(data)
      setIsFormOpen(false)
      toast.success("Payment Account Updated")
    } catch (err) {
      toast.error(err.message || "Operation Failed")
    }
  }

  const handleDelete = async () => {
    try {
      await deletePayment(deleteConfirmId)
      setDeleteConfirmId(null)
      toast.success("Payment Account Deleted")
    } catch (err) {
      toast.error("Deletion Failed")
    }
  }

  const handleToggleStatus = async (id) => {
    try {
      await togglePaymentStatus(id)
      toast.success("Payment Status Toggled")
    } catch (err) {
      toast.error("Status Update Failed")
    }
  }

  return (
    <div className="space-y-8 pb-20">
      {/* 1. Header & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[13px] font-medium uppercase tracking-[0.2em] mb-4 border border-blue-100">
                    <Wallet className="w-3 h-3" /> Payment Hub
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Payment Accounts</h1>
                <p className="text-slate-500 text-[13px] font-medium uppercase tracking-widest mt-2">Manage transaction gateway accounts</p>
            </div>
            <button
                onClick={() => handleOpenForm()}
                className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[13px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                    <Plus size={16} />Add Account
                </span>
            </button>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-center gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Accounts</p>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stats.total}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                    <Database size={20} />
                </div>
            </div>
            
            <div className="h-px bg-slate-50 w-full" />

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-50">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Active</p>
                    <h5 className="text-xl font-black text-emerald-700 tracking-tighter">{stats.active}</h5>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Inactive</p>
                    <h5 className="text-xl font-black text-slate-500 tracking-tighter">{stats.inactive}</h5>
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
            placeholder="Search account name or ID..."
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
              <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">Loading Payment Accounts</p>
           </div>
         ) : (
           <PaymentAccountsTable
              payments={payments}
              search={search}
              onEdit={handleOpenForm}
              onDelete={setDeleteConfirmId}
              onToggleStatus={handleToggleStatus}
           />
         )}
      </div>

      <PaymentAccountForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        editingPayment={editingPayment}
        onSave={handleSave}
      />

      <DeletePaymentModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        payment={payments.find(p => p.id === deleteConfirmId)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
