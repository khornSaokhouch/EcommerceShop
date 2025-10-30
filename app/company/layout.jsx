// app/company/layout.jsx
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
  LayoutGrid,
  AlertTriangle,
  Users,
  Settings,
  Package,
  Box,
  Tags,
  TicketPercent,
  Warehouse,
  Receipt,
  Building2,
} from "lucide-react";

// Confirmation modal for logout
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
}) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
              <div className="text-sm text-slate-600 mt-2">{children}</div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default function CompanyLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const user = useUserStore((state) => state.user);
  const fetchUser = useUserStore((state) => state.fetchUser);
  const loadingUser = useUserStore((state) => state.loading);
  const { logout } = useAuthStore();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Fetch user on mount if not already loaded
  useEffect(() => {
    if (!user) fetchUser();
  }, [user, fetchUser]);

  // Logout handler
  const handleLogout = () => {
    logout();
    toast.success("You have been logged out.");
    router.push("/auth/login");
  };

  // Show loading screen while fetching user
  if (loadingUser || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-white">
        <p>Loading...</p>
      </div>
    );
  }

  // Optional: restrict access if not company
  if (user.role !== "company") {
    router.push("/unauthorized");
    return null;
  }

  // Sidebar links
  const links = [
    { href: `/company/dashboard`, label: "Dashboard", icon: LayoutGrid },
    { href: `/company/order`, label: "Order Lists", icon: Package },
    { href: `/company/product`, label: "Product", icon: Box },
    { href: `/company/categories`, label: "Categories", icon: Tags },
    {
      href: `/company/promotionCategories`,
      label: "Promotion Categories",
      icon: TicketPercent,
    },
    { href: `/company/promotions`, label: "Promotions", icon: TicketPercent },
    { href: `/company/stores`, label: "Add Stores", icon: Warehouse },
    {
      href: `/company/invoicemanager`,
      label: "Invoice Manager",
      icon: Receipt,
    },
    { href: `/company/stocks`, label: "Stocks", icon: Building2 },
    { href: `/company/accounts`, label: "Accounts", icon: Users },
    { href: `/company/setting`, label: "Setting", icon: Settings },
  ];

  const currentPage = links.find((link) => pathname.startsWith(link.href));
  const pageTitle = currentPage ? currentPage.label : "Dashboard";
  const profileLink = `/company/profile-company`;

  return (
    <>
      {/* Logout confirmation */}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        confirmText="Yes, Logout"
      >
        Are you sure you want to end your session?
      </ConfirmationModal>

      <div className="flex h-screen bg-white font-sans">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:w-72 md:flex-shrink-0">
          <Sidebar links={links} />
        </aside>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-black/50 z-20 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="fixed top-0 left-0 z-30 h-full w-72 md:hidden"
              >
                <Sidebar links={links} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar
            user={user}
            loadingUser={loadingUser}
            onMenuButtonClick={() => setSidebarOpen(true)}
            onLogoutClick={() => setIsLogoutModalOpen(true)}
            pageTitle={pageTitle}
            profileLink={profileLink}
          />

          <main className="flex-1 overflow-x-hidden overflow-y-auto">
            <div className="container mx-auto px-6 py-10 md:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
