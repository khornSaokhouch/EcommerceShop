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
  Loader2,
  MessageCircle,
} from "lucide-react";
import toast from "react-hot-toast";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
  confirmText = "Confirm",
  isConfirming,
}) => (
  <div
    className={`fixed inset-0 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ${
      isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
    }`}
  >
    <div
      className={`absolute inset-0 bg-white/30 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    ></div>

    <div
      className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm z-10 transform transition-transform duration-300 ${
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
          disabled={isConfirming}
          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isConfirming}
          className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-red-600 border border-transparent rounded-lg hover:bg-red-700 transition-colors disabled:bg-red-400"
        >
          {isConfirming ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Logging out...
            </>
          ) : (
            confirmText
          )}
        </button>
      </div>
    </div>
  </div>
);

export default function UserSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, fetchUser } = useUserStore();
  const { logout } = useAuthStore();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleLogoutClick = () => setIsLogoutModalOpen(true);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("You have been logged out.");
      router.push("/");
    } catch (error) {
      toast.error("An error occurred during logout.");
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  };

  const navLinks = [
    { name: "Profile", href: "/profile", icon: User },
    { name: "Chats", href: "/chat", icon: MessageCircle },
    { name: "Edit Profile", href: "/edit-profile", icon: Edit },
    { name: "Orders", href: "/profile/orders", icon: Package },
    { name: "Favorites", href: "/favorites", icon: Heart },
    { name: "Addresses", href: "/addresses", icon: Home },
    { name: "Security", href: "/security", icon: Shield },
  ];

  if (loading) {
    return (
      <aside className="lg:w-80 lg:flex-shrink-0">
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-pulse">
          <div className="flex items-center gap-4 border-b pb-6 mb-6">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-100 rounded-lg"></div>
            <div className="h-10 bg-gray-100 rounded-lg"></div>
            <div className="h-10 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </aside>
    );
  }

  if (!user) return null;

  const getUserInitial = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const getCleanImageUrl = (url) => {
    if (!url) return null;
    const lastHttpIndex = url.lastIndexOf("http");
    if (lastHttpIndex > 0) return url.substring(lastHttpIndex);
    return url;
  };

  const currentImageUrl = getCleanImageUrl(user.profile_image_url);
  const userInitial = getUserInitial(user.name);

  const InitialsFallback = ({ size = "w-28 h-28", text = "text-3xl" }) => (
    <div className={`${size} rounded-full bg-blue-100 flex items-center justify-center text-blue-600 ${text} font-bold mx-auto`}>
      {userInitial}
    </div>
  );

  return (
    <>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        confirmText="Yes, Logout"
        isConfirming={isLoggingOut}
      >
        Are you sure you want to end your session and log out?
      </ConfirmationModal>

      <aside className="lg:w-80 lg:flex-shrink-0">
        {/* Mobile Header */}
        <div className="bg-white p-6 rounded-2xl shadow-md lg:hidden">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex-shrink-0">
              {currentImageUrl ? (
                <Image
                  src={currentImageUrl}
                  alt="Profile Preview"
                  fill
                  sizes="112px"
                  className="rounded-full object-cover bg-gray-200"
                />
              ) : (
                <InitialsFallback size="w-16 h-16" text="text-xl" />
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500">{user.email || ""}</p>
            </div>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <div className="lg:sticky lg:top-24">
          <div className="hidden lg:block bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
            <div className="flex items-center gap-4 border-b border-gray-100 pb-6 mb-6">
              <div className="relative w-16 h-16 flex-shrink-0">
                {currentImageUrl ? (
                  <Image
                    src={currentImageUrl}
                    alt="User Profile"
                    fill
                    sizes="64px"
                    className="rounded-full object-cover"
                  />
                ) : (
                  <InitialsFallback size="w-16 h-16" text="text-2xl" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-800 truncate">{user.name || "User"}</h2>
                <p className="text-sm text-gray-500 truncate mb-1">{user.email || ""}</p>
              </div>
              <Link href="/edit-profile" className="text-gray-400 hover:text-blue-600 transition" title="Edit Profile">
                <Edit className="w-5 h-5" />
              </Link>
            </div>

            {/* Navigation Links */}
            <nav>
              <ul className="space-y-2">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all group ${
                          isActive
                            ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600 -ml-1"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <link.icon
                          className={`w-5 h-5 ${
                            isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"
                          }`}
                        />
                        <span>{link.name}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Logout */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={handleLogoutClick}
                className="flex w-full items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-white bg-red-600 shadow-md hover:bg-red-700 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Horizontal Nav */}
          <nav className="lg:hidden mt-4">
            <div className="flex space-x-3 overflow-x-auto pb-4 -mx-4 px-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md"
                        : "bg-white text-gray-700 border border-gray-300 hover:border-blue-400 shadow-sm"
                    }`}
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </Link>
                );
              })}
              <button
                onClick={handleLogoutClick}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
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
