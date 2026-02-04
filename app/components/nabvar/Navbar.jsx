'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useUserStore } from '../../stores/userStore';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { useBrandStore } from '../../stores/useBrandStore';
import { Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import NavLinks from './NavLinks';
import SearchBar from './SearchBar';
import UserActions from './UserActions';
import MobileSidebar from './MobileSidebar';

export default function Navbar() {
  const { user: authUser } = useAuthStore();
  const { user: userProfile, fetchUserById } = useUserStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { brands, fetchBrands } = useBrandStore();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const token = useAuthStore.getState().token;
    if (authUser?.id && token) {
      useUserStore.setState({ user: authUser });
      fetchUserById(authUser.id);
    }
    fetchCategories();
    fetchBrands();
  
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [authUser, fetchUserById, fetchCategories, fetchBrands]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out ${isScrolled ? 'py-3' : 'py-0'}`}>
      <header 
        className={`mx-auto transition-all duration-500 ease-in-out
          ${isScrolled 
            ? 'max-w-6xl rounded-full bg-white/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] border border-white/40 px-2' 
            : 'max-w-full bg-white border-b border-slate-100 px-0'
          }`}
      >
        <div className={`max-w-7xl mx-auto flex items-center justify-between transition-all duration-500 
          ${isScrolled ? 'h-14 px-4' : 'h-20 px-6'}`}
        >
          {/* BRAND */}
          <div className="flex items-center gap-10">
            <a href="/" className="group flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center rotate-3 group-hover:rotate-0 transition-transform duration-300">
                <span className="text-white font-black text-lg">T</span>
              </div>
              <span className="text-lg font-black tracking-tighter bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent uppercase">
                TECHNOCORE
              </span>
            </a>
            
            <NavLinks categories={categories} brands={brands} isScrolled={isScrolled} />
          </div>

          <SearchBar isScrolled={isScrolled} />

          <div className="flex items-center gap-3">
            <UserActions userProfile={userProfile} isScrolled={isScrolled} />
            
            <button 
              onClick={() => setIsMobileMenuOpen(true)} 
              className="lg:hidden p-2.5 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <MobileSidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        userProfile={userProfile}
        categories={categories}
        brands={brands}
      />
    </div>
  );
}