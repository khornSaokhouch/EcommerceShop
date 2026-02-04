"use client";

import React, { useState } from "react";
import { 
  Shield, 
  Bell, 
  Zap, 
  Globe, 
  Lock, 
  Save, 
  ChevronRight, 
  Cpu, 
  Database, 
  Mail, 
  Smartphone,
  Eye,
  EyeOff
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    setIsProcessing(true);
    const tid = toast.loading("Updating System Logic...");
    setTimeout(() => {
      toast.success("Registry Protocols Synced", { id: tid });
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="space-y-10 pb-24 animate-in fade-in duration-700">
      
      {/* 1. PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[13px] font-medium uppercase tracking-[0.2em] mb-4 border border-blue-100">
            <Cpu className="w-3 h-3" /> System Config v4.0
          </div>
          <h1 className="text-3xl lg:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Terminal <span className="text-blue-600">Settings</span>
          </h1>
          <p className="text-slate-500 text-[13px] font-medium uppercase tracking-widest mt-2">Manage hardware registry logic and security nodes</p>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isProcessing}
          className="group relative px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold text-[13px] uppercase tracking-[0.2em] overflow-hidden transition-all active:scale-[0.98] shadow-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center gap-2">
            {isProcessing ? <Zap className="animate-spin w-4 h-4" /> : <Save className="w-4 h-4" />}
            Execute Sync
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: NAVIGATION NODES */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
             <h3 className="text-[13px] font-medium text-slate-500 uppercase tracking-[0.3em] mb-6 px-2">Configuration Nodes</h3>
             <div className="space-y-1">
                <SettingsNav active icon={Database} label="System Registry" />
                <SettingsNav icon={Shield} label="Security Protocols" />
                <SettingsNav icon={Bell} label="Comms & Alerts" />
                <SettingsNav icon={Globe} label="Regional Nodes" />
             </div>
          </div>

          {/* System Status Node */}
          <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600 opacity-20 blur-3xl rounded-full" />
             <p className="text-[13px] font-medium text-blue-400 uppercase tracking-widest mb-1">System Load</p>
             <h4 className="text-2xl font-black uppercase tracking-tighter mb-6 text-white">Registry Optimised</h4>
             <div className="space-y-4">
                <ProgressNode label="DB Sync" value="98%" />
                <ProgressNode label="API Node" value="Live" color="text-emerald-400" />
             </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PROTOCOL FIELDS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* General Registry Protocol */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-slate-100 shadow-sm">
            <h3 className="text-[13px] font-medium text-slate-900 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
              <Database className="text-blue-600 w-4 h-4" /> System Registry Designation
            </h3>
            
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <StyledInput label="Platform Title" placeholder="Technocore Ecosystem" defaultValue="TECHNOCORE_V4" />
                  <StyledInput label="Registry Node ID" placeholder="NODE-001-PRIME" defaultValue="DX-X109" />
               </div>
               <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">Registry Objective</label>
                  <textarea 
                    rows="3"
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none"
                    defaultValue="Primary hardware procurement and deployment grid for professional engineering units."
                  />
               </div>
            </div>
          </div>

          {/* Security Protocol Block */}
          <div className="bg-white rounded-[32px] p-8 sm:p-10 border border-slate-100 shadow-sm">
            <h3 className="text-[13px] font-medium text-slate-900 uppercase tracking-[0.2em] mb-10 flex items-center gap-3">
              <Shield className="text-emerald-500 w-4 h-4" /> Terminal Access Protocol
            </h3>
            
            <div className="space-y-8">
               <div className="space-y-2">
                  <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">Master Security Key</label>
                  <div className="relative">
                    <input 
                        type={showKey ? "text" : "password"}
                        className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-12 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
                        defaultValue="TECHNO-SECURE-KEY-2025"
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <button onClick={() => setShowKey(!showKey)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors">
                        {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ToggleNode label="2FA Authentication" active />
                  <ToggleNode label="Maintenance Mode" />
                  <ToggleNode label="Auto-Registry Sync" active />
                  <ToggleNode label="Global Node Visibility" active />
               </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function SettingsNav({ icon: Icon, label, active }) {
    return (
        <button className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 group ${active ? "bg-blue-50/50 text-blue-600" : "text-slate-500 hover:bg-slate-50"}`}>
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${active ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-blue-600"}`}>
                    <Icon size={16} />
                </div>
                <span className="text-[13px] font-medium uppercase tracking-widest">{label}</span>
            </div>
            <ChevronRight size={14} className={active ? "text-blue-400" : "text-slate-200"} />
        </button>
    );
}

function StyledInput({ label, icon: Icon, ...props }) {
    return (
        <div className="space-y-2">
            <label className="text-[13px] font-medium text-slate-500 uppercase tracking-widest ml-1">{label}</label>
            <input 
                {...props}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
            />
        </div>
    );
}

function ToggleNode({ label, active }) {
    return (
        <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-50 hover:border-slate-100 transition-all">
            <span className="text-[13px] font-medium text-slate-600 uppercase tracking-widest">{label}</span>
            <button className={`w-10 h-5 rounded-full relative transition-colors duration-300 ${active ? "bg-blue-600" : "bg-slate-200"}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 ${active ? "left-6" : "left-1"}`} />
            </button>
        </div>
    );
}

function ProgressNode({ label, value, color = "text-white" }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">{label}</span>
            <span className={`text-[13px] font-medium uppercase ${color}`}>{value}</span>
        </div>
    );
}