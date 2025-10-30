"use client";

import { motion } from "framer-motion";
import { Edit, Trash2 } from "lucide-react";
import { RoleBadge } from "./RoleBadge";

// Helper to clean image URL
const getCleanImageUrl = (url) => {
  if (!url) return null;
  const lastHttpIndex = url.lastIndexOf("http");
  return lastHttpIndex >= 0 ? url.substring(lastHttpIndex) : null;
};

// Helper to get user initials
const getUserInitials = (name) => {
  if (!name) return "U";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return words.map((w) => w[0].toUpperCase()).join("");
};

export function UserTableRow({ user, index, onEdit, onDelete }) {
  const imageUrl = getCleanImageUrl(user.profile_image_url);
  const initials = getUserInitials(user.name);

  return (
    <motion.tr
      key={user.id}
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
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold ring-2 ring-gray-200">
                {initials}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 ring-2 ring-white"></div>
          </div>
          <div>
            <div className="font-semibold text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap">
        <RoleBadge role={user.role} />
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(user.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(user)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label={`Edit ${user.name}`}
          >
            <Edit className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(user)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
            aria-label={`Delete ${user.name}`}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}
