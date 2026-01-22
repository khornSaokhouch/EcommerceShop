import { Search, Filter, ChevronDown } from "lucide-react";

export function UsersPageHeader({ search, onSearchChange, roleFilter, onRoleFilterChange }) {
  return (
    <div className="px-8 py-8 border-b border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Identity Registry</h2>
        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Manage and verify terminal access nodes</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Role Filter Selector */}
        <div className="relative group min-w-[180px]">
           <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
           <select 
             value={roleFilter}
             onChange={(e) => onRoleFilterChange(e.target.value)}
             className="w-full appearance-none bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-10 text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
           >
              <option value="all">All Protocols</option>
              <option value="user">Standard User</option>
              <option value="company">Merchant Node</option>
           </select>
           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search Identity UID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
          />
        </div>
      </div>
    </div>
  );
}