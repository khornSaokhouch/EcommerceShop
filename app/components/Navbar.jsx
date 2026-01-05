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
  Bell,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategoryStore } from '../stores/useCategoryStore';

// --- YOUR FUNCTIONS ---
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

const TechLogoIcon = () => (
  <div className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-blue-200">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  const [location, setLocation] = useState("Detecting...");

  useEffect(() => {
    if (authUser?.id) fetchUserById(authUser.id);
    fetchCategories();
    
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [authUser, fetchUserById, fetchCategories]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}`);
          const data = await res.json();
          setLocation(data.address.city || data.address.town || "Unknown");
        } catch { setLocation("Location Error"); }
      });
    }
  }, []);

  const displayImageUrl = userProfile ? getCleanImageUrl(userProfile.profile_image_url) : null;
  const userInitial = userProfile ? getUserInitial(userProfile.username) : 'U';

  const NavLink = ({ href, children, icon: Icon }) => (
    <Link href={href} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-all duration-200 group">
      {Icon && <Icon className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />}
      {children}
    </Link>
  );

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 px-4 py-3 ${isScrolled ? 'mt-0' : 'mt-2'}`}>
      {/* FIXED: Removed overflow-hidden from header to allow dropdown to be visible */}
      <header className={`mx-auto max-w-7xl transition-all duration-300 rounded-2xl border border-white/20 shadow-xl ${isScrolled ? 'bg-white/90 backdrop-blur-lg shadow-blue-900/5' : 'bg-white'}`}>
        
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <TechLogoIcon />
              <span className="hidden lg:block text-xl font-black tracking-tighter bg-gradient-to-r from-blue-700 to-cyan-500 bg-clip-text text-transparent uppercase">
                TECHNOCORE
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/products" icon={ShoppingBag}>Shop</NavLink>
              
              {/* --- CATEGORY DROPDOWN --- */}
              <div className="relative group py-2">
                <button className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-blue-600 outline-none">
                  <LayoutGrid className="w-4 h-4" /> 
                  Categories 
                  <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                
                {/* Mega Menu Dropdown Box */}
                <div className="absolute top-[100%] left-0 w-[480px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 grid grid-cols-2 gap-4 translate-y-4 group-hover:translate-y-0 z-[110]">
                  {categories && categories.length > 0 ? (
                    categories.slice(0, 8).map(cat => (
                      <Link 
                        key={cat.id} 
                        href={`/category/${slugify(cat.name)}`} 
                        className="p-3 rounded-xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 group/item"
                      >
                        <p className="font-bold text-gray-900 text-sm group-hover/item:text-blue-600">{cat.name}</p>
                        <p className="text-[11px] text-gray-500">View all products in {cat.name}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="col-span-2 text-sm text-gray-400 p-4 text-center">Loading categories...</p>
                  )}
                  <Link href="/categories" className="col-span-2 text-center py-2 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100">
                    View All Categories
                  </Link>
                </div>
              </div>
            </nav>
          </div>

          <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-2 bg-gray-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all duration-200"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-1 md:gap-2">
              <IconButton icon={MessageCircle} href="/chat" />
              <IconButton icon={Heart} href="/favorites" />
              <IconButton icon={ShoppingCart} href="/shopping-cart" count={3} primary />
            </div>

            <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />

            {userProfile ? (
              <Link href="/profile" className="flex items-center gap-2 group">
                <div className="relative w-9 h-9 rounded-full ring-2 ring-transparent group-hover:ring-blue-500 transition-all overflow-hidden bg-blue-500 flex items-center justify-center text-white">
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
              <Link href="/auth/login" className="px-5 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg">
                Login
              </Link>
            )}

            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[150]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25 }} className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[160] shadow-2xl p-6 overflow-y-auto" >
              <div className="flex items-center justify-between mb-8">
                <span className="text-xl font-black text-blue-600">MENU</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-6">
                <MobileMenuItem icon={ShoppingBag} label="All Products" href="/products" />
                <MobileMenuItem icon={Store} label="Become a Seller" href="/become-to-seller" />
                
                <hr className="border-gray-100" />
                
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {categories?.map(cat => (
                    <Link key={cat.id} href={`/category/${slugify(cat.name)}`} onClick={() => setIsMobileMenuOpen(false)} className="p-3 text-xs font-bold bg-gray-50 rounded-xl text-gray-700">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function IconButton({ icon: Icon, href, count, primary, className }) {
  const content = (
    <div className={`relative p-2.5 rounded-xl transition-all duration-200 ${primary ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'} ${className}`}>
      <Icon className="w-5 h-5" />
      {count > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ring-2 ring-white bg-orange-500 text-white">{count}</span>}
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : <button>{content}</button>;
}

function MobileMenuItem({ icon: Icon, label, href }) {
  return (
    <Link href={href} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 transition-all border border-transparent hover:border-blue-50">
      <div className="p-2 bg-gray-50 rounded-lg"><Icon className="w-5 h-5" /></div>
      <span className="font-bold text-gray-700">{label}</span>
    </Link>
  );
}