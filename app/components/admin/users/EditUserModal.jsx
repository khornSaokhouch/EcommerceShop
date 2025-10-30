"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, X, Loader2, ChevronDown } from "lucide-react";
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

export function EditUserModal({ user, isOpen, onClose, onSave }) {
  const [selectedRole, setSelectedRole] = useState(user?.role || "user");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) setSelectedRole(user.role);
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(user.id, selectedRole);
    setIsSubmitting(false);
  };

  const imageUrl = getCleanImageUrl(user.profile_image_url);
  const initials = getUserInitials(user.name);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-center items-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                  <Edit className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Edit User Role</h2>
                  <p className="text-sm text-gray-500">Change user permissions</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="relative w-14 h-14">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      width={56}
                      height={56}
                      alt={user.name}
                      className="rounded-full object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-semibold ring-2 ring-white shadow-sm">
                      {initials}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-green-400 ring-2 ring-white"></div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Current: <RoleBadge role={user.role} />
                  </p>
                </div>
              </div>

              {/* Role Selector */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                  Select New Role
                </label>
                <div className="relative">
                  <select
                    id="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-gray-300 py-3 px-4 text-sm bg-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="user">👤 User - Standard Access</option>
                    <option value="company">🏢 Company - Business Access</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors shadow-sm"
                >
                  {isSubmitting ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
