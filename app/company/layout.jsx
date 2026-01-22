"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import { useUserStore } from "../stores/userStore";
import { useAuthStore } from "../stores/authStore";
import Navbar from "../components/company/Navbar";
import Sidebar from "../components/company/Sidebar";
import {
  LayoutGrid, AlertCircle, Users, Settings, Package, Box,
  Tags, TicketPercent, Warehouse, Receipt, Building2, Loader2
} from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 text-center"
        >
          <div className="w-16 h-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6 mx-auto">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl mb-2 uppercase tracking-tight">{title}</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed italic">{children}</p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onClose}
              className="py-4 text-xs uppercase text-slate-400 bg-slate-50 rounded-2xl hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="py-4 text-xs uppercase text-white bg-red-500 rounded-2xl hover:bg-red-600 shadow-xl shadow-red-200"
            >
              Terminate
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function CompanyLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, fetchUser, loading: loadingUser } = useUserStore();
  const { logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => { if (!user) fetchUser(); }, [user, fetchUser]);

  const handleLogout = () => {
    logout();
    toast.success("Merchant Session Terminated");
    router.push("/auth/login");
  };

  if (loadingUser || !user)
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  if (user.role !== "company") { router.push("/"); return null; }

  const links = [
    { href: `/company/dashboard`, label: "Dashboard", icon: LayoutGrid },
    { href: `/company/order`, label: "Oders", icon: Package },
    { href: `/company/stores`, label: "My Store", icon: Warehouse },
    { href: `/company/products`, label: "Products", icon: Box },
    { href: `/company/categories`, label: "Categorys", icon: Tags },
    { href: `/company/promotions`, label: "Promo Products", icon: TicketPercent },
    { href: `/company/stocks`, label: "Live Storage", icon: Building2 },
    { href: `/company/invoicemanager`, label: "Accounting Log", icon: Receipt },
    { href: `/company/profile-company`, label: "Account Profile", icon: Users },
    { href: `/company/settings`, label: "System Config", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-white overflow-hidden text-slate-900">
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out?"
      >
        Secure terminal exit requested. End current partner session?
      </ConfirmationModal>

      <aside className="hidden lg:flex w-72 h-full border-r border-slate-100 shrink-0">
        <Sidebar links={links} />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 w-72 bg-white z-50 lg:hidden border-r border-slate-100"
            >
              <Sidebar links={links} onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        <Navbar
          user={user}
          onMenuButtonClick={() => setSidebarOpen(true)}
          onLogoutClick={() => setIsLogoutModalOpen(true)}
          pageTitle={links.find(l => pathname.startsWith(l.href))?.label || "Terminal"}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
