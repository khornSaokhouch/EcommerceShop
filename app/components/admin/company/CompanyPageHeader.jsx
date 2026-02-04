import { Search, Building2 } from "lucide-react";

export function CompanyPageHeader({ search, onSearchChange }) {
  return (
    <div className="px-8 py-8 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Company Registry</h2>
        <p className="text-[13px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-1">Verified Hardware Manufacturers & Distributors</p>
      </div>

      <div className="relative w-full lg:w-96 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
        <input
          type="text"
          placeholder="Search Partner Node..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-[13px] font-medium text-slate-500 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
        />
      </div>
    </div>
  );
}