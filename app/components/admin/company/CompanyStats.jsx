import { Building2, PlusCircle } from "lucide-react";

export function CompanyStats({ companies }) {
  const total = companies.length;
  const recent = companies.filter(c => new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-200 transition-all">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Partner Nodes</p>
          <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{total}</h4>
          <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">Verified Ecosystem Partners</p>
        </div>
        <div className="w-16 h-16 rounded-[24px] bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
          <Building2 size={28} />
        </div>
      </div>

      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-cyan-200 transition-all">
        <div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">New Initializations</p>
          <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{recent}</h4>
          <p className="text-[10px] font-bold text-slate-300 uppercase mt-1">Registry entries this week</p>
        </div>
        <div className="w-16 h-16 rounded-[24px] bg-cyan-50 text-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
          <PlusCircle size={28} />
        </div>
      </div>
    </div>
  );
}