"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";
import { useAuthStore } from "../stores/authStore";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Header from "../components/admin/Header";
import Sidebar from "../components/admin/Sidebar";

// --- LOGOUT CONFIRMATION MODAL ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isConfirming }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 text-center"
        >
          <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6 mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2 uppercase tracking-tight">Terminate Session?</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
            You are about to log out of the Technocore Admin Terminal.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onClose} className="py-4 text-sm font-bold text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={isConfirming} className="py-4 text-sm font-bold text-white bg-red-500 rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center">
              {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Log Out"}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function AdminLayout({ children }) {
  const { id: adminId } = useParams();
  const router = useRouter();
  const { user, fetchUser } = useUserStore();
  const { logout } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    if (!user && adminId) fetchUser(adminId);
  }, [fetchUser, user, adminId]);

  const handleLogout = () => {
    logout();
    toast.success("Terminal Session Terminated");
    router.push("/auth/login");
  };

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900">
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Sign Out"
      />

      {/* MOBILE SIDEBAR OVERLAY */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-[70] lg:hidden border-r border-slate-100"
            >
              <Sidebar 
                onLogoutClick={() => setIsLogoutModalOpen(true)} 
                onClose={() => setSidebarOpen(false)} 
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex w-72 h-full border-r border-slate-100 shrink-0">
        <Sidebar onLogoutClick={() => setIsLogoutModalOpen(true)} />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden bg-white">
        <Header 
          user={user} 
          onMenuButtonClick={() => setSidebarOpen(true)} 
          onLogoutClick={() => setIsLogoutModalOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}