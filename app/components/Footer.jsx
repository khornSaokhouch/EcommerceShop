'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex,
} from 'react-icons/fa';
import { ShieldCheck, Globe, ArrowRight, Terminal, Cpu } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100">
   
     
      {/* Main Links Section */}
      <div className="container mx-auto p-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-6 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
                  TECHNOCORE
                </span>
              </div>
            </Link>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 max-w-xs">
              Next-generation marketplace for high-performance computing, mobile tech, and professional hardware peripherals.
            </p>
            <div className="flex gap-3">
              <SocialBtn icon={<FaFacebookF size={14} />} />
              <SocialBtn icon={<FaTwitter size={14} />} />
              <SocialBtn icon={<FaInstagram size={14} />} />
              <SocialBtn icon={<FaLinkedinIn size={14} />} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="font-black text-slate-900 text-[11px] mb-6 uppercase tracking-[0.2em]">Inventory</h4>
            <ul className="space-y-4">
              <FooterLink href="/store">Registry Store</FooterLink>
              <FooterLink href="#">New Units</FooterLink>
              <FooterLink href="#">Featured Gear</FooterLink>
              <FooterLink href="#">System Nodes</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 text-[11px] mb-6 uppercase tracking-[0.2em]">Support</h4>
            <ul className="space-y-4">
              <FooterLink href="/faq">Help Center</FooterLink>
              <FooterLink href="/contact-us">Contact Nodes</FooterLink>
              <FooterLink href="#">Warranty</FooterLink>
              <FooterLink href="#">Status</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 text-[11px] mb-6 uppercase tracking-[0.2em]">Protocol</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Use</FooterLink>
              <FooterLink href="#">Cookies</FooterLink>
            </ul>
          </div>

          {/* Security Node */}
          <div className="flex flex-col items-start lg:items-end">
             <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 w-full lg:w-auto">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                   </div>
                   <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Verified Gear</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                  Official manufacturer warranty <br/>& secure procurement.
                </p>
             </div>
          </div>

        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-slate-50/50 border-t border-slate-100 py-8">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
            <p className="text-slate-400 text-[12px] font-bold tracking-tight">
              © {new Date().getFullYear()} TECHNOCORE. ALL RIGHTS RESERVED.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-[11px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors cursor-pointer">
              <Globe className="w-4 h-4" />
              <span>International (EN-US)</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <FaCcVisa size={22} />
              <FaCcMastercard size={22} />
              <FaCcPaypal size={22} />
            </div>
            
            <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-50 border border-emerald-100 rounded-full">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-[9px] font-black text-emerald-600 tracking-widest uppercase">System Secure</span>
            </div>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

// Sub-Components
const FooterLink = ({ href, children }) => (
  <li>
    <Link 
      href={href} 
      className="text-sm font-medium text-slate-500 hover:text-blue-600 hover:translate-x-1 inline-flex items-center gap-2 transition-all duration-300 group"
    >
      <div className="w-1 h-1 bg-slate-200 rounded-full group-hover:bg-blue-600 transition-colors" />
      {children}
    </Link>
  </li>
);

const SocialBtn = ({ icon }) => (
  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:border-blue-600 hover:bg-blue-600 hover:text-white hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-90">
    {icon}
  </button>
);

export default Footer;