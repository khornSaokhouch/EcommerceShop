"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../../stores/userStore";
import { useCompanyInfoStore } from "../../stores/useCompanyInfoStore";
import Image from "next/image";
import { 
  Mail, MapPin, Clock, Globe, Facebook, Instagram, 
  Twitter, Linkedin, Edit3, Settings, ShieldCheck, 
  Cpu, ExternalLink, Zap, Building2, User 
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function CompanyProfilePage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { company, fetchCompanyByUserId } = useCompanyInfoStore();
  const [loading, setLoading] = useState(true);

  // ✅ Fixed useEffect Logic: Stabilized dependency array
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        await fetchCompanyByUserId(user.id);
      } catch (err) {
        console.error("Registry fetch failed", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [user?.id, fetchCompanyByUserId]); // Dependency size now remains constant

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center bg-white">
      <Zap className="animate-spin text-blue-600 mb-4" size={32} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Accessing Node identity...</p>
    </div>
  );

  const displayCompany = company || {};
  const companyInitial = (displayCompany.company_name || user?.name || "C")[0].toUpperCase();

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-700 font-sans">
      
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <Cpu className="w-3 h-3" /> Partner Hub
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Node <span className="text-blue-600">Specs</span>
          </h1>
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-2">Verified Sourcing Hub identity</p>
        </div>
        
        <div className="flex items-center gap-3">
            <button 
                onClick={() => router.push("/company/settings")}
                className="p-3.5 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 rounded-2xl transition-all shadow-sm"
            >
                <Settings size={20} />
            </button>
            <button
                onClick={() => router.push("/company/edit-profile")}
                className="group relative px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10 flex items-center gap-2">
                    <Edit3 size={16} /> Modify Profile
                </span>
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 2. IDENTITY PROFILE (LEFT) */}
        <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-[32px] p-8 lg:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
                    {/* --- COMPANY IMAGE / INITIALS FALLBACK --- */}
                    <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-[32px] p-1 bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-2xl shrink-0">
                        <div className="w-full h-full rounded-[28px] overflow-hidden bg-white flex items-center justify-center border-4 border-white relative shadow-inner">
                            {displayCompany.company_image_url ? (
                                <Image
                                    src={displayCompany.company_image_url}
                                    alt="Node Identity"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <span className="text-4xl font-black text-blue-600">{companyInitial}</span>
                                    <div className="h-0.5 w-4 bg-blue-100 mt-1 rounded-full" />
                                </div>
                            )}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 border-4 border-white rounded-xl flex items-center justify-center text-white shadow-lg">
                            <ShieldCheck size={16} />
                        </div>
                    </div>

                    <div className="flex-1 text-center md:text-left space-y-5">
                        <div>
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2 px-1">Merchant Node Registry</p>
                            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                                {displayCompany.company_name || user?.name || "Node Offline"}
                            </h2>
                        </div>
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 pt-2">
                            <IdentityMeta label="Master Admin" value={user?.name} icon={User} />
                            <IdentityMeta label="Protocol Email" value={user?.email} icon={Mail} />
                        </div>
                    </div>
                </div>
            </div>

            {/* About Node */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Building2 className="w-4 h-4" /> Registry Intelligence
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium italic text-lg">
                    "{displayCompany.description || "Authorized ecosystem partner verified for high-performance hardware distribution."}"
                </p>
            </div>
        </div>

        {/* 3. LOGISTICS (RIGHT) */}
        <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600 opacity-20 blur-3xl rounded-full" />
                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-8">Node Parameters</h3>
                
                <div className="space-y-8 relative z-10">
                    <SpecItem icon={MapPin} label="Base Hub" value={`${displayCompany.city || 'Global Hub'}`} sub={displayCompany.address || 'Internal Registry'} />
                    <SpecItem icon={Clock} label="Operational Cycle" value={displayCompany.business_hours || "09:00 - 18:00"} sub="Node Local Cycle" />
                    <SpecItem icon={Globe} label="Digital Portal" value={displayCompany.website_url ? "Link Active" : "No Portal"} sub={displayCompany.website_url || "Registry only"} isLink href={displayCompany.website_url} />
                </div>
            </div>

            {/* Comms */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">Comms Links</h3>
                <div className="flex gap-3">
                    <SocialNode icon={Facebook} href={displayCompany.facebook_url} />
                    <SocialNode icon={Instagram} href={displayCompany.instagram_url} />
                    <SocialNode icon={Twitter} href={displayCompany.twitter_url} />
                    <SocialNode icon={Linkedin} href={displayCompany.linkedin_url} />
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}

// --- REUSABLE SUB-COMPONENTS ---

function IdentityMeta({ label, value, icon: Icon }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                <Icon size={14} />
            </div>
            <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
                <p className="text-sm font-bold text-slate-700">{value}</p>
            </div>
        </div>
    );
}

function SpecItem({ icon: Icon, label, value, sub, isLink, href }) {
    return (
        <div className="flex gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-blue-600 transition-colors">
                <Icon size={18} className="text-blue-400 group-hover:text-white" />
            </div>
            <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-sm truncate">{value}</p>
                    {isLink && href && <ExternalLink size={12} className="text-blue-400" />}
                </div>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5 truncate">{sub}</p>
            </div>
        </div>
    );
}

function SocialNode({ icon: Icon, href }) {
    if (!href) return null;
    return (
        <a 
            href={href} target="_blank" rel="noreferrer"
            className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all active:scale-90"
        >
            <Icon size={18} />
        </a>
    );
}