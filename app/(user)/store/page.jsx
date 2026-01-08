"use client";

import React, { useEffect, useState } from "react";
import { useCompanyInfoStore } from "../../stores/useCompanyInfoStore";
import StoreCard from "../../components/user/StoreCard";
import { Loader2, Store, Search } from "lucide-react";
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
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
          Accessing Vendor Registry...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 pt-10">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
              <Store className="w-3 h-3" /> Certified Partners
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Browse{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Official Stores
              </span>
            </h1>
            <p className="text-slate-500 max-w-md">
              Connect directly with world-class hardware manufacturers and
              verified tech distributors.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
            />
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Showing {filteredStores.length} Verified Vendors
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Store Grid */}
        {filteredStores.length > 0 ? (
          // ... inside StoresPage.js return
          // ... inside StoresPage.js return
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            /* 
     grid-cols-2: 2 cards on mobile phones 
     lg:grid-cols-4: Exactly 4 cards on laptops/desktops
     gap-4: Smaller gap between cards to prevent wide layout
  */
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {filteredStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </motion.div>
        ) : (
          <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
            <Store className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="font-bold text-slate-400">
              No stores match your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
