import { Edit, Trash2, Layout, ArrowUpRight, Mail, Calendar } from "lucide-react";
import Link from "next/link";
import { RoleBadge } from "../users/RoleBadge";

export function CompanyTable({ companies, startIndex, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest"># ID</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">USER NAME & EMAIL</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">COMPANY ROLE</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">REGISTERED</th>
            <th className="px-8 py-5 text-right text-[13px] font-medium text-slate-500 uppercase tracking-widest">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {companies.map((company, index) => (
            <tr key={company.id} className="hover:bg-slate-50/30 transition-colors group">
              <td className="px-8 py-5 text-[13px] font-medium text-slate-300">
                {String(startIndex + index + 1).padStart(2, '0')}
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-xl p-0.5 bg-slate-100 group-hover:bg-blue-600 transition-colors">
                      <div className="w-full h-full rounded-[10px] overflow-hidden bg-white flex items-center justify-center border-2 border-white relative shadow-sm font-black text-blue-600">
                        {company.profile_image_url ? <img src={company.profile_image_url} className="w-full h-full object-cover" /> : company.name[0]}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">{company.name}</p>
                    <div className="flex items-center gap-1.5 text-slate-500">
                        <Mail size={12} />
                        <p className="text-[11px] font-medium tracking-widest uppercase">{company.email}</p>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5"><RoleBadge role={company.role} /></td>
              <td className="px-8 py-5">
                 <div className="flex items-center gap-2 text-slate-500">
                    <Calendar size={13} className="text-slate-300" />
                    <span className="text-[11px] font-medium uppercase tracking-widest">{new Date(company.created_at).toLocaleDateString()}</span>
                 </div>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2">
                  {/* LINK TO COMPANY BY ID */}
                  <Link 
                    href={`/admin/company/${company.id}`}
                    className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-xl rounded-xl transition-all border border-transparent hover:border-blue-100"
                    title="View Node Specs"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                  <button onClick={() => onEdit(company)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-xl rounded-xl transition-all border border-transparent hover:border-blue-100"><Edit size={16} /></button>
                  <button onClick={() => onDelete(company)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-xl rounded-xl transition-all border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}