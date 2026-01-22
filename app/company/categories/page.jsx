"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Search, Shapes, AlertCircle, Loader2, Database, ChevronRight, LayoutGrid, Box } from "lucide-react";
import { useCategoryStore } from "../../stores/useCategoryStore";

export default function CategoriesPage() {
  const { categories, loading, error, fetchCategories } = useCategoryStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500 font-sans">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <LayoutGrid className="w-3.5 h-3.5" /> Catalog Architecture
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Classification <span className="text-blue-600">Nodes</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2">Browse the structural hierarchy of the hardware registry</p>
        </div>

        {/* Technical Search Node */}
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search Registry Node..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all"
          />
        </div>
      </div>

      {/* 2. REGISTRY CONTENT */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
        {loading ? (
            <TableLoader />
        ) : error ? (
            <div className="py-20 text-center px-6">
                <AlertCircle className="mx-auto mb-4 text-rose-500" size={32} />
                <p className="text-[11px] font-black text-rose-600 uppercase tracking-widest">Connection Protocol Failed</p>
                <p className="text-slate-400 text-xs mt-1">{error}</p>
            </div>
        ) : filteredCategories.length === 0 ? (
            <div className="py-32 text-center flex flex-col items-center gap-4">
                <Database className="text-slate-100" size={48} />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {searchTerm ? `No node matching "${searchTerm}"` : "Registry database empty"}
                </p>
            </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest"># ID</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category Node</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registry Load</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCategories.map((cat, idx) => (
                  <tr key={cat.id} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                    <td className="px-8 py-5 text-xs font-black text-slate-300 group-hover:text-blue-500 transition-colors">
                        {String(idx + 1).padStart(2, '0')}
                    </td>
                    <td className="px-8 py-5 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-[18px] p-0.5 bg-slate-100 group-hover:bg-blue-600 transition-colors">
                           <div className="w-full h-full rounded-[16px] bg-white border-2 border-white overflow-hidden flex items-center justify-center relative shadow-sm">
                                {cat.image_url ? (
                                    <img src={cat.image_url} alt={cat.name} className="w-full h-full object-contain p-1" />
                                ) : (
                                    <Shapes className="text-slate-200" size={18} />
                                )}
                           </div>
                        </div>
                        <div>
                            <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight">{cat.name}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Verified Classification</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                         <div className="h-1.5 w-24 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                            <div 
                                className="h-full bg-blue-600 rounded-full" 
                                style={{ width: `${Math.min((cat.product_count || 0) * 5, 100)}%` }} 
                            />
                         </div>
                         <span className="text-[10px] font-black text-blue-600 uppercase">
                            {cat.product_count || 0} Units
                         </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-100">
                          <ChevronRight size={18} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FOOTER METADATA */}
      <div className="flex items-center justify-center gap-3 opacity-30 py-4">
          <Box size={14} className="text-slate-400" />
          <span className="text-[9px] font-black text-slate-900 uppercase tracking-[0.4em]">Hardware Protocol v4.0.1</span>
      </div>
    </div>
  );
}

// --- TABLE LOADER COMPONENT ---
function TableLoader() {
    return (
        <div className="p-20 text-center flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Sourcing Nodes...</p>
        </div>
    );
}