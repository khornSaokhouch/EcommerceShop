"use client";

import React from 'react';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { motion } from 'framer-motion';
import { 
  ArrowRight, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Boxes, 
  Microchip, 
  ZapIcon, 
  ChevronRight,
  Monitor
} from 'lucide-react';
import Link from 'next/link';

// --- STATIC DATA FOR UI ---
const STATIC_PRODUCTS = [
  { id: 1, name: "Nvidia RTX 5090 FE", price: 1999, category: "GPU", image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "Ryzen 9 9950X", price: 699, category: "CPU", image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "ROG Maximus Z890", price: 549, category: "Motherboard", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Dominator 64GB DDR5", price: 299, category: "Memory", image: "https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&q=80&w=400" },
];

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#fcfdfe] overflow-x-hidden">
            <Navbar />

            {/* 1. HERO SECTION */}
            <section className="relative pt-32 pb-20 lg:pt-28 lg:pb-32 overflow-hidden bg-slate-900">
                {/* Glow effects */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] pointer-events-none" />

                <div className="container mx-auto px-6 max-w-7xl relative z-10 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/10 backdrop-blur-md text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-blue-500/20"
                    >
                        <Microchip className="w-3 h-3" /> System Registry v4.0
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase mb-8"
                    >
                        Next-Gen <br/>
                        <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400 bg-clip-text text-transparent">Hardware</span> Nodes
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="text-slate-400 text-lg max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
                    >
                        Deploy high-performance computing units directly from the Technocore registry. 
                        Verified hardware for professional engineers and elite builders.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link href="/store" className="group relative px-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] overflow-hidden transition-all shadow-xl shadow-blue-500/20">
                            <div className="relative z-10 flex items-center gap-2">
                                Enter Marketplace <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                        <Link href="/about-us" className="px-10 py-5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all backdrop-blur-sm">
                            Mission Log
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* 2. TRUST FEATURES */}
            <section className="container mx-auto px-6 py-12 -mt-12 relative z-20 max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FeatureCard icon={Zap} title="Instant Sync" desc="Real-time registry tracking." />
                    <FeatureCard icon={Cpu} title="Core Tech" desc="100% Verified hardware units." />
                    <FeatureCard icon={ShieldCheck} title="SSL Secured" desc="End-to-end encrypted buy nodes." />
                    <FeatureCard icon={Globe} title="Global Grid" desc="Shipping to 120+ territories." />
                </div>
            </section>

            {/* 3. STATIC FEATURED PRODUCTS */}
            <section className="container mx-auto px-6 py-24 max-w-7xl">
                <div className="flex flex-col sm:flex-row items-end justify-between gap-6 mb-12 border-b border-slate-100 pb-8">
                    <div>
                        <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mb-3">Inventory</p>
                        <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase">Featured <span className="text-blue-600">Units</span></h2>
                    </div>
                    <Link href="/store" className="text-[10px] font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest flex items-center gap-2 transition-colors">
                        View Full Registry <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8">
                    {STATIC_PRODUCTS.map((product) => (
                        <StaticProductCard key={product.id} product={product} />
                    ))}
                </div>
            </section>

            {/* 4. CATEGORY BANNER */}
            <section className="container mx-auto px-6 pb-24 max-w-7xl">
                <div className="bg-slate-900 rounded-[40px] p-8 lg:p-16 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent" />
                    <div className="relative z-10 text-center lg:text-left max-w-xl">
                        <h3 className="text-3xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none mb-6">
                            Architect Your <br/> <span className="text-blue-500">Dream Setup</span>
                        </h3>
                        <p className="text-slate-400 font-medium mb-8">
                            From high-speed memory nodes to next-gen visual processors, 
                            source every component your terminal needs.
                        </p>
                        <Link href="/categories" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">
                            Browse Categories <Boxes className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="relative z-10 shrink-0 lg:rotate-6 group-hover:rotate-0 transition-transform duration-700">
                        <div className="w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-[40px] p-1 shadow-2xl">
                             <div className="w-full h-full bg-slate-800 rounded-[38px] flex items-center justify-center border-4 border-slate-900">
                                <Monitor className="w-32 h-32 text-blue-500 opacity-20" />
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}

// --- SUB-COMPONENTS ---

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group">
        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
            <Icon className="w-6 h-6 text-blue-600 group-hover:text-white" />
        </div>
        <h4 className="font-black text-slate-900 mb-1 text-[11px] uppercase tracking-widest">{title}</h4>
        <p className="text-[11px] text-slate-400 font-bold uppercase leading-tight">{desc}</p>
    </div>
);

const StaticProductCard = ({ product }) => (
    <div className="bg-white rounded-[28px] border border-slate-100 p-4 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group flex flex-col h-full">
        <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden mb-4 p-4 border border-slate-50">
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner">
                <img src={product.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
        </div>
        <div className="px-2 pb-2 flex-1 flex flex-col">
            <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">{product.category}</span>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4">{product.name}</h4>
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-50">
                <span className="text-lg font-black text-slate-900 tracking-tighter">${product.price}</span>
                <button className="w-9 h-9 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all">
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    </div>
);