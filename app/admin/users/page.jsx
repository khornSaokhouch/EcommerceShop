"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useUserStore } from "../../stores/userStore";
import { UsersPageHeader } from "../../components/admin/users/UsersPageHeader";
import { UserStats } from "../../components/admin/users/UserStats";
import { UserTable } from "../../components/admin/users/UserTable";
import { EditUserModal } from "../../components/admin/users/EditUserModal";
import { ConfirmationModal } from "../../components/admin/users/ConfirmationModal";

// Helper to clean image URL
const getCleanImageUrl = (url) => {
  if (!url) return null;
  const lastHttpIndex = url.lastIndexOf("http");
  return lastHttpIndex >= 0 ? url.substring(lastHttpIndex) : null;
};

export default function UsersPage() {
  const { user, users, loading, error, fetchAllUsers, updateUser, deleteUser, fetchUser } =
    useUserStore();

  const [search, setSearch] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch logged-in user + all users on mount
  useEffect(() => {
    (async () => {
      // console.log("🟢 Fetching logged-in user profile...");
      const loggedUser = await fetchUser();
      // console.log("🔐 Logged-in user:", loggedUser);

      if (!loggedUser) {
        toast.error("No logged-in user found. Please log in first.");
        return;
      }

      // console.log("📦 Fetching all users...");
      await fetchAllUsers();
    })();
  }, [fetchUser, fetchAllUsers]);

  // Filter only regular users
  const regularUsers = useMemo(() => users?.filter((u) => u.role === "user") ?? [], [users]);

  // Filter users by search
  const filteredUsers = useMemo(() => {
    if (!search.trim()) return regularUsers;
    const lower = search.toLowerCase();
    return regularUsers.filter(
      (u) => u.name?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower)
    );
  }, [regularUsers, search]);

  // Open edit modal
  const handleOpenEditModal = (user) => {
    // console.log("🧍 Selected user:", user);
    if (!user) return;
    setSelectedUser({ ...user, cleanedImageUrl: getCleanImageUrl(user.profile_image_url) });
    setIsEditModalOpen(true);
  };

  // Open confirm modal
  const handleOpenConfirmModal = (user) => {
    if (!user) return;
    setSelectedUser(user);
    setIsConfirmModalOpen(true);
  };

  // Close all modals
  const handleCloseModals = () => {
    setSelectedUser(null);
    setIsEditModalOpen(false);
    setIsConfirmModalOpen(false);
  };

  // Save role change
  const handleSaveRole = async (userId, newRole) => {
    const loadingToast = toast.loading("Updating role...");
    const formData = new FormData();
    formData.append("role", newRole);
    try {
      await updateUser(userId, formData);
      toast.success("User role updated successfully!", { id: loadingToast });
      handleCloseModals();
    } catch (err) {
      toast.error(err.message || "Failed to update role.", { id: loadingToast });
    }
  };

  // Delete user
  const handleDeleteUser = async () => {
    if (!selectedUser?.id) return;
    const loadingToast = toast.loading("Deleting user...");
    handleCloseModals();
    try {
      await deleteUser(selectedUser.id);
      toast.success("User deleted successfully!", { id: loadingToast });
    } catch (err) {
      toast.error(err.message || "Failed to delete user.", { id: loadingToast });
    }
  };

  return (
    <>
      {/* Modals */}
      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        onSave={handleSaveRole}
        user={selectedUser}
      />
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteUser}
        userName={selectedUser?.name || "Unknown User"}
      />

      {/* Page Content */}
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
        <UserStats users={regularUsers} />
          <UsersPageHeader search={search} onSearchChange={setSearch} />
          <UserTable
            users={filteredUsers}
            loading={loading}
            error={error}
            searchTerm={search}
            onEdit={handleOpenEditModal}
            onDelete={handleOpenConfirmModal}
          />
        </div>
      </div>
    </>
  );
}
