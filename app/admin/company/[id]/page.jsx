"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Building2, Globe, Clock, MapPin, Facebook, Twitter, 
  Linkedin, Instagram, Calendar, ShieldCheck, ChevronLeft, 
  ExternalLink, Loader2, Cpu, Link as LinkIcon, Package, Search
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Stores
import { useCompanyInfoStore } from "../../../stores/useCompanyInfoStore";
import { useProductStore } from "../../../stores/useProductStore";

// Component Re-use
import ProductCard from "../../../components/user/ProductCard";

export default function CompanyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const { companies, fetchCompanies, loading: companyLoading } = useCompanyInfoStore();
  const { products, fetchProductsByStore, loading: productsLoading } = useProductStore();
  
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (companies.length === 0) {
      fetchCompanies();
    } else {
      const found = companies.find((c) => String(c.id) === String(id));
      setCompany(found);
    }
  }, [id, companies, fetchCompanies]);

  // Fetch products associated with this company node
  useEffect(() => {
    if (id) {
      fetchProductsByStore(id);
    }
  }, [id, fetchProductsByStore]);

  if (companyLoading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={32} />
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Syncing Node Registry...</p>
    </div>
  );

  if (!company && !companyLoading) return <NodeErrorState onBack={() => router.back()} />;

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-24 px-4 sm:px-0">
      
      {/* 1. TOP HEADER */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Registry
        </button>
        <div className="px-4 py-2 bg-slate-900 text-white rounded-full flex items-center gap-2">
           <Cpu size={14} className="text-blue-400" />
           <span className="text-[9px] font-black uppercase tracking-widest">Active Partner Hub</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. IDENTITY PROFILE (LEFT) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white rounded-[32px] p-8 lg:p-12 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
              <div className="relative w-32 h-32 lg:w-44 lg:h-44 rounded-[40px] p-1 bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-2xl shrink-0">
                 <div className="w-full h-full rounded-[36px] overflow-hidden bg-white flex items-center justify-center border-4 border-white relative shadow-inner">
                    {company.company_image_url ? (
                      <img src={company.company_image_url} alt={company.company_name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="text-blue-600 w-16 h-16 opacity-20" />
                    )}
                 </div>
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                   <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-2">Protocol: HW-PARTNER-01</p>
                   <h1 className="text-4xl lg:text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">{company.company_name}</h1>
                </div>
                <p className="text-slate-500 text-lg leading-relaxed font-medium italic max-w-2xl">"{company.description}"</p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Badge icon={MapPin} label={company.city || "Global Hub"} />
                  <Badge icon={Calendar} label={`Registered ${new Date(company.created_at).getFullYear()}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mb-8 flex items-center gap-2">
                <Globe className="w-4 h-4" /> Communication Channels
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <SocialItem icon={Facebook} label="Facebook" href={company.facebook_url} />
              <SocialItem icon={Twitter} label="Twitter" href={company.twitter_url} />
              <SocialItem icon={Instagram} label="Instagram" href={company.instagram_url} />
              <SocialItem icon={Linkedin} label="LinkedIn" href={company.linkedin_url} />
            </div>
          </div>
        </div>

        {/* 3. LOGISTICS DATA (RIGHT) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600 opacity-20 blur-3xl rounded-full" />
             <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-8">Hub Parameters</h3>
             <div className="space-y-8 relative z-10">
                <SpecItem icon={MapPin} label="Physical Hub" value={company.address} sub={`${company.city}, ${company.country}`} />
                <SpecItem icon={Clock} label="Operational cycle" value={company.business_hours} sub="Registry Local Time" />
                <SpecItem icon={LinkIcon} label="Digital Portal" value={company.website_url ? "Portal Active" : "Internal"} isLink href={company.website_url} />
             </div>
          </div>
        </div>
      </div>

      {/* 4. PRODUCT INVENTORY SECTION (NEW) */}
      <section className="mt-16">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4 border-b border-slate-100 pb-8 px-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest mb-2 border border-blue-100">
               <Package className="w-3 h-3" /> Live Inventory
            </div>
            <h2 className="text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter">Hardware <span className="text-blue-600">Deployment</span></h2>
          </div>
          <div className="px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-center min-w-[140px]">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Deployed Units</p>
            <p className="text-2xl font-black text-slate-900">{products.length}</p>
          </div>
        </div>

        {productsLoading ? (
          <div className="py-20 text-center">
            <Loader2 className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Decrypting Hardware Nodes...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center bg-slate-50/50 rounded-[40px] border border-dashed border-slate-200">
             <Package className="mx-auto mb-4 text-slate-300" size={48} />
             <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No Active Units in Registry</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 px-2 sm:px-0"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </section>

    </div>
  );
}

/* --- HELPERS --- */

function Badge({ icon: Icon, label }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">
      <Icon size={12} /> {label}
    </div>
  );
}

function SocialItem({ icon: Icon, label, href }) {
  return (
    <a href={href || "#"} target={href ? "_blank" : "_self"} className={`flex flex-col items-center justify-center p-5 rounded-[24px] border border-slate-50 transition-all duration-300 group ${href ? "bg-white hover:bg-blue-600 hover:border-blue-600 cursor-pointer shadow-sm hover:shadow-blue-500/20" : "bg-slate-50/50 opacity-40 cursor-not-allowed"}`}>
      <Icon size={24} className={href ? "text-slate-400 group-hover:text-white" : "text-slate-300"} />
      <span className={`mt-3 text-[9px] font-black uppercase tracking-widest ${href ? "text-slate-500 group-hover:text-white" : "text-slate-300"}`}>{label}</span>
    </a>
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
        <div className="flex items-center gap-2 overflow-hidden">
            <p className="font-bold text-white text-sm truncate">{value || "Registry Only"}</p>
            {isLink && href && <ExternalLink size={12} className="text-blue-400" />}
        </div>
        <p className="text-[10px] font-medium text-slate-400 mt-0.5 truncate">{sub}</p>
      </div>
    </div>
  );
}

function NodeErrorState({ onBack }) {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center bg-white p-8 text-center">
      <ShieldCheck className="text-red-500 mb-6" size={48} />
      <h2 className="text-2xl font-black text-slate-900 uppercase">Unit Registry Error</h2>
      <p className="text-slate-500 text-sm mt-2 mb-8">Node identity not found in database.</p>
      <button onClick={onBack} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest">Return to Base</button>
    </div>
  );
}