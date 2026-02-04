"use client"

import { useState, useMemo } from "react"
import { Edit, Trash2, Wallet, ChevronLeft, ChevronRight } from "lucide-react"

const PaymentAccountsTable = ({ payments, search, onEdit, onDelete, onToggleStatus }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = useMemo(() => {
    return payments.filter(p => 
      p.account_name.toLowerCase().includes(search.toLowerCase()) ||
      p.account_id.toLowerCase().includes(search.toLowerCase())
    )
  }, [payments, search])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (filtered.length === 0) return <EmptyState search={search} />;

  return (
    <div>
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest"># ID</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">Account Name</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">Account ID</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">Type</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">Currency</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">Status</th>
            <th className="px-8 py-5 text-right text-[13px] font-medium text-slate-500 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {paginated.map((payment, idx) => (
            <tr key={payment.id} className="hover:bg-slate-50/30 transition-colors group">
              <td className="px-8 py-5 text-[13px] font-medium text-slate-300">{String((currentPage-1)*itemsPerPage + idx + 1).padStart(2, '0')}</td>
              <td className="px-8 py-5">
                 <div className="flex items-center gap-4">
  <div className="w-12 h-12 rounded-xl bg-slate-100 p-0.5 group-hover:bg-blue-600 transition-colors">
    <div className="w-full h-full rounded-[10px] bg-white border-2 border-white overflow-hidden relative flex items-center justify-center">
      <img 
        src="/payment/bakong.png"  // replace with your image path
        alt="Wallet" 
        className="w-6 h-6 object-contain" 
      />
    </div>
  </div>
  <span className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">
    {payment.account_name}
  </span>
</div>

              </td>
              <td className="px-8 py-5">
                <span className="text-[13px] font-medium text-slate-600">{payment.account_id}</span>
              </td>
              <td className="px-8 py-5">
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 uppercase">
                  {payment.type_value}
                </span>
              </td>
              <td className="px-8 py-5">
                <span className="text-[13px] font-medium text-slate-600">{payment.currency}</span>
              </td>
              <td className="px-8 py-5">
                  <button 
                  onClick={() => onToggleStatus(payment.id)}
                  className={`px-3 py-1 rounded-lg border text-[11px] font-bold uppercase transition-all ${
                    payment.status 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100" 
                      : "bg-slate-50 text-slate-400 border-slate-100 hover:bg-slate-100"
                  }`}
                  >
                    {payment.status ? "Active" : "Inactive"}
                  </button>
              </td>
              <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(payment)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-blue-100"><Edit size={16} /></button>
                  <button onClick={() => onDelete(payment.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {/* Pagination Footer */}
      <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between rounded-b-[32px]">
        <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">Page {currentPage} / {totalPages || 1}</p>
        <div className="flex gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronLeft size={16}/></button>
          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronRight size={16}/></button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ search }) {
    return (
        <div className="py-32 text-center flex flex-col items-center gap-4">
            <Wallet size={48} className="text-slate-100" />
            <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">
                {search ? `No payment account found for "${search}"` : "No payment accounts configured"}
            </p>
        </div>
    )
}

export default PaymentAccountsTable
