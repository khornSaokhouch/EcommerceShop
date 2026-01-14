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
import { ShieldCheck, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 mt-10">
      {/* Main Links Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-6">
          
          {/* Brand Info - Spans 2 columns */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4 group">
              <span className="text-xl sm:text-2xl font-black tracking-tighter bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent uppercase">
                TECHNOCORE
              </span>
            </Link>
            <p className="text-slate-500 text-[13px] leading-relaxed mb-6 max-w-xs">
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
          <div className="sm:pl-4">
            <h4 className="font-bold text-slate-900 text-sm mb-5 uppercase tracking-wider">Explore</h4>
            <ul className="space-y-3">
              <FooterLink href="/store">All Products</FooterLink>
              <FooterLink href="#">New Arrivals</FooterLink>
              <FooterLink href="#">Best Sellers</FooterLink>
              <FooterLink href="#">Custom Builds</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-5 uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              <FooterLink href="/faq">Help Center</FooterLink>
              <FooterLink href="/contact-us">Contact Us</FooterLink>
              <FooterLink href="#">Shipping</FooterLink>
              <FooterLink href="#">Warranty</FooterLink>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-5 uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Use</FooterLink>
              <FooterLink href="#">Cookies</FooterLink>
            </ul>
          </div>

          {/* Trust Pilot / Extra Info */}
          <div className="flex flex-col items-start lg:items-end">
             <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 w-full lg:w-auto">
                <div className="flex items-center gap-2 mb-2">
                   <ShieldCheck className="w-4 h-4 text-blue-600" />
                   <span className="text-[11px] font-black text-slate-700 uppercase">Trusted Gear</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-tight">
                  Verified sellers & <br/>Secure transactions.
                </p>
             </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-50/50 border-t border-gray-100 py-6">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <p className="text-slate-400 text-[12px] font-medium">
              © {new Date().getFullYear()} TECHNOCORE.
            </p>
            <div className="flex items-center gap-2 text-slate-400 text-[12px] hover:text-blue-600 cursor-pointer transition-colors">
              <Globe className="w-3.5 h-3.5" />
              <span>English (US)</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="flex items-center gap-3 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <FaCcVisa size={20} />
              <FaCcMastercard size={20} />
              <FaCcPaypal size={20} />
              <FaCcAmex size={20} />
            </div>
            
            <div className="hidden sm:block h-4 w-[1px] bg-slate-200" />

            <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-gray-200 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[9px] font-black text-slate-500 tracking-widest uppercase">AES-256 Secured</span>
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
    <Link 
      href={href} 
      className="text-[13px] font-medium text-slate-500 hover:text-blue-600 hover:translate-x-1 inline-block transition-all duration-200"
    >
      {children}
    </Link>
  </li>
);

const SocialBtn = ({ icon }) => (
  <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-400 hover:border-blue-200 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-500/10 transition-all active:scale-90">
    {icon}
  </button>
);

export default Footer;