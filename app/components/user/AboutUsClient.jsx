"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { 
  FaFacebookF, 
  FaLinkedinIn, 
  FaGithub, 
} from 'react-icons/fa';
import { 
  Rocket, 
  ShieldCheck, 
  Users, 
  Cpu, 
  Globe, 
  ChevronRight,
  Zap
} from 'lucide-react';
import PartnerLogoBanner from './PartnerLogoBanner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const teamMembers = [
  {
    name: "Khorn Saokhouch",
    title: "CEO & Founder",
    image: "/me.png",
    description: "Driven by the vision of a unified hardware ecosystem, Khorn focuses on building high-performance architectures that simplify the global tech marketplace.",
    social: {
      facebook: "https://www.facebook.com/khorn.saokhouch.2025",
      linkedin: "https://www.linkedin.com/in/khorn-saokhouch-702026326",
      github: "https://github.com/khornSaokhouch",
    },
  },
];

const features = [
  {
    icon: Zap,
    title: "Neural Performance",
    description: "Built on cutting-edge architecture for sub-second load times and a frictionless procurement experience.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description: "Multi-layer AES-256 encryption and robust safety protocols protecting every node in the registry.",
  },
  {
    icon: Users,
    title: "Universal Interface",
    description: "A professional, user-centric dashboard designed for both high-volume vendors and hardware buyers.",
  },
];

const AboutUsClient = () => {
  return (
    <motion.main
      className="min-h-screen bg-white"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* 1. HERO SECTION - Compacted */}
      <motion.section
        className="relative bg-slate-900 pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden"
        variants={itemVariants}
      >
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0b1220] via-slate-900 to-slate-900" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />

        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 backdrop-blur-md text-blue-400 rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-6 border border-blue-500/20">
            <Cpu className="w-3 h-3" /> System Registry v2.0
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter uppercase leading-[1.1]">
            The <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent uppercase">Technocore</span> <br/>Mission
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto font-medium leading-relaxed">
            Architecting a professional marketplace where high-performance hardware 
            meets seamless digital procurement and registry management.
          </p>
        </div>
      </motion.section>

      {/* 2. MISSION & VALUES - Compact Cards */}
      <div className="max-w-6xl mx-auto px-6 -mt-12 lg:-mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <motion.section
            className="p-7 bg-white rounded-[24px] shadow-xl shadow-blue-900/5 border border-slate-100 group hover:border-blue-200 transition-all duration-500"
            variants={itemVariants}
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
              <Rocket className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Our Core Mission</h2>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Empowering hardware enterprises with <span className="text-blue-600 font-bold">verified and scalable</span> tools 
              to thrive in high-velocity markets.
            </p>
          </motion.section>

          <motion.section
            className="p-7 bg-white rounded-[24px] shadow-xl shadow-blue-900/5 border border-slate-100 group hover:border-cyan-200 transition-all duration-500"
            variants={itemVariants}
          >
            <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 mb-5 group-hover:bg-cyan-500 group-hover:text-white transition-all duration-500">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">Global Integrity</h2>
            <div className="space-y-3">
              <ValueItem label="Continuous Innovation" color="bg-blue-400" />
              <ValueItem label="Transparent Ecosystem" color="bg-cyan-400" />
            </div>
          </motion.section>
        </div>
      </div>

      {/* 3. FEATURES - Refined Sizing */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <motion.section variants={itemVariants} className="text-center mb-12">
          <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mb-3">Engineering Excellence</h2>
          <h3 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter">Hardware Elite Solutions</h3>
        </motion.section>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="p-6 bg-slate-50/50 rounded-[24px] border border-slate-100 text-center group hover:bg-white hover:shadow-lg transition-all duration-500"
              variants={itemVariants}
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm mx-auto mb-4 text-blue-600 group-hover:scale-110 transition-transform">
                <feature.icon size={24} />
              </div>
              <h4 className="text-base font-black text-slate-900 mb-2 uppercase tracking-tight">{feature.title}</h4>
              <p className="text-slate-500 text-xs leading-relaxed font-medium">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 4. FOUNDER SECTION - Compact & Focused */}
      <div className="bg-slate-900 py-20 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 -left-20 w-64 h-64 bg-blue-600 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-cyan-500 rounded-full blur-[100px]" />
        </div>

        <motion.section className="max-w-6xl mx-auto px-6 relative z-10" variants={containerVariants}>
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            
            <motion.div className="relative w-full max-w-[320px] lg:w-[350px] shrink-0" variants={itemVariants}>
              <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden group shadow-2xl">
                <Image
                  src={teamMembers[0].image}
                  alt={teamMembers[0].name}
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />
                
                <div className="absolute bottom-4 left-4 right-4 p-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-white font-bold text-[10px] uppercase tracking-widest">Active Status</span>
                    </div>
                    <span className="text-blue-400 font-bold text-[10px] uppercase tracking-widest">Admin</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="flex-1 text-center lg:text-left">
              <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[9px] font-black uppercase tracking-[0.3em] mb-4 border border-blue-500/20">
                The Visionary
              </motion.div>
              <motion.h3 variants={itemVariants} className="text-4xl lg:text-5xl font-black text-white mb-4 tracking-tighter uppercase leading-none">
                {teamMembers[0].name}
              </motion.h3>
              <motion.div variants={itemVariants} className="h-1 w-16 bg-gradient-to-r from-blue-600 to-cyan-400 mb-6 mx-auto lg:mx-0 rounded-full" />
              <motion.p variants={itemVariants} className="text-slate-400 text-base font-medium leading-relaxed mb-8 italic max-w-lg">
                "{teamMembers[0].description}"
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6">
                <div className="flex items-center gap-2.5">
                  <SocialIcon href={teamMembers[0].social.facebook} icon={<FaFacebookF size={14} />} />
                  <SocialIcon href={teamMembers[0].social.linkedin} icon={<FaLinkedinIn size={14} />} />
                  <SocialIcon href={teamMembers[0].social.github} icon={<FaGithub size={14} />} />
                </div>
                <div className="hidden sm:block w-px h-8 bg-slate-800" />
                <div className="text-left">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Inquiries</p>
                  <p className="text-white text-sm font-bold hover:text-blue-500 transition-colors cursor-pointer lowercase">khornsaokhouch4456@gmail.com</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>
      </div>

      {/* 5. PARTNER BANNER */}
      <div className="py-12 bg-white">
        <PartnerLogoBanner />
      </div>

      {/* 6. CALL TO ACTION - Compacted */}
      <motion.section className="bg-white pb-16 px-6" variants={itemVariants}>
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-[32px] p-10 lg:p-16 text-center relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-cyan-500" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter">
              Initiate Growth
            </h2>
            <p className="text-blue-50 text-sm mb-8 max-w-xl mx-auto font-medium opacity-90">
              Join the Technocore ecosystem today and transform your hardware deployment workflow.
            </p>
            <Link
              href="/store"
              className="bg-white text-blue-600 hover:bg-slate-900 hover:text-white font-black py-4 px-10 rounded-xl text-[10px] uppercase tracking-[0.2em] transition-all duration-500 inline-flex items-center gap-2 shadow-xl"
            >
              Enter Marketplace <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>
    </motion.main>
  );
};

// Helpers
const ValueItem = ({ label, color }) => (
  <div className="flex items-center gap-2.5">
    <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
    <span className="text-slate-700 font-bold text-[11px] uppercase tracking-wide">{label}</span>
  </div>
);

const SocialIcon = ({ href, icon }) => (
  <Link 
    href={href} target="_blank"
    className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-white rounded-xl hover:bg-blue-600 hover:border-blue-600 transition-all duration-300"
  >
    {icon}
  </Link>
);

export default AboutUsClient;