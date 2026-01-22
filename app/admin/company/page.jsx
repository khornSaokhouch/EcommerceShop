"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "../../stores/userStore";
import toast from "react-hot-toast";
import { CompanyPageHeader } from "../../components/admin/company/CompanyPageHeader";
import { CompanyStats } from "../../components/admin/company/CompanyStats";
import { CompanyTable } from "../../components/admin/company/CompanyTable";
import { EditUserModal } from "../../components/admin/users/EditUserModal";
import { ConfirmationModal } from "../../components/admin/users/ConfirmationModal";
import { ChevronLeft, ChevronRight, Loader2, ShieldAlert } from "lucide-react";

export default function CompanyListPage() {
  const router = useRouter();
  const { users, loading, error, fetchAllUsers, updateUser, deleteUser, fetchUser } = useUserStore();
  
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const itemsPerPage = 10;

  useEffect(() => {
    const init = async () => {
      const currentUser = await fetchUser();
      if (!currentUser) return router.push("/auth/login");
      if (currentUser.role === "admin") {
        setAuthorized(true);
        await fetchAllUsers();
      }
      setCheckingAuth(false);
    };
    init();
  }, [fetchUser, fetchAllUsers, router]);

  // Filter Logic: Strictly Companies + Search
  const processedCompanies = useMemo(() => {
    const base = users?.filter((u) => u.role === "company") ?? [];
    if (!search.trim()) return base;
    const lower = search.toLowerCase();
    return base.filter(c => c.name?.toLowerCase().includes(lower) || c.email?.toLowerCase().includes(lower));
  }, [users, search]);

  // Pagination Logic
  const totalPages = Math.ceil(processedCompanies.length / itemsPerPage);
  const paginatedData = processedCompanies.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSaveRole = async (id, newRole) => {
    const tid = toast.loading("Updating Node...");
    const data = new FormData(); data.append("role", newRole);
    try {
      await updateUser(id, data);
      toast.success("Protocol Updated", { id: tid });
      setIsEditModalOpen(false);
    } catch (err) { toast.error("Failed", { id: tid }); }
  };

  const handleDelete = async () => {
    const tid = toast.loading("Purging Node...");
    try {
      await deleteUser(selectedCompany.id);
      toast.success("Node Purged", { id: tid });
      setIsConfirmModalOpen(false);
    } catch (err) { toast.error("Failed", { id: tid }); }
  };

  if (checkingAuth) return <div className="min-h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-blue-600" /></div>;
  if (!authorized) return <div className="h-screen flex items-center justify-center bg-white px-6"><div className="text-center p-10 bg-red-50 rounded-[32px] border border-red-100 max-w-sm"><ShieldAlert className="mx-auto mb-4 text-red-500" size={40}/><h2 className="text-xl font-black text-red-900 uppercase">Access Denied</h2><p className="text-red-600 text-sm mt-2 font-medium">Registry Restricted to System Admins</p></div></div>;

  return (
    <div className="space-y-8 pb-10 font-sans">
      <CompanyStats companies={processedCompanies} />
      
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <CompanyPageHeader search={search} onSearchChange={(v) => { setSearch(v); setCurrentPage(1); }} />
        
        <CompanyTable
          companies={paginatedData}
          loading={loading}
          startIndex={(currentPage - 1) * itemsPerPage}
          onEdit={(c) => { setSelectedCompany(c); setIsEditModalOpen(true); }}
          onDelete={(c) => { setSelectedCompany(c); setIsConfirmModalOpen(true); }}
        />

        <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Registry Page {currentPage}/{totalPages || 1}</p>
          <div className="flex gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronLeft size={18}/></button>
            <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="p-2.5 bg-white border border-slate-200 rounded-xl disabled:opacity-20 hover:text-blue-600 transition-all shadow-sm"><ChevronRight size={18}/></button>
          </div>
        </div>
      </div>

      <EditUserModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveRole} user={selectedCompany} />
      <ConfirmationModal isOpen={isConfirmModalOpen} onClose={() => setIsConfirmModalOpen(false)} onConfirm={handleDelete} userName={selectedCompany?.name} />
    </div>
  );
}