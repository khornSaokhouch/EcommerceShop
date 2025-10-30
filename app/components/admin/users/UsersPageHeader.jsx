"use client"

import { Search } from "lucide-react"

export function UsersPageHeader({ search, onSearchChange }) {
  return (
    // Redesigned container: subtle shadow, light background, and generous padding for a card effect.
    <div className="mb-10 p-6 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-200/50">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8">
        {/* Title and Subtitle Section (Enhanced Typography) */}
        <div className="flex-shrink-0">
          <h1 className="text-4xl font-extrabold text-gray-800 leading-tight">
            User Management
          </h1>
          <p className="mt-1 text-lg text-gray-500">
            Manage and monitor platform users and their activity levels.
          </p>
        </div>

        {/* Search Input Section (Sleek, Full-Width on Mobile, Fixed Width on Desktop) */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-indigo-400" />
          <input
            type="text"
            placeholder="Search users by name, email, or ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            // Enhanced input styling: rounded-full, better padding, light background, prominent indigo focus ring
            className="w-full rounded-full border border-gray-300 py-3.5 pl-12 pr-6 text-base text-gray-700 bg-gray-50
                       placeholder:text-gray-400
                       focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20
                       transition duration-200 ease-in-out shadow-inner"
            aria-label="Search users"
          />
        </div>
      </div>
    </div>
  )
}