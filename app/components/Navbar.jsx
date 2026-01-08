'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Store,
  HelpCircle,
  ShoppingBag,
  ChevronDown,
  MessageCircle,
  LayoutGrid,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategoryStore } from '../stores/useCategoryStore';

// --- KEEPING YOUR ORIGINAL FUNCTIONS EXACTLY AS THEY WERE ---
const slugify = (text) => {
  if (!text) return "untitled";
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const getUserInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : 'U';
};

const getCleanImageUrl = (url) => {
  if (!url) return null;
  const lastHttpIndex = url.lastIndexOf('http');
  if (lastHttpIndex > 0) {
    return url.substring(lastHttpIndex);
  }
  return url;
};

// Modern Logo Component
const TechLogoIcon = () => (
  <div className="relative flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg sm:rounded-xl shadow-lg shadow-blue-200 shrink-0">
    <svg width="20" height="20" className="sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 8L3 12L7 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 8L21 12L17 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M14 4L10 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </div>
);

export default function Navbar() {
  const { user: authUser } = useAuthStore();
  const { user: userProfile, fetchUserById } = useUserStore();
  const { categories, fetchCategories } = useCategoryStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (authUser?.id) fetchUserById(authUser.id);
    fetchCategories();
    
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [authUser, fetchUserById, fetchCategories]);

  // Using your original logic for profile display
  const displayImageUrl = userProfile ? getCleanImageUrl(userProfile.profile_image_url) : null;
  const userInitial = userProfile ? getUserInitial(userProfile.username) : 'U';

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-2 sm:px-4 py-3 ${isScrolled ? 'mt-0' : 'mt-2'}`}>
      <header className={`mx-auto max-w-7xl transition-all duration-300 rounded-2xl border border-white/20 shadow-xl ${isScrolled ? 'bg-white/90 backdrop-blur-lg' : 'bg-white'}`}>
        
        <div className="flex items-center justify-between px-3 py-3 md:px-6 gap-2">
          
          {/* LOGO & BRAND NAME - Always visible on mobile */}
          <div className="flex items-center gap-2 lg:gap-8 shrink-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <TechLogoIcon />
              <span className="text-sm sm:text-xl font-black tracking-tighter bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent uppercase whitespace-nowrap">
                TECHNOCORE
              </span>
            </Link>

            {/* Desktop Navigation Link */}
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-gray-600 hover:text-blue-600">Home</Link>
              <Link href="/store" className="text-sm font-medium text-gray-600 hover:text-blue-600">Shop</Link>
              
              {/* Category Mega Menu */}
              <div className="relative group py-2">
                <button className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-blue-600 outline-none">
                  <LayoutGrid className="w-4 h-4" /> Categories <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute top-full left-0 w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 grid grid-cols-2 gap-4 translate-y-4 group-hover:translate-y-0 z-50">
                  {categories?.slice(0, 8).map(cat => (
                    <Link key={cat.id} href={`/category/${slugify(cat.name)}`} className="p-3 rounded-xl hover:bg-blue-50 transition-colors">
                      <p className="font-bold text-gray-900 text-sm">{cat.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          {/* Desktop Search (hidden on mobile to fit logo+icons) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500" />
            <input
              type="text"
              placeholder="Search gear..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            
            {/* Condition: Show only if Logged In */}
            {userProfile && (
              <div className="flex items-center gap-1 sm:gap-2">
                <IconButton icon={MessageCircle} href="/chat" className="hidden xs:flex" />
                <IconButton icon={Heart} href="/favorites" className="hidden xs:flex" />
                <IconButton icon={ShoppingCart} href="/shopping-cart" count={3} primary />
              </div>
            )}

            {userProfile ? (
              <Link href="/profile" className="flex items-center">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-transparent hover:ring-blue-500 transition-all overflow-hidden bg-blue-600 flex items-center justify-center text-white text-xs sm:text-sm">
                  {displayImageUrl ? (
                    <Image 
                        src={displayImageUrl} 
                        alt="Profile" 
                        fill 
                        className="object-cover" 
                        unoptimized={displayImageUrl.includes('googleusercontent')} 
                    />
                  ) : (
                    <span className="font-bold">{userInitial}</span>
                  )}
                </div>
              </Link>
            ) : (
              <Link href="/auth/login" className="px-3 py-1.5 sm:px-5 sm:py-2 text-[10px] sm:text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg sm:rounded-xl shadow-lg transition-all">
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMobileMenuOpen(true)} className="lg:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white z-[160] shadow-2xl p-6 flex flex-col" >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-black text-blue-600">MENU</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 overflow-y-auto">
                {/* Mobile Auth Links */}
                {userProfile && (
                  <div className="grid grid-cols-1 gap-2 mb-4">
                    <MobileMenuItem icon={MessageCircle} label="Messages" href="/chat" />
                    <MobileMenuItem icon={Heart} label="Favorites" href="/favorites" />
                    <MobileMenuItem icon={ShoppingCart} label="Cart" href="/shopping-cart" />
                    <hr className="border-gray-100 my-2" />
                  </div>
                )}

                <MobileMenuItem icon={ShoppingBag} label="Store" href="/store" />
                <MobileMenuItem icon={LayoutGrid} label="Categories" href="/categories" />
                
                <div className="grid grid-cols-2 gap-2 pt-4">
                  {categories?.slice(0, 6).map(cat => (
                    <Link key={cat.id} href={`/category/${slugify(cat.name)}`} onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-xs font-bold bg-gray-50 rounded-xl text-center">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              {!userProfile && (
                <div className="mt-auto pt-6">
                  <Link href="/auth/login" className="block w-full text-center py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-lg">
                    Get Started
                  </Link>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components
function IconButton({ icon: Icon, href, count, primary, className }) {
  return (
    <Link href={href} className={`relative p-2 rounded-lg sm:p-2.5 sm:rounded-xl transition-all ${primary ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'} ${className}`}>
      <Icon className="w-5 h-5" />
      {count > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-white bg-orange-500 text-white">{count}</span>}
    </Link>
  );
}

function MobileMenuItem({ icon: Icon, label, href }) {
  return (
    <Link href={href} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 group transition-all">
      <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white group-hover:text-blue-600 transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-bold text-gray-700">{label}</span>
    </Link>
  );
}