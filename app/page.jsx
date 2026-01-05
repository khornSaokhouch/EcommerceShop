"use client";

import React from 'react';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Zap, ShieldCheck, Globe } from 'lucide-react';
import Product from './components/user/Products';

export default function HomePage() {
    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            {/* 1. HERO SECTION - Balanced Padding */}
            <section className="relative lg:pb-32 overflow-hidden">
                <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex-1 text-center lg:text-left z-10"
                        >
                            <span className="inline-block py-1 px-3 rounded-lg bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-widest mb-6 border border-blue-200">
                                Season 2025 Hardware
                            </span>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight mb-6">
                                The Next Gen of <br />
                                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent italic">Tech Hardware.</span>
                            </h1>
                            <p className="text-slate-500 text-base md:text-lg max-w-xl mb-10 mx-auto lg:mx-0 leading-relaxed">
                                Experience ultra-performance with our curated collection of professional-grade hardware and next-gen peripherals.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                                <button className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 group shadow-xl shadow-blue-200">
                                    Shop Collection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                                    Build Your Setup
                                </button>
                            </div>
                        </motion.div>

                        {/* Hero Image - Scaled down for better balance */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 w-full max-w-[450px] lg:max-w-none relative"
                        >
                            <div className="relative z-10 w-full aspect-square bg-gradient-to-br from-blue-50 to-cyan-50 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
                                <img 
                                    src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80" 
                                    alt="Hero Tech" 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* 2. PRODUCT GRID SECTION - Uses container to prevent "Big Card" issue */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 max-w-7xl">
                    <Product />
                </div>
            </section>

            {/* 3. TRUST FEATURES - Standard spacing */}
            <section className="container mx-auto px-4 py-20 max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <FeatureCard icon={Zap} title="Instant Delivery" desc="Same day dispatch on all orders." />
                    <FeatureCard icon={Cpu} title="Authentic Tech" desc="100% Genuine hardware warranty." />
                    <FeatureCard icon={ShieldCheck} title="Secured Payments" desc="AES-256 Bit encrypted transactions." />
                    <FeatureCard icon={Globe} title="Global Shipping" desc="Available in over 120 countries." />
                </div>
            </section>

            <Footer />
        </div>
    );
}

const FeatureCard = ({ icon: Icon, title, desc }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start gap-4 lg:flex-col lg:items-start lg:p-8">
        <div className="w-10 h-10 shrink-0 bg-blue-50 rounded-xl flex items-center justify-center">
            <Icon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
            <h4 className="font-bold text-slate-900 mb-1 text-sm lg:text-base">{title}</h4>
            <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
        </div>
    </div>
);