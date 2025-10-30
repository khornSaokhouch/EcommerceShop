"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../stores/userStore";
import { useAuthStore } from "../stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Package,
  Heart,
  Home,
  Shield,
  LogOut,
  Edit,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

// --- ConfirmationModal ---
const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-white/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className={`bg-white rounded-lg shadow-xl p-6 w-full max-w-sm z-10 transform transition-transform duration-300 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
        </div>
        <div className="text-sm text-gray-600 mb-6">{children}</div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, fetchUser } = useUserStore();
  const { logout } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogoutClick = () => setIsLogoutModalOpen(true);
  const confirmLogout = () => {
    logout();
    toast.success("You have been logged out.");
    router.push("/");
  };

  const navLinks = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "Edit Profile", href: "/edit-profile", icon: Edit },
    { name: "Orders", href: "/profile/orders", icon: Package },
    { name: "Favorites", href: "/profile/favorites", icon: Heart },
    { name: "Addresses", href: "/addresses", icon: Home },
    { name: "Security", href: "/security", icon: Shield },
  ];

  if (loading) {
    return (
      <aside className="lg:w-80 lg:flex-shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  if (!user) return null;

  // --- Compute initials fallback ---
// Function to get initials
const getUserInitials = (name) => {
  if (!name) return "U"; // fallback if name is missing
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase(); // single word
  return words.map((w) => w[0].toUpperCase()).join(""); // multiple words
};



  const userInitials = getUserInitials(user.name);
  const imageUrl = user.profile_image_url;

  return (
    <>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        confirmText="Yes, Logout"
      >
        Are you sure you want to end your session and log out?
      </ConfirmationModal>

      <aside className="lg:w-80 lg:flex-shrink-0">
        {/* Mobile Header */}
        <div className="bg-white p-6 rounded-2xl shadow-sm lg:hidden">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
            {imageUrl ? (
  <Image
    src={imageUrl}
    alt="User Profile"
    fill
    className="rounded-full object-cover"
  />
) : (
  <div className="w-28 h-28 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold mx-auto">
    {userInitials}
  </div>
)}

            </div>
            <div>
              <h2 className="text-xl font-bold text-black">{user.name || "User"}</h2>
              <p className="text-sm text-gray-600">{user.email || ""}</p>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="lg:sticky lg:top-24">
          <div className="hidden lg:block bg-white p-6 rounded-2xl shadow-sm">
            <div className="text-center mb-6">
              <div className="relative w-28 h-28 mx-auto mb-4">
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt="User Profile"
                    fill
                    sizes="112px"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 flex items-center justify-center text-white text-3xl font-bold mx-auto">
                    {userInitials}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-black">{user.name || "User"}</h2>
              <p className="text-sm text-gray-600">{user.email || ""}</p>
            </div>

            {/* Navigation Links */}
            <nav>
              <ul className="space-y-2">
                {navLinks.map((link) => {
                  const isActive =
                    pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-colors ${
                          isActive
                            ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white"
                            : "text-gray-600 hover:bg-gradient-to-r hover:from-sky-100 hover:to-indigo-100"
                        }`}
                      >
                        <link.icon className="w-5 h-5" />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={handleLogoutClick}
                className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-red-500 to-red-700 hover:opacity-90 transition-opacity"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Horizontal Nav */}
          <nav className="lg:hidden mt-6">
            <div className="flex space-x-2 overflow-x-auto pb-4 -mx-4 px-4">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-to-r from-sky-500 to-indigo-500 text-white"
                        : "bg-white text-gray-700 hover:bg-gradient-to-r hover:from-sky-100 hover:to-indigo-100"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
              <button
                onClick={handleLogoutClick}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap bg-gradient-to-r from-red-500 to-red-700 text-white hover:opacity-90"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
