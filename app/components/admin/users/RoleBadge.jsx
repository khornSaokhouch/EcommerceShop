"use client"
import { ShieldCheck, User, Zap } from "lucide-react"

export function RoleBadge({ role }) {
  const config = {
    company: { label: "Merchant Node", icon: Zap, styles: "bg-blue-50 text-blue-600 border-blue-100" },
    user: { label: "Standard Node", icon: User, styles: "bg-slate-50 text-slate-500 border-slate-100" },
    default: { label: role, icon: User, styles: "bg-slate-50 text-slate-400 border-slate-100" },
  }
  const { label, styles, icon: Icon } = config[role] || config.default;

  return (
    <span className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 border ${styles}`}>
      <Icon className="h-3 w-3" />
      <span className="text-[9px] font-black uppercase tracking-[0.15em]">{label}</span>
    </span>
  );
}