"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useUserStore } from "../../stores/userStore";
import { UsersPageHeader } from "../../components/admin/users/UsersPageHeader";
import { UserStats } from "../../components/admin/users/UserStats";
import { UserTable } from "../../components/admin/users/UserTable";
import { EditUserModal } from "../../components/admin/users/EditUserModal";
import { ConfirmationModal } from "../../components/admin/users/ConfirmationModal";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuthStore } from '../../stores/authStore';



export default function UsersPage() {
  const { users, loading, error, fetchAllUsers, updateRole, deleteUser, fetchUser } = useUserStore();
  
  // States
  const token = useAuthStore((state) => state.token);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const itemsPerPage = 10;

useEffect(() => {
  (async () => {
    if (!token) return;

    try {
      await useAuthStore.getState().loginWithToken(token);
      await fetchUser();
      await fetchAllUsers();
    } catch (err) {
      console.error('Failed to restore session', err);
    }
  })();
}, [fetchUser, fetchAllUsers]);



  // 1. Filter Logic (Hide Admin, Apply Search, Apply Role Filter)
  const processedUsers = useMemo(() => {
    let filtered = users?.filter((u) => u.role !== "admin") ?? [];

    if (roleFilter !== "all") {
      filtered = filtered.filter(u => u.role === roleFilter);
    }

    if (search.trim()) {
      const lower = search.toLowerCase();
      filtered = filtered.filter(u => 
        u.name?.toLowerCase().includes(lower) || u.email?.toLowerCase().includes(lower)
      );
    }

    return filtered;
  }, [users, search, roleFilter]);

  // 2. Pagination Logic
  const totalPages = Math.ceil(processedUsers.length / itemsPerPage);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedUsers.slice(start, start + itemsPerPage);
  }, [processedUsers, currentPage]);

  const handleSaveRole = async (userId, newRole) => {
    if (!selectedUser) return;
  
    const loadingToast = toast.loading("Updating Permissions...");
  
    try {
      await updateRole({ id: userId, type: "user", role: newRole });
      toast.success("Registry Permissions Updated", { id: loadingToast });
      setIsEditModalOpen(false);
    } catch (err) {
      toast.error(err.message || "Update Failed", { id: loadingToast });
    }
  };
  
  

  const handleDeleteUser = async () => {
    const loadingToast = toast.loading("Purging Node...");
    try {
      await deleteUser(selectedUser.id);
      toast.success("Node Purged Successfully", { id: loadingToast });
      setIsConfirmModalOpen(false);
    } catch (err) { toast.error("Purge Failed", { id: loadingToast }); }
  };

  return (
    <div className="space-y-8 pb-10">
      <UserStats users={users || []} />
      
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <UsersPageHeader 
          search={search} 
          onSearchChange={(val) => { setSearch(val); setCurrentPage(1); }} 
          roleFilter={roleFilter}
          onRoleFilterChange={(val) => { setRoleFilter(val); setCurrentPage(1); }}
        />
        
        <UserTable
          users={paginatedUsers}
          loading={loading}
          startIndex={(currentPage - 1) * itemsPerPage}
          onEdit={(u) => { setSelectedUser(u); setIsEditModalOpen(true); }}
          onDelete={(u) => { setSelectedUser(u); setIsConfirmModalOpen(true); }}
        />

        {/* --- PAGINATION CONTROLS --- */}
        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-30 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveRole} user={selectedUser} />
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleDeleteUser} userName={selectedUser?.name} />
    </div>
  );
}