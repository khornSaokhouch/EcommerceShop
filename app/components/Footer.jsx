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
  FaLock
} from 'react-icons/fa';

// --- TechLogoIcon component remains the same (Great use of SVG gradient!) ---
const TechLogoIcon = (props) => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <defs>
      <linearGradient
        id="logoGradient"
        x1="12"
        y1="20"
        x2="28"
        y2="20"
        gradientUnits="userSpaceOnUse"
      >
        {/* Using a defined, slightly darker gradient for better contrast */}
        <stop stopColor="#EC4899" /> {/* Pink-600 */}
        <stop offset="1" stopColor="#8B5CF6" /> {/* Violet-600 */}
      </linearGradient>
    </defs>
    <path
      d="M12 10H28"
      stroke="url(#logoGradient)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M20 10V30"
      stroke="url(#logoGradient)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <path
      d="M16 30C16 27.7909 17.7909 26 20 26C22.2091 26 24 27.7909 24 30"
      stroke="url(#logoGradient)"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

const EcommerceFooter = () => {
  return (
    // Updated container: clean white background, removed large background image styles
    <footer
      className="bg-white text-gray-800 font-sans border-t border-gray-200"
    >
      
      {/* Section 2: Main Footer Links - Increased padding/gap for spacious feel */}
      <div className="container mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          
          {/* Column 1: Brand & Social */}
          <div className="col-span-2 md:col-span-2 pr-8">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <TechLogoIcon className="h-8 w-8" />
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-600 to-violet-600 text-transparent bg-clip-text whitespace-nowrap">
                TECHNESS
              </span>
            </Link>
            <p className="text-gray-600 text-sm mb-6">
              Your one-stop shop for the latest and greatest in high-performance tech and gadgets.
            </p>
            <div className="flex space-x-5">
              {/* Social Icons: Use neutral gray, apply brand color on hover */}
              <Link href="#" className="text-gray-400 hover:text-blue-600 transition-colors"><FaFacebookF size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><FaTwitter size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-pink-600 transition-colors"><FaInstagram size={20} /></Link>
              <Link href="#" className="text-gray-400 hover:text-blue-800 transition-colors"><FaLinkedinIn size={20} /></Link>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="font-bold text-gray-800 uppercase tracking-wider mb-4 text-sm">Shop</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="text-gray-700 hover:text-violet-600 transition-colors text-sm">New Arrivals</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-violet-600 transition-colors text-sm">Best Sellers</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-violet-600 transition-colors text-sm">Laptops</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-violet-600 transition-colors text-sm">Smartphones</Link></li>
              <li><Link href="#" className="text-gray-700 hover:text-violet-600 transition-colors text-sm">Accessories</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-bold text-gray-800 uppercase tracking-wider mb-4 text-sm">Support</h4>
            <ul className="space-y-3">
              <li><Link href="/contact-us" className="text-gray-700 hover:text-violet-600 transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-700 hover:text-violet-600 transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/shipping-returns" className="text-gray-700 hover:text-violet-600 transition-colors text-sm">Shipping & Returns</Link></li>
              <li><Link href="/partners" className="text-gray-700 hover:text-violet-600 transition-colors text-sm">Our Partners</Link></li>
            </ul>
          </div>

          {/* Column 4: Policies */}
          <div>
            <h4 className="font-bold text-gray-800 uppercase tracking-wider mb-4 text-sm">Company</h4>
            <ul className="space-y-3">
              <li><Link href="/our-story" className="text-gray-700 hover:text-violet-600 transition-colors text-sm">Our Story</Link></li>
              <li><Link href="/careers" className="text-gray-700 hover:text-violet-600 transition-colors text-sm">Careers</Link></li>
              <li><Link href="/terms-of-service" className="text-gray-700 hover:text-violet-600 transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-700 hover:text-violet-600 transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Bottom Bar with Copyright and Payment Icons - Subtle background, clean separation */}
      <div className="bg-gray-50 py-4 border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
          
          {/* Copyright */}
          <p className="text-gray-500 text-center sm:text-left text-xs sm:text-sm">
            © {new Date().getFullYear()} TECHNESS. All Rights Reserved.
          </p>

          <div className="flex items-center space-x-6">
            
            {/* Security Badge - Simplified style */}
            <div className="flex items-center space-x-1">
              <FaLock className="text-green-600 w-4 h-4" />
              <span className="text-gray-600 text-xs font-semibold tracking-wider">SSL SECURED</span>
            </div>
            
            {/* Payment Icons - Standardized size */}
            <div className="flex items-center space-x-2">
              <FaCcVisa className="text-blue-700" size={24} title="Visa" />
              <FaCcMastercard className="text-orange-600" size={24} title="Mastercard" />
              <FaCcPaypal className="text-blue-500" size={24} title="PayPal" />
              <FaCcAmex className="text-blue-900" size={24} title="American Express" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EcommerceFooter;