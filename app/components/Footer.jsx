"use client";

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
import { ShieldCheck, Mail, ArrowRight, Globe } from 'lucide-react';

const TechLogoIcon = () => (
  <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-blue-200">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 8L3 12L7 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 8L21 12L17 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 4L10 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

const EcommerceFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      {/* 1. Newsletter Section */}
      <div className="border-b border-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Join the tech revolution</h3>
                <p className="text-slate-400">Subscribe to get notified about product launches and exclusive offers.</p>
              </div>
              <div className="w-full lg:w-auto">
                <form className="flex flex-col sm:flex-row gap-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="w-full sm:w-80 pl-12 pr-4 py-4 bg-slate-800 border-none rounded-2xl text-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                  <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 group">
                    Subscribe <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Links */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
          
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <TechLogoIcon />
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                TECHNOCORE
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-8 max-w-sm">
              The world's most advanced marketplace for high-performance computing, mobile tech, and next-gen hardware peripherals.
            </p>
            <div className="flex gap-4">
              <SocialBtn icon={<FaFacebookF />} />
              <SocialBtn icon={<FaTwitter />} />
              <SocialBtn icon={<FaInstagram />} />
              <SocialBtn icon={<FaLinkedinIn />} />
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Explore</h4>
            <ul className="space-y-4">
              <FooterLink href="/products">All Products</FooterLink>
              <FooterLink href="#">New Arrivals</FooterLink>
              <FooterLink href="#">Best Sellers</FooterLink>
              <FooterLink href="#">Custom Builds</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Support</h4>
            <ul className="space-y-4">
              <FooterLink href="/faq">Help Center</FooterLink>
              <FooterLink href="/contact-us">Contact Us</FooterLink>
              <FooterLink href="#">Shipping Policy</FooterLink>
              <FooterLink href="#">Warranty</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Legal</h4>
            <ul className="space-y-4">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Use</FooterLink>
              <FooterLink href="#">Cookie Settings</FooterLink>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="bg-slate-50 border-t border-gray-100 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <p className="text-slate-500 text-sm">
              © {new Date().getFullYear()} TechnoCore. Built for the future.
            </p>
            <div className="hidden md:flex items-center gap-2 text-slate-400 text-sm">
              <Globe className="w-4 h-4" />
              <span>English (US)</span>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-gray-200 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-[10px] font-bold text-slate-600 tracking-widest uppercase">AES-256 Secured</span>
            </div>
            
            <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all">
              <FaCcVisa size={22} />
              <FaCcMastercard size={22} />
              <FaCcPaypal size={22} />
              <FaCcAmex size={22} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Helper Components
const FooterLink = ({ href, children }) => (
  <li>
    <Link href={href} className="text-sm text-slate-500 hover:text-blue-600 transition-colors">
      {children}
    </Link>
  </li>
);

const SocialBtn = ({ icon }) => (
  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 hover:bg-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-200 transition-all">
    {icon}
  </button>
);

export default EcommerceFooter;