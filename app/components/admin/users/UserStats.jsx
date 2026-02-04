import { User, Building2 } from "lucide-react";

export function UserStats({ users }) {
  const totalUser = users.filter(u => u.role === 'user').length;
  const totalCompany = users.filter(u => u.role === 'company').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StatCard label="Total User" value={totalUser} sub="Active Standard Nodes" icon={User} color="blue" />
      <StatCard label="Total Company" value={totalCompany} sub="Verified Partner Nodes" icon={Building2} color="cyan" />
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon, color }) {
  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-[13px] font-medium text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
        <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{value}</h4>
        <p className="text-[13px] font-medium text-slate-400 uppercase mt-1">{sub}</p>
      </div>
      <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center ${color === 'blue' ? 'bg-blue-50 text-blue-600' : 'bg-cyan-50 text-cyan-600'}`}>
        <Icon size={28} />
      </div>
    </div>
  );
}