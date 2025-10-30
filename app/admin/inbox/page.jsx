"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Inbox,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { useCompanyStore } from "../../stores/useCompanyStore";

// ✅ Sidebar
const Sidebar = ({ active, setActive, counts }) => (
  <aside className="w-64 flex-shrink-0 border-r border-slate-200 p-4 flex flex-col">
    <h1 className="text-3xl font-bold text-slate-800 py-3 text-center">
      Seller Inbox
    </h1>

    <div className="mt-6">
      <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase">
        Filter by Status
      </h3>

      <nav className="mt-2 space-y-1">
        {/* All */}
        <button
          onClick={() => setActive("all")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            active === "all"
              ? "bg-blue-100 text-blue-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <Inbox
              className={`w-5 h-5 ${
                active === "all" ? "text-blue-600" : "text-slate-500"
              }`}
            />
            <span>All</span>
          </div>
          <span
            className={`text-xs font-bold ${
              active === "all" ? "text-blue-700" : "text-slate-500"
            }`}
          >
            {counts.all}
          </span>
        </button>

        {/* Pending */}
        <button
          onClick={() => setActive("pending")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            active === "pending"
              ? "bg-yellow-100 text-yellow-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <Clock
              className={`w-5 h-5 ${
                active === "pending" ? "text-yellow-600" : "text-slate-500"
              }`}
            />
            <span>Pending</span>
          </div>
          <span
            className={`text-xs font-bold ${
              active === "pending" ? "text-yellow-700" : "text-slate-500"
            }`}
          >
            {counts.pending}
          </span>
        </button>

        {/* Approved */}
        <button
          onClick={() => setActive("approved")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            active === "approved"
              ? "bg-green-100 text-green-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle
              className={`w-5 h-5 ${
                active === "approved" ? "text-green-600" : "text-slate-500"
              }`}
            />
            <span>Approved</span>
          </div>
          <span
            className={`text-xs font-bold ${
              active === "approved" ? "text-green-700" : "text-slate-500"
            }`}
          >
            {counts.approved}
          </span>
        </button>

        {/* Rejected */}
        <button
          onClick={() => setActive("rejected")}
          className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            active === "rejected"
              ? "bg-red-100 text-red-700"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <div className="flex items-center gap-3">
            <XCircle
              className={`w-5 h-5 ${
                active === "rejected" ? "text-red-600" : "text-slate-500"
              }`}
            />
            <span>Rejected</span>
          </div>
          <span
            className={`text-xs font-bold ${
              active === "rejected" ? "text-red-700" : "text-slate-500"
            }`}
          >
            {counts.rejected}
          </span>
        </button>
      </nav>
    </div>
  </aside>
);

// ✅ Seller Item
const SellerListItem = ({ seller, onSelect, isSelected }) => (
  <motion.div
    layout
    onClick={() => onSelect(seller)}
    className={`flex items-center justify-between p-3 border-b border-slate-200 cursor-pointer hover:bg-slate-50 transition-all duration-300 ${
      isSelected ? "bg-blue-100 !border-blue-200 font-semibold" : ""
    }`}
  >
    <div>
      <p className="font-medium text-slate-800">{seller.name}</p>
      <p className="text-sm text-slate-500">{seller.company_name}</p>
    </div>
    <span
      className={`text-xs px-2 py-1 rounded-full capitalize ${
        seller.status === "approved"
          ? "bg-green-100 text-green-700"
          : seller.status === "rejected"
          ? "bg-red-100 text-red-700"
          : "bg-yellow-100 text-yellow-700"
      }`}
    >
      {seller.status || "pending"}
    </span>
  </motion.div>
);

const SellerDetails = ({ seller, onClose, handleAction }) => {
  if (!seller)
    return (
      <div className="p-6 text-center text-slate-500">
        Select a seller to view details.
      </div>
    );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="p-6 border-t border-slate-200 bg-white"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800 mb-1">
            {seller.company_name}
          </h2>
          <p className="text-sm text-slate-500">{seller.email}</p>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-700"
        >
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
      </div>

      <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
        <p><strong>Name:</strong> {seller.name}</p>
        <p><strong>Company:</strong> {seller.company_name}</p>
        <p><strong>Email:</strong> {seller.email}</p>
        <p><strong>Phone:</strong> {seller.phone_number}</p>
        <p><strong>Country:</strong> {seller.country_region}</p>
        <p><strong>Address:</strong> {seller.street_address}</p>

        {seller.document_url && (
          <a
            href={`${seller.document_url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:underline mt-4"
          >
            <FileText className="w-4 h-4" />
            View Uploaded Document
          </a>
        )}
      </div>

      {/* ✅ Action Buttons */}
      <div className="flex gap-3 mt-6">
        {/* Only show Approve if not yet approved or rejected */}
        {seller.status !== "approved" && seller.status !== "rejected" && (
          <button
            onClick={() => handleAction("approved", seller.id)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          >
            <CheckCircle className="w-4 h-4" /> Approve
          </button>
        )}

        {/* Only show Reject if not approved yet */}
        {seller.status !== "approved" && (
          <button
            onClick={() => handleAction("rejected", seller.id)}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
        )}

        {/* ✅ If already approved, show disabled "Approved" button */}
        {seller.status === "approved" && (
          <button
            disabled
            className="flex items-center gap-2 bg-green-200 text-green-700 font-bold py-2 px-4 rounded cursor-not-allowed"
          >
            <CheckCircle className="w-4 h-4" /> Approved
          </button>
        )}
      </div>
    </motion.div>
  );
};

// ✅ Main Page
export default function InboxPage() {
  const [activeFolder, setActiveFolder] = useState("all");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { companies, loading, error, fetchCompanies, approveCompany, rejectCompany } =
    useCompanyStore();

  const loadData = useCallback(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Count sellers by status
  const counts = useMemo(
    () => ({
      all: companies.length,
      pending: companies.filter((s) => !s.status || s.status === "pending").length,
      approved: companies.filter((s) => s.status === "approved").length,
      rejected: companies.filter((s) => s.status === "rejected").length,
    }),
    [companies]
  );

  // ✅ Combined search + filter
  const filteredCompanies = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
  
    return companies
      .filter((s) => {
        const matchStatus =
          activeFolder === "all"
            ? true
            : activeFolder === "pending"
            ? !s.status || s.status === "pending"
            : s.status === activeFolder;
  
        const matchSearch =
          s.name?.toLowerCase().includes(lowerQuery) ||
          s.company_name?.toLowerCase().includes(lowerQuery) ||
          s.email?.toLowerCase().includes(lowerQuery);
  
        return matchStatus && matchSearch;
      })
      // ✅ Sort by created_at descending (newest first)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [companies, activeFolder, searchQuery]);
  

  // Handle Approve / Reject
  const handleAction = async (action, id) => {
    const toastId = toast.loading("Processing...");
    try {
      if (action === "approved") await approveCompany(id);
      else await rejectCompany(id);
      toast.success(`Seller ${action}!`, { id: toastId });
      loadData();
      setSelectedSeller(null);
    } catch (err) {
      toast.error("Action failed.", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex h-[75vh] bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <Sidebar active={activeFolder} setActive={setActiveFolder} counts={counts} />

        <main className="flex-1 flex flex-col">
          {/* ✅ Search */}
          <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-slate-200">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search sellers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 rounded-lg py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </div>
          </div>

          {/* ✅ Seller List */}
          <div className="flex-1 overflow-y-auto">
            {loading && <div className="p-4 text-center text-slate-600">Loading...</div>}
            {error && <div className="p-4 text-center text-red-600">Error: {error}</div>}
            {!loading &&
              !error &&
              filteredCompanies.map((seller) => (
                <SellerListItem
                  key={seller.id}
                  seller={seller}
                  onSelect={setSelectedSeller}
                  isSelected={selectedSeller?.id === seller.id}
                />
              ))}
            {!loading && !error && filteredCompanies.length === 0 && (
              <div className="p-6 text-center text-slate-500">No matching sellers found.</div>
            )}
          </div>

          {selectedSeller && (
            <SellerDetails
              seller={selectedSeller}
              onClose={() => setSelectedSeller(null)}
              handleAction={handleAction}
            />
          )}

          <div className="flex-shrink-0 flex items-center justify-between p-3 border-t border-slate-200">
            <span className="text-sm text-slate-600">
              Showing {filteredCompanies.length} of {companies.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                disabled
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
