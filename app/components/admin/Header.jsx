"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  UserCircle,
  LogOut,
  Settings,
  Globe,
  Zap,
  Clock, // Replaced Zap for Time Display consistency
} from "lucide-react";
import { useNotificationsStore } from "../../stores/useNotificationsStore";
import { useUserStore } from "../../stores/userStore";
import { useAuthStore } from "../../stores/authStore";

// --- HELPERS & COMPONENTS ---

const LanguageIcon = ({ country }) => {
  const flags = {
    US: "🇺🇸",
    ES: "🇪🇸",
    FR: "🇫🇷",
    DE: "🇩🇪",
    KH: "🇰🇭",
  };
  // Flag uses a subtle, lighter background now
  return (
    <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm shadow-inner bg-gray-100/70">
      {flags[country] || "🌐"}
    </div>
  );
};

const DropdownMenu = ({ children, open, className = "" }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: -5, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -5, scale: 0.98 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        // Updated styling: rounded-xl, prominent shadow, subtle background/blur
        className={`absolute right-0 mt-3 w-72 origin-top-right rounded-xl bg-white/90 backdrop-blur-lg py-1 shadow-2xl shadow-gray-300/50 ring-1 ring-gray-100 focus:outline-none z-50 ${className}`}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// Helper: get user initials
const getUserInitials = (name) => {
  if (!name) return "U";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return words.map((w) => w[0].toUpperCase()).join("");
};

// Helper: clean image URL
const getCleanImageUrl = (url) => {
  if (!url) return null;
  const lastHttpIndex = url.lastIndexOf("http");
  return lastHttpIndex >= 0 ? url.substring(lastHttpIndex) : null;
};

// --- MAIN COMPONENT ---

export default function Header({
  onMenuButtonClick,
  onLogoutClick,
  notificationCount,
  clearUnreadCount,
}) {
  const { user, loading, fetchUser, clearUser } = useUserStore();
  const token = useAuthStore((state) => state.token);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [isLanguageOpen, setLanguageOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchNotifications = useNotificationsStore(
    (state) => state.fetchNotifications
  );

  useEffect(() => {
    if (token) fetchUser();
    fetchNotifications();
    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [token, fetchUser, fetchNotifications]);

  const handleViewNotifications = () => {
    if (clearUnreadCount) clearUnreadCount();
  };

  const handleLogout = () => {
    clearUser();
    onLogoutClick();
  };

  const bellHref = `/admin/inbox`;
  const userInitials = getUserInitials(user?.name);
  const imageUrl = getCleanImageUrl(user?.profile_image_url);

  // Unified button style class
  const iconButtonClasses = "p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all hover:scale-[1.05] active:scale-[0.98]";

  return (
    <header className="sticky top-0 z-20">
      <div className="mx-4 mt-4 mb-4"> {/* Added horizontal margin and top/bottom margin */}
        <div 
          className="flex h-16 items-center justify-between px-6 lg:px-8 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-100/50" // Elevated, rounded, and softer shadow
        >
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className={`${iconButtonClasses} lg:hidden`}
              onClick={onMenuButtonClick}
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Search Bar */}
            <div className="relative hidden md:block">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products, orders, customers..."
                className="block w-full pl-11 pr-4 py-2.5 text-sm bg-white/70 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-200/40 focus:border-indigo-400/50 focus:bg-white transition-all sm:w-96 placeholder:text-gray-400 shadow-sm" // Elevated search bar
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            
            {/* Quick Actions */}
            <button className={`${iconButtonClasses} hidden md:block`}>
                <Zap className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <Link
              href={bellHref}
              className={`relative ${iconButtonClasses}`}
              onClick={handleViewNotifications}
            >
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-600 px-1.5 text-xs font-bold text-white shadow-lg shadow-red-500/50"
                >
                  {notificationCount > 99 ? "99+" : notificationCount}
                </motion.span>
              )}
            </Link>
            
            {/* Time Display */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-gray-50/80 rounded-xl border border-gray-200/50">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span className="text-sm font-medium text-gray-700">
                {currentTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })}
                </span>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => {
                  setLanguageOpen(!isLanguageOpen);
                  setProfileOpen(false);
                }}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-all"
              >
                <LanguageIcon country="US" />
                <span className="hidden sm:block text-sm font-semibold">EN</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    isLanguageOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <DropdownMenu open={isLanguageOpen}>
                <div className="px-5 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-bold text-gray-900">
                      Select Language
                    </span>
                  </div>
                </div>
                {[
                  { code: "US", name: "English", native: "English" },
                  { code: "KH", name: "Khmer", native: "ខ្មែរ" },
                ].map((lang) => (
                  <button
                    key={lang.code}
                    className="flex w-full items-center gap-4 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <LanguageIcon country={lang.code} />
                    <div className="text-left">
                      <div className="font-medium">{lang.name}</div>
                      <div className="text-xs text-gray-500">{lang.native}</div>
                    </div>
                  </button>
                ))}
              </DropdownMenu>
            </div>

            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setProfileOpen(!isProfileOpen);
                  setLanguageOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-100 transition-all"
              >
                {loading ? (
                  <div className="h-9 w-9 animate-pulse rounded-full bg-gradient-to-br from-gray-200 to-gray-300" />
                ) : imageUrl ? (
                  <div className="relative">
                    {/* Ring for profile image */}
                    <div className="h-9 w-9 rounded-full bg-indigo-500 p-0.5 shadow-md shadow-indigo-300/50">
                      <Image
                        src={imageUrl}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="h-full w-full rounded-full object-cover bg-white"
                        unoptimized
                        priority
                      />
                    </div>
                    {/* Status dot */}
                    <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 ring-2 ring-white shadow-sm"></div>
                  </div>
                ) : (
                  <div className="h-9 w-9 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-sm shadow-md shadow-indigo-300/50">
                    {userInitials}
                  </div>
                )}

                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {loading ? "Loading..." : user?.name || "Admin"}
                  </p>
                  {user?.role && (
                    <p className="text-xs text-gray-500">
                      {user.role}
                    </p>
                  )}
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              <DropdownMenu open={isProfileOpen}>
                <div className="px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {/* Profile image in dropdown */}
                    {imageUrl ? (
                      <div className="h-10 w-10 rounded-full bg-indigo-500 p-0.5">
                        <Image
                          src={imageUrl}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="h-full w-full rounded-full object-cover bg-white"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-semibold text-base">
                        {userInitials}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {user?.name || "Admin"}
                      </p>
                      <p className="text-xs text-indigo-500 font-medium">
                        {user?.email || "admin@example.com"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  <Link
                    href={`/admin/account`}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <UserCircle className="h-4 w-4 text-gray-500" />
                    <span>View Profile</span>
                  </Link>
                  <Link
                    href={`/admin/settings`}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span>Settings & Privacy</span>
                  </Link>
                </div>

                <div className="border-t border-gray-100 py-2">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                  >
                    <LogOut className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}