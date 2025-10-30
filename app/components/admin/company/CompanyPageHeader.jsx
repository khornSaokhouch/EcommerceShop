"use client"

import { Search } from "lucide-react"

export function CompanyPageHeader({ search, onSearchChange }) {
  return (
    <div className="mb-10 p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
        <div className="flex-shrink-0">
          <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
            Company Management
          </h1>
          <p className="mt-1 text-lg text-gray-500">
            View and manage all registered companies.
          </p>
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
          <input
            type="text"
            placeholder="Search companies by name, domain, or ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-full border border-gray-300 py-3.5 pl-12 pr-6 text-base text-gray-700 bg-gray-50
                       placeholder:text-gray-400
                       focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20
                       transition duration-200 ease-in-out shadow-inner"
            aria-label="Search companies"
          />
        </div>
      </div>
    </div>
  )
}
