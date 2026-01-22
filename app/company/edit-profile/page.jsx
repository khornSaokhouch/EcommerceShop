"use client";

import { useEffect, useState } from "react";
import LeftProfile from "../../components/company/LeftProfile";
import RightForm from "../../components/company/RightForm";
import { useCompanyInfoStore } from "../../stores/useCompanyInfoStore";
import { useUserStore } from "../../stores/userStore";
import { toast } from "react-hot-toast";
import { Cpu, Settings2, Zap } from "lucide-react";

export default function CompanyEditPage() {
  const { user, fetchUser, updateUser } = useUserStore();
  const { company, loading, createCompany, updateCompany, setFieldValue, fetchCompanyByUserId } = useCompanyInfoStore();

  const [updating, setUpdating] = useState(false);
  const isNew = !company?.id;

  useEffect(() => {
    if (!user) fetchUser();
    if (user?.id) fetchCompanyByUserId(user.id);
  }, [user, fetchUser, fetchCompanyByUserId]);

  const handleInputChange = (e) => {
    const { name, type, value, files } = e.target;
    setFieldValue(name, type === "file" ? (files?.[0] ?? null) : value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    const tid = toast.loading("Syncing Node Data...");
    try {
      if (isNew) await createCompany(company);
      else await updateCompany(company.id, company);
      toast.success("Hub Protocol Updated", { id: tid });
    } catch (err) {
      toast.error(err.message || "Sync Failed", { id: tid });
    } finally { setUpdating(false); }
  };

  const handleSaveProfile = async ({ name, imageFile }) => {
    setUpdating(true);
    const tid = toast.loading("Updating Identity...");
    try {
      const data = new FormData();
      data.append("name", name);
      if (imageFile) data.append("image", imageFile);
      await updateUser(data);
      toast.success("Identity Node Synced", { id: tid });
      fetchUser();
    } catch (err) {
      toast.error("Update Failed", { id: tid });
    } finally { setUpdating(false); }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <Settings2 className="w-3 h-3" /> Node Configuration
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Hub <span className="text-blue-600">Protocol</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2 italic">Modify partner node parameters and identity</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: User Identity */}
        <div className="lg:col-span-4">
           <LeftProfile user={user} onSaveProfile={handleSaveProfile} updating={updating} />
        </div>

        {/* Right Side: Company Form */}
        <div className="lg:col-span-8">
           <form onSubmit={handleSubmit}>
              <RightForm
                companyData={company}
                handleInputChange={handleInputChange}
                loading={loading || updating}
                isNew={isNew}
              />
           </form>
        </div>
      </div>
    </div>
  );
}