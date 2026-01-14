'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  X,
  ShoppingBag,
  ChevronDown,
  MessageCircle,
  LayoutGrid,
  User,
  LogOut,
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

export default function Navbar() {
  const { user: authUser } = useAuthStore();
  const { user: userProfile, fetchUserById } = useUserStore();
  const { categories, fetchCategories } = useCategoryStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = useAuthStore.getState().token;
    if (authUser?.id && token) {
      useUserStore.setState({ user: authUser });
      fetchUserById(authUser.id);
    }
    fetchCategories();
  
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [authUser, fetchUserById, fetchCategories]);
  
  const displayImageUrl = userProfile ? getCleanImageUrl(userProfile.profile_image_url) : null;
  const userInitial = userProfile ? getUserInitial(userProfile.name) : 'U';

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out px-2 sm:px-6 ${isScrolled ? 'py-2' : 'py-4'}`}>
      {/* REMOVED overflow-hidden from here to allow dropdowns to show */}
      <header className={`mx-auto max-w-7xl transition-all duration-300 rounded-[20px] sm:rounded-[24px] border border-white/40 shadow-2xl ${isScrolled ? 'bg-white/80 backdrop-blur-xl' : 'bg-white'}`}>
        
        <div className="flex items-center justify-between px-3 py-2.5 md:px-6 md:py-3 gap-2 sm:gap-4">
          
          {/* LEFT: BRAND NAME */}
          <div className="flex items-center gap-4 lg:gap-8 shrink-0">
            <Link href="/" className="flex items-center group">
              <span className="text-base sm:text-xl font-black tracking-tighter bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 bg-clip-text text-transparent uppercase whitespace-nowrap">
                TECHNOCORE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/store">Shop</NavLink>
              <NavLink href="/about-us">About Us</NavLink>
              
              {/* Category Mega Menu */}
              <div className="relative group px-3 py-2">
                <button className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors outline-none">
                  <LayoutGrid className="w-4 h-4" /> 
                  <span>Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                
                {/* Fixed position: ensure it's high z-index and sits correctly */}
                <div className="absolute top-full left-0 w-[450px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 grid grid-cols-2 gap-2 translate-y-4 group-hover:translate-y-2 z-[110]">
                  <div className="col-span-2 mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-500">Popular Categories</p>
                  </div>
                  {categories?.slice(0, 8).map(cat => (
                    <Link 
                      key={cat.id} 
                      href={`/category/${slugify(cat.name)}`} 
                      className="flex items-center p-3 rounded-2xl hover:bg-blue-50 group/item transition-all border border-transparent hover:border-blue-100"
                    >
                      <div className="w-2 h-2 rounded-full bg-blue-200 mr-3 group-hover/item:scale-125 group-hover/item:bg-blue-500 transition-all" />
                      <p className="font-bold text-gray-700 text-sm group-hover/item:text-blue-700">{cat.name}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>

          {/* CENTER: SEARCH */}
          <div className="hidden md:flex flex-1 max-w-md relative group">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search gear..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100/50 border border-transparent rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:bg-white focus:border-blue-200 transition-all outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* RIGHT: ACTIONS */}
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            {userProfile && (
              <div className="flex items-center gap-1 sm:gap-2 border-r border-gray-100 pr-1 sm:pr-4">
                <IconButton icon={MessageCircle} href="/chat" className="hidden xs:flex" />
                <IconButton icon={Heart} href="/favorites" className="hidden xs:flex" />
                <IconButton icon={ShoppingCart} href="/shopping-cart" count={3} primary />
              </div>
            )}

            {userProfile ? (
              <Link href="/profile" className="flex items-center shrink-0">
                <div className="relative w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl p-0.5 bg-gradient-to-tr from-blue-600 to-cyan-400">
                  <div className="relative w-full h-full rounded-[10px] sm:rounded-[14px] overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-white">
                    {displayImageUrl ? (
                      <Image 
                          src={displayImageUrl} 
                          alt="Profile" 
                          fill 
                          className="object-cover" 
                          unoptimized={displayImageUrl.includes('googleusercontent')} 
                      />
                    ) : (
                      <span className="font-black text-blue-700 text-[10px] sm:text-sm">{userInitial}</span>
                    )}
                  </div>
                </div>
              </Link>
            ) : (
              <Link href="/auth/login" className="px-4 py-2 sm:px-7 sm:py-3 text-[10px] sm:text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl sm:rounded-2xl shadow-lg transition-all active:scale-95">
                Login
              </Link>
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE SIDEBAR remains unchanged logic-wise */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-[150]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed inset-y-0 right-0 w-[85%] max-w-sm bg-white z-[160] shadow-2xl p-6 flex flex-col" >
              <div className="flex items-center justify-between mb-10">
                <span className="text-xl font-black text-blue-600 uppercase tracking-tighter">TECHNOCORE</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-xl transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex flex-col gap-2 overflow-y-auto">
                {userProfile && (
                  <div className="bg-blue-50/50 rounded-3xl p-4 mb-4">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-3 px-2">Account</p>
                    <MobileMenuItem icon={User} label="My Profile" href="/profile" />
                    <MobileMenuItem icon={MessageCircle} label="Messages" href="/chat" />
                    <MobileMenuItem icon={Heart} label="Favorites" href="/favorites" />
                    <MobileMenuItem icon={ShoppingCart} label="Cart" href="/shopping-cart" />
                  </div>
                )}
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-2">Navigation</p>
                <MobileMenuItem icon={ShoppingBag} label="Explore Store" href="/store" />
                <MobileMenuItem icon={LayoutGrid} label="All Categories" href="/categories" />
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categories?.slice(0, 6).map(cat => (
                    <Link key={cat.id} href={`/category/${slugify(cat.name)}`} onClick={() => setIsMobileMenuOpen(false)} className="p-4 text-xs font-bold bg-gray-50 rounded-2xl text-gray-600 text-center active:bg-blue-600 active:text-white transition-all">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-6">
                {!userProfile ? (
                  <Link href="/auth/login" className="block w-full text-center py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl">Get Started</Link>
                ) : (
                  <button className="flex items-center justify-center gap-2 w-full py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components
function NavLink({ href, children }) {
  return (
    <Link href={href} className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-blue-600 rounded-xl hover:bg-blue-50/50 transition-all">
      {children}
    </Link>
  );
}

function IconButton({ icon: Icon, href, count, primary, className }) {
  return (
    <Link href={href} className={`relative p-2 sm:p-2.5 rounded-xl sm:rounded-2xl transition-all duration-300 ${primary ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'} ${className}`}>
      <Icon className="w-5 h-5" />
      {count > 0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 sm:h-5 sm:w-5 items-center justify-center rounded-full text-[9px] sm:text-[10px] font-black ring-2 ring-white bg-orange-500 text-white shadow-sm">{count}</span>}
    </Link>
  );
}

function MobileMenuItem({ icon: Icon, label, href }) {
  return (
    <Link href={href} className="flex items-center gap-4 p-3.5 rounded-2xl hover:bg-white group transition-all border border-transparent hover:border-gray-100">
      <div className="p-2.5 bg-white rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
        <Icon className="w-5 h-5" />
      </div>
      <span className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors">{label}</span>
    </Link>
  );
}