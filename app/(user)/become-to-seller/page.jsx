"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  FileText,
  ShieldCheck,
  ChevronRight,
  Loader2,
  CheckCircle2,
  UploadCloud
} from "lucide-react";
import toast from "react-hot-toast";
import { useSellerStore } from "../../stores/useSellerStore";
import { useRouter } from "next/navigation";

const cambodianProvinces = [
  "Phnom Penh", "Banteay Meanchey", "Battambang", "Kampong Cham", "Kampong Chhnang",
  "Kampong Speu", "Kampong Thom", "Kampot", "Kandal", "Kep", "Koh Kong", "Kratie",
  "Mondulkiri", "Oddar Meanchey", "Pailin", "Preah Sihanouk", "Preah Vihear",
  "Prey Veng", "Pursat", "Ratanakiri", "Siem Reap", "Stung Treng", "Svay Rieng",
  "Takeo", "Tboung Khmum",
];

export default function BecomeCompanyForm() {
  const { form, loading, error, success, handleChange, handleFileChange, submitForm } = useSellerStore();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredProvinces = form.countryRegion
    ? cambodianProvinces.filter((p) => p.toLowerCase().includes(form.countryRegion.toLowerCase()))
    : cambodianProvinces;

  const handleProvinceSelect = (province) => {
    handleChange({ target: { name: "countryRegion", value: province } });
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
    if (success) {
      toast.success("Registry Request Transmitted");
      router.push("/");
    }
  }, [error, success, router]);

  return (
    <div className="min-h-screen px-4 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Static Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <ShieldCheck className="w-3 h-3" /> Merchant Registry
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase mb-4">
            Initialize <span className="text-blue-600">Merchant Node</span>
          </h1>
          <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
            Register your organizational identity within the global Technocore 
            hardware logistics network.
          </p>
        </div>

        {/* Form Body - Static Grid */}
        <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 p-8 lg:p-12">
          <form onSubmit={(e) => { e.preventDefault(); submitForm(); }} className="space-y-10">
            
            {/* HUB LOCATION */}
            <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" /> Sourcing Hub Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StyledInput 
                        label="Street Identity" 
                        icon={MapPin} 
                        name="streetAddress" 
                        value={form.streetAddress} 
                        onChange={handleChange} 
                        placeholder="e.g. Node 102 Alpha Tower" 
                    />
                    
                    <div className="relative" ref={dropdownRef}>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Province / City Node</label>
                        <div className="relative group">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                            <input
                                type="text"
                                name="countryRegion"
                                value={form.countryRegion}
                                onChange={(e) => { handleChange(e); setIsDropdownOpen(true); }}
                                onFocus={() => setIsDropdownOpen(true)}
                                required
                                placeholder="Search Hub..."
                                className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none"
                            />
                        </div>
                        {isDropdownOpen && (
                            <ul className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-[24px] shadow-2xl max-h-60 overflow-y-auto p-2 custom-scrollbar">
                                {filteredProvinces.map((province) => (
                                    <li
                                        key={province}
                                        className="px-4 py-3 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl cursor-pointer transition-colors"
                                        onClick={() => handleProvinceSelect(province)}
                                    >
                                        {province}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

            <div className="h-px bg-slate-50 w-full" />

            {/* ORGANIZATIONAL IDENTITY */}
            <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5" /> Organizational Identity
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <StyledInput label="Admin Full Name" icon={User} name="fullName" value={form.fullName} onChange={handleChange} required placeholder="Lead Authorized Agent" />
                    <StyledInput label="Official Company Name" icon={Building2} name="companyName" value={form.companyName} onChange={handleChange} required placeholder="Enterprise Title" />
                    <StyledInput label="Secure Contact Email" icon={Mail} name="email" value={form.email} type="email" onChange={handleChange} required placeholder="registry@enterprise.com" />
                    <StyledInput label="Communication Node" icon={Phone} name="phoneNumber" value={form.phoneNumber} type="tel" onChange={handleChange} placeholder="+855 000 000 000" />
                </div>
            </div>

            {/* DOCUMENTATION */}
            <div className="p-8 bg-slate-50/50 rounded-[32px] border border-slate-100">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> Registry Verification Data
                </h3>
                <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-[24px] bg-white cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <UploadCloud className="w-8 h-8 text-slate-300 group-hover:text-blue-500 mb-2 transition-colors" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600 px-4">
                            {form.document ? form.document.name : "Transmit Business License (PDF / DOCX)"}
                        </p>
                    </div>
                    <input 
  type="file" 
  name="document" 
  accept=".pdf,.doc,.docx" 
  onChange={handleFileChange} 
  className="hidden" 
/>

                </label>
            </div>

            {/* ACTION FOOTER */}
            <div className="pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full h-16 bg-slate-900 text-white rounded-[24px] overflow-hidden transition-all active:scale-[0.98] shadow-xl shadow-slate-200 flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 flex items-center justify-center gap-3">
                        {loading ? (
                            <Loader2 className="w-6 h-6 animate-spin text-white" />
                        ) : (
                            <>
                                <span className="text-[11px] font-black uppercase tracking-[0.25em]">Initialize Registration</span>
                                <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1.5" />
                            </>
                        )}
                    </div>
                </button>
                <div className="mt-8 flex items-center justify-center gap-2 opacity-40">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">AES-256 Protocol Enabled</span>
                </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Static Styled Input Component (No Motion)
const StyledInput = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
      {label} {props.required && <span className="text-blue-500">*</span>}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Icon className="w-4 h-4 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
      </div>
      <input
        {...props}
        className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-transparent rounded-2xl text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none"
      />
    </div>
  </div>
);