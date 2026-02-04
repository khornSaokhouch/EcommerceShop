import { Edit, Trash2, Loader2 } from "lucide-react";
import { RoleBadge } from "./RoleBadge";

export function UserTable({ users, loading, startIndex, onEdit, onDelete }) {
  if (loading) return <TableLoader />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest"># ID</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">USER NAME & EMAIL</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">ROLE</th>
            <th className="px-8 py-5 text-[13px] font-medium text-slate-500 uppercase tracking-widest">CREATED AT</th>
            <th className="px-8 py-5 text-right text-[13px] font-medium text-slate-500 uppercase tracking-widest">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.map((user, index) => (
            <tr key={user.id} className="hover:bg-slate-50/30 transition-colors group">
              <td className="px-8 py-5 text-xs font-black text-slate-300">
                {String(startIndex + index + 1).padStart(2, '0')}
              </td>
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-blue-600 font-black border-2 border-white overflow-hidden shadow-sm">
                    {user.profile_image_url ? <img src={user.profile_image_url} className="w-full h-full object-cover" /> : user.name[0]}
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-slate-900 uppercase tracking-tight">{user.name}</p>
                    <p className="text-[13px] font-medium text-slate-500 tracking-widest uppercase">{user.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5"><RoleBadge role={user.role} /></td>
              <td className="px-8 py-5">
                <span className="text-[13px] font-medium text-slate-500 uppercase tracking-widest">{new Date(user.created_at).toLocaleDateString()}</span>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(user)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-xl transition-all"><Edit size={16} /></button>
                  <button onClick={() => onDelete(user)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TableLoader = () => (
    <div className="p-20 text-center flex flex-col items-center gap-4">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
        <p className="text-[13px] font-medium text-slate-500 uppercase tracking-widest animate-pulse">Syncing Registry Nodes...</p>
    </div>
);