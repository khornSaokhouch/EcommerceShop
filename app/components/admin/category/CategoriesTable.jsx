"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Edit, Trash2, Eye, Package, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import Image from "next/image";

const CategoriesTable = ({ categories, search, onEdit, onDelete, viewMode }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = viewMode === "grid" ? 8 : 10

  const filtered = useMemo(() => {
    return categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
  }, [categories, search])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (filtered.length === 0) return <EmptyState search={search} />;

  return (
    <div>
      {viewMode === "grid" ? (
        <div className="p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {paginated.map(cat => <CategoryCard key={cat.id} category={cat} onEdit={onEdit} onDelete={onDelete} />)}
        </div>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"># ID</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Classification Node</th>
              <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map((cat, idx) => (
              <tr key={cat.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-8 py-5 text-xs font-black text-slate-300">{String((currentPage-1)*itemsPerPage + idx + 1).padStart(2, '0')}</td>
                <td className="px-8 py-5">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 p-0.5 group-hover:bg-blue-600 transition-colors">
                      <div className="w-full h-full rounded-[10px] bg-white border-2 border-white overflow-hidden relative">
  {cat.image_url ? (
    <Image
      src={cat.image_url}
      alt={cat.name}
      fill
      className="object-cover"
    />
  ) : (
    <Package className="m-auto text-slate-200" size={16} />
  )}
</div>

                      </div>
                      <span className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{cat.name}</span>
                   </div>
                </td>
                <td className="px-8 py-5">
                   <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase rounded-lg border border-emerald-100">Synchronized</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onEdit(cat)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-blue-100"><Edit size={16} /></button>
                    <button onClick={() => onDelete(cat.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      
      {/* Pagination Footer */}
      <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between rounded-b-[32px]">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Page {currentPage} / {totalPages || 1}</p>
        <div className="flex gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronLeft size={16}/></button>
          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronRight size={16}/></button>
        </div>
      </div>
    </div>
  )
}

function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-[24px] border border-slate-100 p-4 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group relative">
       <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-4 p-4 relative">
          <div className="w-full h-full rounded-xl bg-white flex items-center justify-center border-2 border-slate-100 overflow-hidden shadow-inner">
             {category.image_url ? <img src={category.image_url} className="object-contain w-full h-full p-2" /> : <Package size={40} className="text-slate-100" />}
          </div>
          <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
             <button onClick={() => onEdit(category)} className="p-2 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-blue-600"><Edit size={14}/></button>
             <button onClick={() => onDelete(category.id)} className="p-2 bg-white text-red-500 rounded-xl shadow-lg hover:bg-red-50"><Trash2 size={14}/></button>
          </div>
       </div>
       <div className="px-2">
          <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight truncate">{category.name}</h4>
          <Link href={`/admin/category/${category.id}`} className="mt-4 flex items-center justify-between group/link">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/link:text-blue-600 transition-colors">Inspect Node</span>
             <ArrowUpRight size={16} className="text-slate-200 group-hover/link:text-blue-600 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all" />
          </Link>
       </div>
    </div>
  )
}

function EmptyState({ search }) {
    return (
        <div className="py-32 text-center flex flex-col items-center gap-4">
            <Package size={48} className="text-slate-100" />
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                {search ? `No classification found for "${search}"` : "Registry inventory empty"}
            </p>
        </div>
    )
}

export default CategoriesTable