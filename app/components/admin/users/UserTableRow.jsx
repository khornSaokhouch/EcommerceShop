import { Edit, Trash2, Calendar, Mail, User, ShieldAlert, Loader2 } from "lucide-react";
import { RoleBadge } from "./RoleBadge";

export function UserTable({ users, loading, onEdit, onDelete }) {
  if (loading) return <div className="p-20 text-center flex flex-col items-center gap-4"><Loader2 className="animate-spin text-blue-600" /><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning Registry Nodes...</p></div>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-50/50">
          <tr>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Identity Node</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol</th>
            <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Connection</th>
            <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {users.map(user => (
            <UserTableRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function UserTableRow({ user, onEdit, onDelete }) {
  const imageUrl = user.profile_image_url;
  const initials = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <tr className="hover:bg-slate-50/30 transition-colors group">
      <td className="px-8 py-5 whitespace-nowrap">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-11 h-11 rounded-[16px] p-0.5 bg-slate-100 group-hover:bg-blue-600 transition-colors">
              <div className="w-full h-full rounded-[14px] overflow-hidden bg-white flex items-center justify-center border-2 border-white relative shadow-sm">
                {imageUrl ? <img src={imageUrl} alt="" className="w-full h-full object-cover" /> : <span className="text-xs font-black text-blue-600">{initials}</span>}
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
          </div>
          <div>
            <p className="text-[13px] font-black text-slate-900 uppercase tracking-tight truncate max-w-[180px]">{user.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="px-8 py-5"><RoleBadge role={user.role} /></td>
      <td className="px-8 py-5">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{new Date(user.created_at).toLocaleDateString()}</span>
      </td>
      <td className="px-8 py-5 text-right">
        <div className="flex justify-end gap-2">
          <button onClick={() => onEdit(user)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-blue-100"><Edit size={16} /></button>
          <button onClick={() => onDelete(user)} className="p-2.5 bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-white hover:shadow-lg rounded-xl transition-all border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
        </div>
      </td>
    </tr>
  );
}