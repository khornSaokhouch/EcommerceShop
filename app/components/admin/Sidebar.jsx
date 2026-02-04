"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, Building2, Inbox, ShoppingCart, 
  Tag, CreditCard, Calendar, Box, Palette, Ruler, Package ,Settings ,LogOut ,ChevronRight 
} from "lucide-react";
import { motion } from "framer-motion";

const mainLinks = [
  { href: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "inbox", label: "Inbox", icon: Inbox },
  { href: "users", label: "Users", icon: Users },               // changed Database → Users
  { href: "company", label: "Company", icon: Building2 },      // Partner Nodes → Partners
  { href: "category", label: "Category", icon: Tag },         // make plural
  { href: "types", label: "Types", icon: Box },                 // Package → Box
  { href: "products", label: "Products", icon: Package },
  { href: "events", label: "Events", icon: Calendar },
  { href: "brands", label: "Brands", icon: Tag },
  { href: "sizes", label: "Sizes", icon: Ruler },               // new icon for size
  { href: "colors", label: "Colors", icon: Palette },           // new icon for colors
];

export default function Sidebar({ onClose, onLogoutClick }) {
  const pathname = usePathname();

  // Fix: Ensures sidebar closes on mobile when a link is clicked
  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="h-full bg-white flex flex-col p-6 overflow-hidden border-r border-slate-100">
      
     {/* Brand Header */}
<div className="mb-10 relative px-2">
  {/* Centered Brand */}
  <div className="flex items-center justify-center">
    <Link
      href="/"
      onClick={handleLinkClick}
      className="flex items-center group"
    >
      <span className="text-lg font-black tracking-tighter bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent uppercase">
        TECHNOCORE
      </span>
    </Link>
  </div>

  {/* Close Button */}
  {onClose && (
    <button
      onClick={onClose}
      className="lg:hidden absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 rounded-xl"
    >
      <X size={20} />
    </button>
  )}
</div>


      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto space-y-8 no-scrollbar">
        <div>
          <nav className="space-y-1">
            {mainLinks.map((link) => (
              <SidebarLink key={link.href} link={link} pathname={pathname} onClick={handleLinkClick} />
            ))}
          </nav>
        </div>

        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 px-3">Configuration</p>
          <nav className="space-y-1">
            <SidebarLink link={{ href: "payment-type", label: "Payments", icon: CreditCard }} pathname={pathname} onClick={handleLinkClick} />
            <SidebarLink link={{ href: "order-status", label: "Status", icon: ShoppingCart }} pathname={pathname} onClick={handleLinkClick} />
            <SidebarLink link={{ href: "settings", label: "Settings", icon: Settings }} pathname={pathname} onClick={handleLinkClick} />
          </nav>
        </div>
      </div>

      {/* Bottom Action */}
      <div className="mt-auto pt-6 border-t border-slate-50">
        <button onClick={onLogoutClick} className="group w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold text-[13px] uppercase tracking-widest">
          <LogOut size={18} />
          <span>Exit Console</span>
        </button>
      </div>
    </div>
  );
}

// --- UPDATED SIDEBAR LINK COMPONENT ---
function SidebarLink({ link, pathname, onClick }) {
  const isActive = pathname.includes(`/admin/${link.href}`);
  
  return (
    <Link 
      href={`/admin/${link.href}`}
      onClick={onClick}
      className={`relative flex items-center justify-between w-full px-3 py-3 rounded-2xl transition-all group overflow-hidden
        ${isActive 
          ? "bg-blue-50/50" 
          : "hover:bg-slate-50"}`}
    >
      {/* Active Blue Indicator (Left) */}
      {isActive && (
        <motion.div 
          layoutId="activeBar"
          className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full"
        />
      )}

      <div className="flex items-center gap-3 relative z-10">
        {/* Icon Box */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300
          ${isActive 
            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 scale-105" 
            : "bg-slate-100 text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600"}`}
        >
          <link.icon size={18} />
        </div>

        {/* Label */}
        <span className={`text-[13px] font-medium uppercase tracking-widest transition-colors
          ${isActive ? "text-slate-900" : "text-slate-500 group-hover:text-slate-800"}`}>
          {link.label}
        </span>
      </div>

      {/* Right Chevron */}
      <ChevronRight size={14} className={`transition-all duration-300 
        ${isActive ? "text-blue-500 opacity-100" : "text-slate-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"}`} 
      />
    </Link>
  );
}