"use client";

import React, { useEffect, useState } from "react";
import { useCompanyInfoStore } from "../../stores/useCompanyInfoStore";
import StoreCard from "../../components/user/StoreCard";
import { Loader2, Store, Search, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export default function StoresPage() {
  const { companies, fetchCompanies, loading } = useCompanyInfoStore();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const filteredStores = Array.isArray(companies)
    ? companies.filter((s) =>
        s.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-[10px]">
          Syncing Vendor Database
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-20 ">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 border border-blue-100">
              <Store className="w-3 h-3" /> Technocore Network
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-4">
              Explore Our <br/>
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent uppercase">
                Official Stores
              </span>
            </h1>
            <p className="text-slate-500 font-medium leading-relaxed">
              Connect directly with verified hardware manufacturers and 
              exclusive distributors within our global ecosystem.
            </p>
          </div>

          {/* Search Bar - Matching Dashboard Style */}
          <div className="relative w-full lg:w-96 group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search manufacturers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-14 py-5 bg-white border border-slate-100 rounded-[24px] shadow-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all text-sm font-bold text-slate-800"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-slate-50 rounded-xl">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center gap-6 mb-10">
          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] whitespace-nowrap">
            {filteredStores.length} Verified Partners Found
          </span>
          <div className="h-px w-full bg-gradient-to-r from-slate-100 to-transparent" />
        </div>

        {/* Store Grid */}
        {filteredStores.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
          >
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </motion.div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
               <Store className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">No results found</h3>
            <p className="text-slate-400 font-medium">Try searching for a different brand or distributor.</p>
          </div>
        )}
      </div>
    </div>
  );
}