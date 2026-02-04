"use client";

import { Edit, Trash2, Calendar, Mail, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { RoleBadge } from "../users/RoleBadge";

// Helper: clean image URL
const getCleanImageUrl = (url) => {
  if (!url) return null;
  const lastHttpIndex = url.lastIndexOf("http");
  return lastHttpIndex >= 0 ? url.substring(lastHttpIndex) : url;
};

// Helper: get company initials
const getCompanyInitials = (name) => {
  if (!name) return "C";
  const words = name.trim().split(" ");
  return words.length === 1 ? words[0][0].toUpperCase() : words.map((w) => w[0].toUpperCase()).join("");
};

export function CompanyTableRow({ company, index, startIndex, onEdit, onDelete }) {
  const imageUrl = getCleanImageUrl(company.profile_image_url);
  const initials = getCompanyInitials(company.name);

  return (
    <tr className="hover:bg-slate-50/30 transition-colors group">
      {/* 1. ID Index Column */}
      <td className="px-8 py-5 whitespace-nowrap">
        <span className="text-[13px] font-medium text-slate-300 group-hover:text-blue-400 transition-colors">
          {String(startIndex + index + 1).padStart(2, '0')}
        </span>
      </td>

      {/* 2. Partner Identity Node */}
      <td className="px-8 py-5 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-[18px] p-0.5 bg-slate-100 group-hover:bg-blue-600 transition-colors">
              <div className="w-full h-full rounded-[16px] overflow-hidden bg-white flex items-center justify-center border-2 border-white relative shadow-sm">
                {imageUrl ? (
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[13px] font-bold text-blue-600">{initials}</span>
                )}
              </div>
            </div>
            {/* Active Status Dot */}
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white shadow-sm" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight truncate max-w-[200px]">
              {company.name}
            </p>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Mail size={12} />
              <p className="text-[11px] font-medium tracking-wide truncate">{company.email}</p>
            </div>
          </div>
        </div>
      </td>

      {/* 3. Protocol Badge */}
      <td className="px-8 py-5 whitespace-nowrap">
        <RoleBadge role={company.role} />
      </td>

      {/* 4. Registration Date */}
      <td className="px-8 py-5 whitespace-nowrap">
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar size={13} className="text-slate-300" />
          <span className="text-[13px] font-medium uppercase tracking-widest">
            {new Date(company.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </td>

      {/* 5. Control Actions */}
      <td className="px-8 py-5 whitespace-nowrap text-right">
        <div className="flex justify-end gap-2">
          {/* LINK TO COMPANY PROFILE BY ID */}
          <Link
            href={`/admin/company/${company.id}`}
            className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-100"
            title="Inspect Node Details"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
          
          <button
            onClick={() => onEdit(company)}
            className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 rounded-xl transition-all border border-transparent hover:border-blue-100"
            title="Update Protocol"
          >
            <Edit className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => onDelete(company)}
            className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-xl hover:shadow-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-100"
            title="Purge Node"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}