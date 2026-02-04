"use client"

import { useEffect, useState, useMemo } from "react"
import { useEventStore } from "../../stores/useEventStore"
import { useAuthStore } from "../../stores/authStore"
import toast from "react-hot-toast"
import { Plus, Search, Loader2, Calendar, Database } from "lucide-react"
import EventsTable from "../../components/admin/event/EventsTable"
import EventModal from "../../components/admin/event/EventModal"
import DeleteEventModal from "../../components/admin/event/DeleteEventModal"

export default function EventsPage() {
  const {
    events, loading, fetchEvents, saveEvent, deleteEvent
  } = useEventStore()

  const token = useAuthStore((state) => state.token)

  const [editingEvent, setEditingEvent] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [search, setSearch] = useState("")

  const stats = useMemo(() => {
    return {
      total: events.length,
      active: events.filter(e => {
        const now = new Date()
        const start = new Date(e.start_date)
        const end = e.end_date ? new Date(e.end_date) : null
        return start <= now && (!end || end >= now)
      }).length
    }
  }, [events])

  useEffect(() => {
    if (token) {
      fetchEvents()
    }
  }, [fetchEvents, token])

  const handleOpenForm = (event = null) => {
    setEditingEvent(event)
    setIsFormOpen(true)
  }

  const handleSave = async (formData, eventId) => {
    try {
      await saveEvent(formData, eventId)
      setIsFormOpen(false)
      toast.success(eventId ? "Event Updated" : "Event Created")
    } catch (err) {
      toast.error(err.message || "Operation Failed")
    }
  }

  const handleDelete = async () => {
    try {
      await deleteEvent(deleteConfirmId)
      setDeleteConfirmId(null)
      toast.success("Event Deleted")
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
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[13px] font-medium uppercase tracking-[0.2em] mb-4 border border-purple-100">
                    <Calendar className="w-3 h-3" /> Event Hub
                </div>
                <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Events Management</h1>
                <p className="text-slate-500 text-[13px] font-medium uppercase tracking-widest mt-2">Manage promotional and system events</p>
            </div>
            <button
                onClick={() => handleOpenForm()}
                className="group relative px-8 py-4 bg-purple-600 text-white rounded-2xl font-bold text-[13px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center gap-2">
                    <Plus size={16} />Add Event
                </span>
            </button>
        </div>
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-center gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Total Events</p>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">{stats.total}</h4>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-inner">
                    <Database size={20} />
                </div>
            </div>
            
            <div className="h-px bg-slate-50 w-full" />

            <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-50">
                    <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Active Now</p>
                    <h5 className="text-xl font-black text-emerald-700 tracking-tighter">{stats.active}</h5>
                </div>
            </div>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="bg-white rounded-[32px] p-4 border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-purple-600 transition-colors" />
          <input
            type="text"
            placeholder="Search event name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-11 pr-4 text-[13px] font-medium text-slate-500 focus:bg-white focus:ring-4 focus:ring-purple-500/5 transition-all outline-none"
          />
        </div>
      </div>

      {/* 3. Content Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm min-h-[400px]">
         {loading ? (
           <div className="py-32 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-purple-600" size={32} />
              <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">Loading Events</p>
           </div>
         ) : (
           <EventsTable
              events={events}
              search={search}
              onEdit={handleOpenForm}
              onDelete={setDeleteConfirmId}
           />
         )}
      </div>

      <EventModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        event={editingEvent}
        onSave={handleSave}
      />

      <DeleteEventModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        event={events.find(e => e.id === deleteConfirmId)}
        onConfirm={handleDelete}
      />
    </div>
  )
}