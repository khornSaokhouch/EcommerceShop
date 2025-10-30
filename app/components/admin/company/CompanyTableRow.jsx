"use client"

import { motion } from "framer-motion"
import { Edit, Trash2 } from "lucide-react"
import { RoleBadge } from "../users/RoleBadge"

// Helper: clean image URL
const getCleanImageUrl = (url) => {
  if (!url) return null
  const lastHttpIndex = url.lastIndexOf("http")
  return lastHttpIndex >= 0 ? url.substring(lastHttpIndex) : url
}

// Helper: get company initials
const getCompanyInitials = (name) => {
  if (!name) return "C"
  const words = name.trim().split(" ")
  return words.length === 1 ? words[0][0].toUpperCase() : words.map((w) => w[0].toUpperCase()).join("")
}

export function CompanyTableRow({ company, index, onEdit, onDelete }) {
  const imageUrl = getCleanImageUrl(company.profile_image_url)
  const initials = getCompanyInitials(company.name)

  return (
    <motion.tr
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="hover:bg-gray-50 transition-colors"
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={company.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold ring-2 ring-gray-200">
                {initials}
              </div>
            )}
          </div>
          <div>
            <div className="font-semibold text-gray-900">{company.name}</div>
            <div className="text-sm text-gray-500">{company.email}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <RoleBadge role={company.role} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(company.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(company)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label={`Edit ${company.name}`}
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(company)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            aria-label={`Delete ${company.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  )
}
