// Final Fixed Sidebar.js

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Package, Building2, Inbox, ShoppingCart, BarChart3, Tag, Calendar, CheckSquare, FileText, Settings, LogOut, ChevronRight, Dot, Store, CreditCard, Truck, ListOrdered, X, Sparkles, Zap
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

// --- THEME & CONFIGURATION (KEPT FOR CONSISTENCY) ---
const linkThemes = {
  dashboard: { color: "from-blue-500 to-indigo-600", shadow: "shadow-blue-300/50" },
  users: { color: "from-purple-500 to-fuchsia-600", shadow: "shadow-purple-300/50" },
  products: { color: "from-orange-500 to-amber-600", shadow: "shadow-orange-300/50" },
  payment: { color: "from-emerald-500 to-teal-600", shadow: "shadow-emerald-300/50" },
  category: { color: "from-pink-500 to-rose-600", shadow: "shadow-pink-300/50" },
  inbox: { color: "from-indigo-500 to-violet-600", shadow: "shadow-indigo-300/50" },
  status: { color: "from-red-500 to-rose-600", shadow: "shadow-red-300/50" },
  shipping: { color: "from-cyan-500 to-sky-600", shadow: "shadow-cyan-300/50" },
  orders: { color: "from-yellow-500 to-amber-600", shadow: "shadow-yellow-300/50" },
  analytics: { color: "from-purple-500 to-indigo-600", shadow: "shadow-purple-300/50" },
  calendar: { color: "from-teal-500 to-cyan-600", shadow: "shadow-teal-300/50" },
  todo: { color: "from-rose-500 to-pink-600", shadow: "shadow-rose-300/50" },
  invoice: { color: "from-amber-500 to-yellow-600", shadow: "shadow-amber-300/50" },
  settings: { color: "from-gray-400 to-gray-500", shadow: "shadow-gray-300/50" },
}

const getTheme = (key) => linkThemes[key] || { color: "from-gray-400 to-gray-500", shadow: "shadow-gray-300/50" }

const mainLinks = [
  { href: "dashboard", label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { href: "inbox", label: "Inbox", icon: Inbox, key: "inbox" },
  {
    href: "company",
    label: "Users Management",
    icon: Building2,
    key: "users",
    children: [
      { href: "users", label: "Users"},
      { href: "/company", label: "Company"}
    ],
  },
  { href: "category", label: "Categories", icon: Tag, key: "category" },
  { href: "events", label: "Events", icon: Store, key: "events" },
  { href: "products", label: "Products", icon: Package, key: "products" },
  { href: "payment-type", label: "Payment Types", icon: CreditCard, key: "payment" },
  { href: "order-status", label: "Order Status", icon: ShoppingCart, key: "status" },
  // { href: "shippingmethod", label: "Shipping", icon: Truck, key: "shipping" },
  { href: "order-lines", label: "Order Lines", icon: ListOrdered, key: "orders" },
]

const pageLinks = [
  { href: "analytics", label: "Analytics", icon: BarChart3, key: "analytics" },
  { href: "calendar", label: "Calendar", icon: Calendar, key: "calendar" },
  { href: "todo", label: "Tasks", icon: CheckSquare, key: "todo" },
  { href: "invoice", label: "Invoices", icon: FileText, key: "invoice" },
]

// Navigation item component
const NavItem = ({
  href,
  icon: Icon,
  label,
  isActive,
  hasChildren,
  isExpanded,
  onToggle,
  isChild = false,
  themeKeyProp = "settings", // ✅ RENAMED prop here
}) => {
  const { color, shadow } = getTheme(themeKeyProp); // ✅ Used the new prop name

  // Base classes for all nav items
  const baseClasses = `group flex items-center justify-between w-full px-4 py-2.5 rounded-xl font-medium transition-all duration-300 `
  const childClasses = `pl-12 ml-4 text-sm`

  // Active classes with the new soft-UI shadow and gradient
  const activeClasses = isActive
    ? `bg-gradient-to-r ${color} text-white shadow-lg ${shadow} transform scale-[1.015]`
    : `text-gray-600 hover:bg-gray-100 hover:text-gray-800 hover:scale-[1.005]`

  const content = (
    <div className="flex items-center gap-3">
      {Icon && (
        <div
          className={`p-2 rounded-lg transition-all ${
            isActive ? "bg-white/20" : "bg-gray-100 group-hover:bg-gray-200"
          } ${isActive ? 'shadow-inner shadow-black/10' : ''}`}
        >
          <Icon
            className={`h-4 w-4 transition-colors ${
              isActive ? "text-white" : "text-gray-500 group-hover:text-gray-600"
            }`}
          />
        </div>
      )}
      {isChild && !Icon && (
        <div className="w-6 h-6 flex items-center justify-center -ml-2">
          <Dot className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
        </div>
      )}
      <span className="truncate">{label}</span>
    </div>
  )

  const chevron = (
    <ChevronRight
      className={`h-4 w-4 transition-transform duration-200 ${
        isExpanded ? "rotate-90" : ""
      } ${isActive ? "text-white" : "text-gray-400"}`}
    />
  )

  if (hasChildren) {
    return (
      <button onClick={onToggle} className={`${baseClasses} ${activeClasses} w-full text-left`}>
        {content}
        {chevron}
      </button>
    )
  }

  return (
    <Link href={href} className={`${baseClasses} ${activeClasses} ${isChild ? childClasses : ""}`}>
      {content}
      {hasChildren && chevron}
    </Link>
  )
}

// Collapsible section component
const CollapsibleSection = ({ link, pathname, isExpanded, onToggle }) => {
  const createHref = (slug) => {
    if (slug.startsWith('/')) {
      return `/admin${slug}`;
    }
    return `/admin/${slug}`;
  };

  const currentPath = pathname;

  const isParentActive = link.children?.some(child => createHref(child.href) === currentPath) ||
                         createHref(link.href) === currentPath;

  return (
    <div>
      <NavItem
        href={createHref(link.href)}
        icon={link.icon}
        label={link.label}
        isActive={isParentActive}
        hasChildren={!!link.children}
        isExpanded={isExpanded}
        onToggle={onToggle}
        key={link.label} // Kept for list rendering
        themeKeyProp={link.key} // ✅ Passed theme key under the correct prop name
      />
      <AnimatePresence>
        {isExpanded && link.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-1">
              {link.children.map((child) => (
                <NavItem
                  key={child.label} // Kept for list rendering
                  href={createHref(child.href)}
                  label={child.label}
                  isActive={currentPath === createHref(child.href)}
                  isChild={true}
                  themeKeyProp={link.key} // ✅ Passed theme key under the correct prop name
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Sidebar({ adminId, onLogoutClick, onClose }) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState(new Set())

  // Effect to expand parent if any child is active on initial load
  useEffect(() => {
    mainLinks.forEach(link => {
      const isChildActive = link.children?.some(child => pathname === `/admin${child.href}`);
      const isParentActive = pathname === `/admin/${link.href}`;

      if (isChildActive || isParentActive) {
        setExpandedItems(prev => new Set(prev).add(link.label));
      }
    });
  }, [pathname]);

  const createHref = (slug) => {
    if (slug.startsWith('/')) {
      return `/admin${slug}`;
    }
    return `/admin/${slug}`;
  };

  const toggleExpanded = (label) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(label)) {
      newExpanded.delete(label)
    } else {
      newExpanded.add(label)
    }
    setExpandedItems(newExpanded)
  }

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.05,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <motion.div
      className="flex h-full flex-col bg-white border-r border-gray-100 w-72 shadow-2xl shadow-gray-200/60 rounded-r-[1.5rem]"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between px-6 border-b border-gray-100">
        <Link href="/admin/dashboard" className="flex items-center space-x-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <Zap className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tighter">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent">
                Aurora
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-semibold -mt-1">Admin Panel</p>
          </div>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 lg:hidden transition-all"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-hide">
        {/* Main Navigation */}
        <motion.nav variants={itemVariants}>
          <div className="mb-6">
            <div className="flex items-center gap-2 px-4 mb-3">
              <Sparkles className="h-4 w-4 text-fuchsia-500" />
              <h3 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Core Management</h3>
            </div>
            <div className="space-y-2">
              {mainLinks.map((link) => (
                <motion.div key={link.label} variants={itemVariants}>
                  {link.children ? (
                    <CollapsibleSection
                      link={link}
                      pathname={pathname}
                      isExpanded={expandedItems.has(link.label)}
                      onToggle={() => toggleExpanded(link.label)}
                    />
                  ) : (
                    <NavItem
                      href={createHref(link.href)}
                      icon={link.icon}
                      label={link.label}
                      isActive={pathname === createHref(link.href)}
                      key={link.label} // Kept for list rendering
                      themeKeyProp={link.key} // ✅ Passed theme key under the correct prop name
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Pages Section */}
          <div>
            <div className="flex items-center gap-2 px-4 mb-3">
              <BarChart3 className="h-4 w-4 text-teal-500" />
              <h3 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest">Analytics & Tools</h3>
            </div>
            <div className="space-y-2">
              {pageLinks.map((link) => (
                <motion.div key={link.label} variants={itemVariants}>
                  <NavItem
                    href={createHref(link.href)}
                    icon={link.icon}
                    label={link.label}
                    isActive={pathname === createHref(link.href)}
                    key={link.label} // Kept for list rendering
                    themeKeyProp={link.key} // ✅ Passed theme key under the correct prop name
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.nav>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-100/70 p-4 bg-gray-50/50 rounded-br-[1.5rem]">
        <div className="space-y-2">
          <NavItem
            href={createHref("settings")}
            icon={Settings}
            label="Settings"
            isActive={pathname === createHref("settings")}
            key="SettingsLink" // Used a unique key for list rendering
            themeKeyProp="settings" // ✅ Passed theme key under the correct prop name
          />
          <button
            onClick={onLogoutClick}
            className="group flex w-full items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-gray-600 transition-all duration-300 hover:bg-red-50 hover:text-red-600 hover:scale-[1.005]"
          >
            <div className="p-2 rounded-lg bg-gray-100 group-hover:bg-red-100 transition-all">
              <LogOut className="h-4 w-4 text-gray-500 group-hover:text-red-500 transition-colors" />
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </motion.div>
  )
}