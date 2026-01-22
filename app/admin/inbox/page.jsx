"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Inbox, CheckCircle2, XCircle, Clock, Search, ChevronLeft,
  ChevronRight, FileText, ShieldCheck, User, Mail, Phone,
  MapPin, ExternalLink, Loader2, Database,
  PanelLeftClose, PanelLeftOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useCompanyStore } from "../../stores/useCompanyStore";

// --- 1. SIDEBAR NAVIGATION (COLLAPSIBLE TO ICONS) ---
const RegistrySidebar = ({ active, setActive, counts, isExpanded }) => {
  const folders = [
    { id: "all", label: "All ", icon: Database },
    { id: "pending", label: "Pending ", icon: Clock },
    { id: "approved", label: "Approved ", icon: CheckCircle2 },
    { id: "rejected", label: "Rejected ", icon: XCircle },
  ];

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isExpanded ? 280 : 85 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="flex-shrink-0 border-r border-slate-100 flex flex-col bg-white overflow-hidden"
    >
      {/* Header Section */}
      <div className={`p-8 whitespace-nowrap ${!isExpanded ? "flex flex-col items-center px-0" : ""}`}>
        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-1">
            {isExpanded ? "System" : "SYS"}
        </p>
        {isExpanded ? (
          <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Registry Inbox</h1>
        ) : (
          <Database size={20} className="text-slate-900 mt-2" />
        )}
      </div>

      {/* Navigation Nodes */}
      <nav className="flex-1 px-3 space-y-2">
        {folders.map((folder) => {
          const isSelected = active === folder.id;
          return (
            <button
              key={folder.id}
              onClick={() => setActive(folder.id)}
              className={`relative w-full flex items-center rounded-2xl transition-all duration-300 group
                ${isExpanded ? "px-4 py-3.5 justify-between" : "p-3.5 justify-center"}
                ${isSelected ? "bg-blue-50/50" : "hover:bg-slate-50"}`}
              title={!isExpanded ? folder.label : ""}
            >
              {isSelected && isExpanded && (
                <motion.div layoutId="folderActive" className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full" />
              )}
              
              <div className="flex items-center gap-3 relative z-10">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all 
                  ${isSelected ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"}`}
                >
                  <folder.icon size={18} />
                </div>
                
                {isExpanded && (
                  <motion.span 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className={`text-[11px] font-black uppercase tracking-widest transition-colors
                      ${isSelected ? "text-slate-900" : "text-slate-500 group-hover:text-slate-900"}`}>
                    {folder.label}
                  </motion.span>
                )}
              </div>

              {isExpanded && (
                <span className={`text-[10px] font-black px-2 py-1 rounded-lg border
                  ${isSelected ? "bg-white border-blue-100 text-blue-600" : "bg-slate-50 border-slate-100 text-slate-400"}`}>
                  {counts[folder.id] || 0}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </motion.aside>
  );
};

// --- 2. LIST ITEM COMPONENT ---
const SellerListItem = ({ seller, onSelect, isSelected }) => (
    <div
      onClick={() => onSelect(seller)}
      className={`group flex items-center justify-between p-5 border-b border-slate-50 cursor-pointer transition-all relative
        ${isSelected ? "bg-blue-50/30 font-black" : "hover:bg-slate-50/50"}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-2 h-2 rounded-full 
          ${seller.status === "approved" ? "bg-emerald-500" : seller.status === "rejected" ? "bg-rose-500" : "bg-amber-500 animate-pulse"}`} 
        />
        <div className="min-w-0">
          <p className="text-[12px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[180px]">{seller.company_name}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{seller.name}</p>
        </div>
      </div>
      <ChevronRight size={14} className={`transition-transform duration-300 ${isSelected ? "text-blue-600 translate-x-1" : "text-slate-200 group-hover:text-slate-400"}`} />
    </div>
);

// --- 3. DETAIL VIEW COMPONENT ---
const SellerDetails = ({ seller, onClose, handleAction }) => {
  if (!seller) return (
    <div className="h-full flex flex-col items-center justify-center text-center p-12">
      <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4 border border-slate-100">
        <ShieldCheck size={32} className="text-slate-200" />
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select an entry for verification</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col bg-white">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <div>
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Node ID: #{seller.id}</span>
                <div className="w-1 h-1 bg-slate-200 rounded-full" />
                <span className={`text-[10px] font-black uppercase tracking-widest ${seller.status === 'approved' ? 'text-emerald-500' : 'text-amber-500'}`}>
                    {seller.status || 'Pending Verification'}
                </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 uppercase tracking-tighter">{seller.company_name}</h2>
        </div>
        <button onClick={onClose} className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-colors">
            <ChevronLeft size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-50 pb-10">
            <DetailBlock icon={User} label="Lead Agent" value={seller.name} />
            <DetailBlock icon={Mail} label="Registry Email" value={seller.email} />
            <DetailBlock icon={Phone} label="Terminal Phone" value={seller.phone_number} />
            <DetailBlock icon={MapPin} label="Base Hub" value={`${seller.street_address}, ${seller.country_region}`} />
        </div>

        {seller.document_url && (
            <div className="bg-slate-50 rounded-[24px] p-6 border border-slate-100 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600 border border-slate-100">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-[11px] font-black text-slate-900 uppercase">Registry License</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-xs">PDF Document</p>
                    </div>
                </div>
                <a href={seller.document_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-600 hover:text-blue-600 transition-all shadow-sm">
                    Open <ExternalLink size={12} />
                </a>
            </div>
        )}

        <div className="pt-10">
            <div className="flex flex-wrap gap-4">
                {seller.status !== "approved" && (
                    <button
                        onClick={() => handleAction("approved", seller.id)}
                        className="flex items-center gap-2 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest py-4 px-8 rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-200"
                    >
                        <CheckCircle2 size={16} /> Authorize Hub
                    </button>
                )}
                {seller.status !== "approved" && seller.status !== "rejected" && (
                    <button
                        onClick={() => handleAction("rejected", seller.id)}
                        className="flex items-center gap-2 bg-white border border-slate-200 text-rose-500 font-black text-[10px] uppercase tracking-widest py-4 px-8 rounded-2xl hover:bg-rose-50 hover:border-rose-100 transition-all"
                    >
                        <XCircle size={16} /> Reject Node
                    </button>
                )}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- 4. MAIN PAGE ---
export default function InboxPage() {
  const [activeFolder, setActiveFolder] = useState("all");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExpanded, setIsExpanded] = useState(true);

  const { companies, loading, fetchCompanies, approveCompany, rejectCompany } = useCompanyStore();

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  const counts = useMemo(() => ({
    all: companies.length,
    pending: companies.filter((s) => !s.status || s.status === "pending").length,
    approved: companies.filter((s) => s.status === "approved").length,
    rejected: companies.filter((s) => s.status === "rejected").length,
  }), [companies]);

  const filteredCompanies = useMemo(() => {
    return companies
      .filter((s) => {
        const matchStatus = activeFolder === "all" ? true : activeFolder === "pending" ? (!s.status || s.status === "pending") : s.status === activeFolder;
        const matchSearch = s.name?.toLowerCase().includes(searchQuery.toLowerCase()) || s.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchStatus && matchSearch;
      })
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [companies, activeFolder, searchQuery]);

  const handleAction = async (action, id) => {
    const toastId = toast.loading("Executing Protocol...");
    try {
      if (action === "approved") await approveCompany(id);
      else await rejectCompany(id);
      toast.success(`Node ${action}`, { id: toastId });
      fetchCompanies();
      setSelectedSeller(null);
    } catch (err) { toast.error("Transmission Error", { id: toastId }); }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden">
      
      <RegistrySidebar active={activeFolder} setActive={setActiveFolder} counts={counts} isExpanded={isExpanded} />

      <div className="flex-1 flex flex-row min-w-0">
        <div className="w-[360px] border-r border-slate-100 flex flex-col bg-white shrink-0">
          <div className="p-5 border-b border-slate-50 flex items-center gap-3">
            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            >
                {isExpanded ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-300" />
              <input
                type="text"
                placeholder="Find Email"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-10 pr-4 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 opacity-40">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                    <p className="text-[9px] font-black uppercase tracking-widest">Scanning ...</p>
                </div>
            ) : filteredCompanies.map((seller) => (
              <SellerListItem
                key={seller.id}
                seller={seller}
                onSelect={setSelectedSeller}
                isSelected={selectedSeller?.id === seller.id}
              />
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-0 overflow-hidden bg-white">
            <SellerDetails
              seller={selectedSeller}
              onClose={() => setSelectedSeller(null)}
              handleAction={handleAction}
            />
        </div>
      </div>
    </div>
  );
}

// --- HELPERS ---
const DetailBlock = ({ icon: Icon, label, value }) => (
    <div className="space-y-1">
        <div className="flex items-center gap-2 text-slate-400">
            <Icon size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-sm font-bold text-slate-900">{value || "---"}</p>
    </div>
);