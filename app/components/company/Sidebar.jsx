"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { X, ChevronRight } from "lucide-react";

export default function Sidebar({ links, onClose }) {
  const pathname = usePathname();

  return (
    <div className="h-full bg-white flex flex-col p-6 overflow-hidden">
      <div className="mb-10 flex items-center justify-center px-2 relative">
        <span className="text-lg font-black tracking-tighter bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent uppercase whitespace-nowrap">
          TECHNOCORE
        </span>

        {/* Close button stays on the right */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-0 lg:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors bg-slate-50 rounded-xl"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto space-y-1 no-scrollbar">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => onClose && onClose()}
              className={`relative flex items-center justify-between w-full px-3 py-3.5 rounded-2xl transition-all group overflow-hidden ${
                isActive ? "bg-blue-50/50" : "hover:bg-slate-50"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeBar"
                  className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r-full"
                />
              )}
              <div className="flex items-center gap-3 relative z-10">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                      : "bg-slate-100 text-slate-400 group-hover:text-blue-600"
                  }`}
                >
                  <link.icon size={18} />
                </div>
                <span
                  className={`text-[11px] font-black uppercase tracking-widest transition-colors ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-500 group-hover:text-slate-900"
                  }`}
                >
                  {link.label}
                </span>
              </div>
              <ChevronRight
                size={14}
                className={`transition-all ${
                  isActive
                    ? "text-blue-500"
                    : "opacity-0 text-slate-300 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                }`}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
