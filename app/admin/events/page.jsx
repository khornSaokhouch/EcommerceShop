"use client";

import React, { useEffect, useState } from "react";
import { useEventStore } from "../../stores/useEventStore";
import EventModal from "../../components/admin/event/EventModal";
import DeleteConfirmationModal from "../../components/admin/event/DeleteConfirmationModal";
import toast from "react-hot-toast";
import { 
  Plus, Edit, Trash2, Loader2, Image as ImageIcon,
  Zap
} from "lucide-react";

export default function EventManager() {
  const { events, fetchEvents, saveEvent, deleteEvent, loading, error } = useEventStore();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  const handleOpenEventModal = (event = null) => {
    setCurrentEvent(event);
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (formData, eventId) => {
    const tid = toast.loading(eventId ? "Syncing Event Protocol..." : "Initializing New Event...");
    try {
      await saveEvent(formData, eventId);
      toast.success(eventId ? "Event Registry Updated" : "Event Node Initialized", { id: tid });
      setIsEventModalOpen(false);
    } catch (err) {
      toast.error("Protocol Sync Failed", { id: tid });
    }
  };

  const handleDeleteEvent = async () => {
    const tid = toast.loading("Purging Event Node...");
    try {
      if (eventIdToDelete) {
        await deleteEvent(eventIdToDelete);
        toast.success("Event Purged from Registry", { id: tid });
        setIsDeleteModalOpen(false);
      }
    } catch (err) {
      toast.error("Purge Failed", { id: tid });
    }
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700">
      
      {/* 1. Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <Zap className="w-3 h-3" /> Event Registry
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none">Occurence Hub</h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">Manage system-wide promotional and technical events</p>
        </div>
        
        <button 
          onClick={() => handleOpenEventModal()}
          className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-2">
                <Plus size={16} /> Initialize Event
            </span>
        </button>
      </div>

      {/* 2. Content Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        {loading && events.length === 0 ? (
          <div className="py-40 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Event Nodes...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-rose-500 font-bold uppercase text-xs">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"># ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Occurence Node</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Description</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {events.map((event, index) => (
                  <tr key={event.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-5 text-xs font-black text-slate-300">
                        {String(index + 1).padStart(2, '0')}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 p-0.5 group-hover:bg-blue-600 transition-colors">
                            <div className="w-full h-full rounded-[10px] bg-white border-2 border-white overflow-hidden relative shadow-sm">
                                {event.event_image_url ? (
                                    <img src={event.event_image_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon className="m-auto text-slate-200" size={16}/>
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[150px]">
                                {event.name || "Unnamed Node"}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-bold text-slate-400 uppercase">Active Node</span>
                            </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-1 max-w-xs italic">
                            "{event.description || "No registry description..."}"
                        </p>
                    </td>
                    <td className="px-8 py-5">
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-700 uppercase">
                                <span className="text-slate-300">Start:</span> {event.start_date.split("T")[0]}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase">
                                <span className="text-slate-300">End:</span> {event.end_date?.split("T")[0] || "---"}
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                            onClick={() => handleOpenEventModal(event)}
                            className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-blue-100"
                        >
                            <Edit size={16} />
                        </button>
                        <button 
                            onClick={() => { setEventIdToDelete(event.id); setIsDeleteModalOpen(true); }}
                            className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-red-100"
                        >
                            <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
        event={currentEvent}
        onSave={handleSaveEvent}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteEvent}
      />
    </div>
  );
}