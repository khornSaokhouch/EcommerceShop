"use client"

import { useState, useMemo } from "react"
import { Edit, Trash2, Calendar, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react"

const EventsTable = ({ events, search, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = useMemo(() => {
    return events.filter(e => 
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.description && e.description.toLowerCase().includes(search.toLowerCase()))
    )
  }, [events, search])

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (filtered.length === 0) return <EmptyState search={search} />;

  return (
    <div>
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest"># ID</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">Event Name</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">Description</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">Timeline</th>
            <th className="px-8 py-5 text-right text-[13px] font-medium text-slate-500 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {paginated.map((event, idx) => (
            <tr key={event.id} className="hover:bg-slate-50/30 transition-colors group">
              <td className="px-8 py-5 text-[13px] font-medium text-slate-300">{String((currentPage-1)*itemsPerPage + idx + 1).padStart(2, '0')}</td>
              <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-100 p-0.5 group-hover:bg-purple-600 transition-colors">
                      <div className="w-full h-full rounded-[10px] bg-white border-2 border-white overflow-hidden relative flex items-center justify-center">
                        {event.event_image_url ? (
                          <img src={event.event_image_url} alt={event.name} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-slate-200" size={16} />
                        )}
                      </div>
                    </div>
                    <span className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">{event.name}</span>
                  </div>
              </td>
              <td className="px-8 py-5">
                <p className="text-[11px] text-slate-500 font-medium line-clamp-2 max-w-xs">
                  {event.description || "No description"}
                </p>
              </td>
              <td className="px-8 py-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-700">
                    <span className="text-slate-400">Start:</span> {event.start_date?.split("T")[0] || "N/A"}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
                    <span className="text-slate-400">End:</span> {event.end_date?.split("T")[0] || "N/A"}
                  </div>
                </div>
              </td>
              <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(event)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-purple-600 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-purple-100"><Edit size={16} /></button>
                  <button onClick={() => onDelete(event.id)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
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
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-purple-600 transition-all shadow-sm"><ChevronLeft size={16}/></button>
          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-purple-600 transition-all shadow-sm"><ChevronRight size={16}/></button>
        </div>
      </div>
    </div>
  )
}

function EmptyState({ search }) {
    return (
        <div className="py-32 text-center flex flex-col items-center gap-4">
            <Calendar size={48} className="text-slate-100" />
            <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">
                {search ? `No event found for "${search}"` : "No events available"}
            </p>
        </div>
    )
}

export default EventsTable
