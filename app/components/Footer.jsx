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
        <stop stopColor="#F472B6" />
        <stop offset="1" stopColor="#A78BFA" />
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
<footer
  className="bg-center bg-no-repeat text-gray-800 font-sans px-10"
  style={{
    // backgroundImage: "url('/footer.png')", 
    backgroundSize: "1350px 400px", // width height
  }}
>

  
      {/* Section 2: Main Footer Links */}
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Column 1: Brand & Social */}
          <div>
            <Link href="/" className="flex items-center gap-1">
              <TechLogoIcon className="h-6 w-6" />
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text whitespace-nowrap">
                TECHNESS
              </span>
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              Your one-stop shop for the latest and greatest in tech.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-blue-600 hover:text-blue-700 transition-colors"><FaFacebookF size={20} /></Link>
              <Link href="#" className="text-blue-400 hover:text-blue-500 transition-colors"><FaTwitter size={20} /></Link>
              <Link href="#" className="text-pink-500 hover:text-pink-600 transition-colors"><FaInstagram size={20} /></Link>
              <Link href="#" className="text-blue-800 hover:text-blue-900 transition-colors"><FaLinkedinIn size={20} /></Link>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h4 className="font-semibold text-gray-800 uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">New Arrivals</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Best Sellers</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Laptops</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Smartphones</Link></li>
              <li><Link href="#" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Accessories</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-semibold text-gray-800 uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/contact-us" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">FAQ</Link></li>
              {/* <li><Link href="/shipping-returns" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Shipping & Returns</Link></li> */}
              <li><Link href="/partners" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Our Partners</Link></li>
            </ul>
          </div>

          {/* Column 4: About Us */}
          <div>
            <h4 className="font-semibold text-gray-800 uppercase tracking-wider mb-4">About Us</h4>
            <ul className="space-y-2">
              <li><Link href="/our-story" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Our Story</Link></li>
              {/* <li><Link href="/careers" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Careers</Link></li> */}
              <li><Link href="/terms-of-service" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/privacy-policy" className="text-gray-600 hover:text-blue-600 transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Section 3: Bottom Bar with Copyright and Payment Icons */}
      <div className="bg-white/70 py-6 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-sm gap-4">
          <p className="text-gray-500 text-center sm:text-left">
            © {new Date().getFullYear()} TECHNESS. All Rights Reserved.
          </p>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 border border-gray-300 rounded-md p-1 bg-white/80">
              <FaLock className="text-green-500" />
              <span className="text-gray-600 text-xs font-semibold">SSL SECURED</span>
            </div>
            <div className="flex items-center space-x-2">
                <FaCcVisa className="text-blue-600" size={28} />
                <FaCcMastercard className="text-red-600" size={28} />
                <FaCcPaypal className="text-yellow-500" size={28} />
                <FaCcAmex className="text-blue-900" size={28} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EcommerceFooter;
