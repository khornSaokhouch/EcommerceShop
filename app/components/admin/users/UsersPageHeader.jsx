import { Search, Filter, ChevronDown } from "lucide-react";

export function UsersPageHeader({ search, onSearchChange, roleFilter, onRoleFilterChange }) {
  return (
    <div className="px-8 py-8 border-b border-slate-50 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
      <div>
        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
          User Management
        </h2>
        <p className="text-[13px] font-medium text-slate-500 uppercase tracking-[0.2em] mt-1">
          View, filter, and manage all registered users in the system
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {/* Role Filter Selector */}
        <div className="relative group min-w-[180px]">
           <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
           <select 
             value={roleFilter}
             onChange={(e) => onRoleFilterChange(e.target.value)}
             className="w-full appearance-none bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-10 text-[13px] font-medium uppercase tracking-widest text-slate-700 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
           >
              <option value="all">Filter by Role</option>
              <option value="user">User</option>
              <option value="company">Company</option>
           </select>
           <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 pointer-events-none" />
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
          <input
            type="text"
            placeholder="Search users by UID or name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-50 border-none rounded-2xl py-3.5 pl-11 pr-4 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
          />
        </div>
      </div>
    </div>
  );
}
