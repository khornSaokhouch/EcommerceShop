"use client"

import { useState, useMemo } from "react"
import { Edit, Trash2, Ruler, ChevronLeft, ChevronRight } from "lucide-react"

const SizesTable = ({ sizes, search, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = useMemo(() => {
    return sizes.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
  }, [sizes, search])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (filtered.length === 0) return <EmptyState search={search} />;

  return (
    <div>
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest"># ID</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">Size Name</th>
            <th className="px-8 py-5 text-right text-[13px] font-medium text-slate-500 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {paginated.map((size, idx) => (
            <tr key={size.id} className="hover:bg-slate-50/30 transition-colors group">
              <td className="px-8 py-5 text-[13px] font-medium text-slate-300">{String((currentPage-1)*itemsPerPage + idx + 1).padStart(2, '0')}</td>
              <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 p-0.5 group-hover:bg-green-600 transition-colors">
                      <div className="w-full h-full rounded-[10px] bg-white border-2 border-white overflow-hidden relative flex items-center justify-center">
                        <Ruler className="text-slate-200" size={16} />
                      </div>
                    </div>
                    <span className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">{size.name}</span>
                  </div>
              </td>
              <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(size)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-green-600 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-green-100"><Edit size={16} /></button>
                  <button onClick={() => onDelete(size.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
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
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-green-600 transition-all shadow-sm"><ChevronLeft size={16}/></button>
          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-green-600 transition-all shadow-sm"><ChevronRight size={16}/></button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ search }) {
    return (
        <div className="py-32 text-center flex flex-col items-center gap-4">
            <Ruler size={48} className="text-slate-100" />
            <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">
                {search ? `No size found for "${search}"` : "No sizes available"}
            </p>
        </div>
    )
}

export default SizesTable
