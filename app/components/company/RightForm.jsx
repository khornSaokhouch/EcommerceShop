"use client";

import { Building2, Globe, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin, Save, Loader2, UploadCloud, FileText } from "lucide-react";
import Image from "next/image";

export default function RightForm({ companyData, handleInputChange, loading, isNew }) {
  const companyInitial = companyData?.company_name?.[0] || "C";

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-8 sm:p-10 space-y-12">
      
      {/* Node Brand Identity */}
      <section className="flex flex-col items-center sm:items-start sm:flex-row gap-8 pb-10 border-b border-slate-50">
        <div className="relative group">
            <div className="w-32 h-32 rounded-[32px] p-0.5 bg-slate-100 overflow-hidden relative shadow-inner">
                <div className="w-full h-full rounded-[30px] bg-white border-2 border-white flex items-center justify-center overflow-hidden relative">
                    {companyData?.company_image_url || companyData?.company_image instanceof File ? (
                        <img 
                            src={companyData?.company_image instanceof File ? URL.createObjectURL(companyData.company_image) : companyData.company_image_url} 
                            className="object-contain p-2" 
                        />
                    ) : (
                        <span className="text-4xl font-black text-blue-600 opacity-20">{companyInitial}</span>
                    )}
                </div>
                <label className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer text-white rounded-[32px]">
                    <UploadCloud size={24} />
                    <input type="file" name="company_image" onChange={handleInputChange} className="hidden" />
                </label>
            </div>
        </div>
        <div className="flex-1 text-center sm:text-left pt-2">
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Visual node identifier</p>
            <h3 className="text-xl font-black text-slate-900 uppercase">{companyData?.company_name || "New Partner Node"}</h3>
            <p className="text-xs font-medium text-slate-400 mt-1 italic">Click the unit logo box to transmit a new visual identifier.</p>
        </div>
      </section>

      {/* Basic Registry Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TechnicalInput icon={Building2} label="Merchant Node Name" name="company_name" value={companyData?.company_name} onChange={handleInputChange} placeholder="Node Identity..." />
        <TechnicalInput icon={Globe} label="Digital Portal Link" name="website_url" value={companyData?.website_url} onChange={handleInputChange} placeholder="https://..." />
        
        <div className="md:col-span-2 space-y-2">
           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registry Intelligence (Description)</label>
           <textarea 
             name="description" rows="4" value={companyData?.description} onChange={handleInputChange}
             className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none"
             placeholder="About this hub..."
           />
        </div>
      </div>

      {/* Logistics Registry */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 border-b border-slate-50 pb-4">
            <MapPin size={14} /> Hub Logistics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TechnicalInput icon={MapPin} label="Street Identity" name="address" value={companyData?.address} onChange={handleInputChange} />
            <TechnicalInput icon={MapPin} label="City Node" name="city" value={companyData?.city} onChange={handleInputChange} />
            <TechnicalInput icon={MapPin} label="Country Node" name="country" value={companyData?.country} onChange={handleInputChange} />
        </div>
        <TechnicalInput icon={Clock} label="Operational Cycles (Hours)" name="business_hours" value={companyData?.business_hours} onChange={handleInputChange} placeholder="e.g. 09:00 - 18:00" />
      </div>

      {/* Comms Network */}
      <div className="space-y-6">
        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2 border-b border-slate-50 pb-4">
            <Globe size={14} /> External Comms
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TechnicalInput icon={Facebook} label="Facebook Registry" name="facebook_url" value={companyData?.facebook_url} onChange={handleInputChange} />
            <TechnicalInput icon={Instagram} label="Instagram Registry" name="instagram_url" value={companyData?.instagram_url} onChange={handleInputChange} />
            <TechnicalInput icon={Twitter} label="Twitter Registry" name="twitter_url" value={companyData?.twitter_url} onChange={handleInputChange} />
            <TechnicalInput icon={Linkedin} label="LinkedIn Registry" name="linkedin_url" value={companyData?.linkedin_url} onChange={handleInputChange} />
        </div>
      </div>

      {/* Submit Footer */}
      <div className="pt-10 border-t border-slate-50 flex justify-end">
        <button type="submit" disabled={loading} className="group relative px-12 py-5 bg-slate-900 text-white rounded-[20px] font-black text-[11px] uppercase tracking-[0.25em] overflow-hidden transition-all shadow-2xl active:scale-95">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center gap-3">
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Save size={16} />}
                {isNew ? "Register Hub Node" : "Sync Node Protocol"}
            </span>
        </button>
      </div>
    </div>
  );
}

const TechnicalInput = ({ icon: Icon, label, name, value, onChange, placeholder = "" }) => (
    <div className="space-y-2 w-full">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
        <div className="relative group">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
            <input 
                name={name} value={value || ""} onChange={onChange} placeholder={placeholder}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
            />
        </div>
    </div>
);