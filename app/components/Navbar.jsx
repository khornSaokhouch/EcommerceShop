'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Search,
  MapPin,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Store as StoreIcon,
  HelpCircle,
  ShoppingBag,
  ListOrdered,
  Truck,
  ChevronDown,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategoryStore } from '../stores/useCategoryStore';

// Reusable SVG icon for the logo (Blue/Cyan Gradient)
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
        <stop stopColor="#06B6D4" /> 
        <stop offset="1" stopColor="#3B82F6" />
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

// --- UPDATED Category Dropdown Component for Desktop ---
const CategoryDropdown = ({ categories }) => {
  return (
    <div className="relative group">
      {/* The main trigger (header) */}
      <div 
        className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium cursor-default"
      >
        <ListOrdered className="h-4 w-4 mr-1" />
        <span className="whitespace-nowrap">All Categories</span>
        <ChevronDown className="h-3 w-3 ml-1 transition-transform duration-200 group-hover:rotate-180" />
      </div>
      
      {/* Dropdown Content - FIX APPLIED HERE: -mt-1 and increased pt-2 */}
      <div 
        className="absolute z-30 left-0 -mt-1 w-64 p-2 bg-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 ease-in-out transform origin-top-left border border-gray-100"
      >
        <div className="pt-2 pb-1"> {/* Increased top padding to pt-2 to create a larger safe hover zone */}
            {categories && categories.length > 0 ? (
                categories.map((category) => (
                    <Link
                        key={category.id}
                        href={`/category/${category.id}`} 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                    >
                        {category.name}
                    </Link>
                ))
            ) : (
                <div className="px-4 py-2 text-sm text-gray-500">
                    No categories found.
                </div>
            )}
            <hr className="my-1 border-gray-100" />
            <Link
                href="/categories"
                className="flex items-center px-4 py-2 text-sm font-semibold text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
            >
                View All Categories
            </Link>
        </div>
      </div>
    </div>
  );
};
// -----------------------------------------------------------------


export default function Navbar() {
  const { id } = useParams();
  const router = useRouter();
  const { user: authUser } = useAuthStore();
  const { user: userProfile, fetchUserById } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState('Phnom Penh, Cambodia');
  // Use the Category Store
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    if (authUser?.id) {
      fetchUserById(authUser.id);
    }
    fetchCategories(); 
  }, [authUser, fetchUserById, fetchCategories]);

  // Helper to get the first letter of the user's name
  const getUserInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U'; // 'U' for Unknown
  };

  const getCleanImageUrl = (url) => {
    if (!url) {
      return null; // Return null if no URL, indicating we need a placeholder
    }
    const lastHttpIndex = url.lastIndexOf('http');
    if (lastHttpIndex > 0) {
      return url.substring(lastHttpIndex);
    }
    return url;
  };

  // Determine whether to show an image or an initial
  const displayImageUrl = userProfile ? getCleanImageUrl(userProfile.profile_image_url) : null;
  const userInitial = userProfile ? getUserInitial(userProfile.username) : 'U';


  const primaryNavItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Contact Us', href: '/contact-us' },
  ];

  // Secondary nav items that are NOT the category dropdown
  const secondaryUtilityItems = [
    { label: 'Products', href: '/products', icon: ShoppingBag },
    { label: 'Orders', href: '/orders', icon: ListOrdered },
    { label: 'FAQ', href: '/faq', icon: HelpCircle },
    {
      label: 'Become To Seller ',
      href: authUser?.id ? `/become-to-seller` : '/auth/login',
      icon: StoreIcon,
    },
  ];

  return (
    // Outer wrapper for max-width and background
    <div className="w-full bg-gray-50 p-2 font-sans">
      {/* Header Container: Two Rows on Desktop, One Row on Mobile */}
      <header className="bg-white w-full max-w-screen-2xl mx-auto rounded-xl shadow-lg">
        
        {/* ROW 1: Logo, Search, & User Actions (Primary) */}
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          
          {/* Logo & Primary Nav Links */}
          <div className="flex items-center space-x-8">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none transition-colors duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <TechLogoIcon className="h-7 w-7" />
              <span className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text whitespace-nowrap">
                E-COMMERCES
              </span>
            </Link>

            {/* Primary Nav Items (Desktop) */}
            <div className="hidden lg:flex items-center gap-6">
              {primaryNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar (Desktop/Tablet) */}
          <div className="relative hidden md:flex flex-grow max-w-xl mx-8">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, brands, and more..."
              className="w-full h-10 py-2 pl-4 pr-12 text-gray-800 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-500"
              autoComplete="off"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-blue-600 transition"
              onClick={() => {
                /* Handle Search Submission */
              }}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile/Actions (Right Side) */}
          <div className="flex items-center space-x-3">
            {userProfile ? (
              <>
                {/* ICONS (Favorites & Cart) - Hidden on mobile, visible on sm+ */}
                <div className="hidden sm:flex items-center space-x-4">
                  <Link
                    href={`/profile/${authUser?.id}/favorites`}
                    title="Favorites"
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-blue-50 transition-colors duration-300 relative"
                  >
                    <Heart className="h-5 w-5 text-gray-600 hover:text-blue-600" />
                  </Link>
                  <Link
                    href={`/user/${authUser?.id}/shopping-cart`}
                    title="Cart"
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full hover:bg-blue-50 transition-colors duration-300 relative"
                  >
                    <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-blue-600" />
                  </Link>
                </div>

                {/* Profile Image/Initial - Visible on ALL screens */}
                <Link
                  href={`/profile`}
                  className="block group" 
                >
                  <div className="w-8 h-8 sm:w-10 sm:h-10 relative rounded-full overflow-hidden ring-2 ring-blue-400 group-hover:ring-blue-600 transition-all duration-200 flex items-center justify-center bg-blue-500 text-white font-semibold text-lg">
                    {displayImageUrl ? (
                        <Image
                            src={displayImageUrl}
                            alt="User Profile"
                            fill
                            sizes="40px"
                            className="object-cover"
                            key={displayImageUrl}
                        />
                    ) : (
                        <span>{userInitial}</span>
                    )}
                  </div>
                </Link>
              </>
            ) : (
              // Login/Register Buttons
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300 whitespace-nowrap"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ROW 2: Location and Secondary Navigation (Desktop Only) */}
        <div className="hidden md:flex items-center justify-between h-12 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          
          {/* Location / Delivery Info */}
          <div 
            className="flex items-center text-sm font-medium text-gray-700 group cursor-pointer hover:text-blue-600 transition-colors duration-300"
          >
            <Truck className="h-5 w-5 mr-1 text-blue-500" />
            <span className="hidden lg:inline mr-1">Deliver to:</span>
            <MapPin className="h-4 w-4 mr-1 text-cyan-500" />
            <span className="underline decoration-dashed decoration-gray-400 group-hover:decoration-blue-600 whitespace-nowrap">
              {location}
            </span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </div>

          {/* Secondary Nav Items */}
          <div className="flex items-center space-x-6 text-sm">
            
            {/* 1. CATEGORY DROPDOWN (Hover Trigger Only) */}
            <CategoryDropdown categories={categories} />

            {/* 2. OTHER UTILITY LINKS */}
            {secondaryUtilityItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium"
                >
                  <Icon className="h-4 w-4 mr-1" />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Empty space/extra info alignment */}
          <div className="hidden lg:block w-64 text-xs text-gray-400">
            {/* Optional: Placeholder for current deals or contact info */}
          </div>
        </div>
        
        {/* Mobile Menu (Animate Presence) */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden p-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* Mobile Search Bar */}
              <div className="relative mb-4">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products..."
                  className="w-full h-10 py-2 pl-3 pr-10 text-gray-800 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  autoComplete="off"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                >
                  <Search className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex flex-col items-start gap-4 text-gray-700">
                
                {/* Location/Delivery Status */}
                <div className="flex items-center text-sm font-medium text-blue-600">
                  <Truck className="h-4 w-4 mr-2" />
                  Deliver to: <span className="ml-1 font-semibold">{location}</span>
                </div>
                
                <hr className='w-full border-gray-100 my-1' />

                {/* USER ACTION LINKS (Favorites & Cart) - Now visible in the mobile menu */}
                {userProfile && (
                    <>
                        <Link
                            href={`/profile/${authUser?.id}/favorites`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full flex items-center py-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
                        >
                            <Heart className="h-5 w-5 mr-3 text-blue-500" />
                            My Favorites
                        </Link>
                        <Link
                            href={`/user/${authUser?.id}/shopping-cart`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full flex items-center py-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
                        >
                            <ShoppingCart className="h-5 w-5 mr-3 text-blue-500" />
                            Shopping Cart
                        </Link>
                        <hr className='w-full border-gray-100 my-1' />
                    </>
                )}


                {/* Primary Nav */}
                {primaryNavItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-2 hover:text-blue-600 transition-colors duration-300 font-semibold"
                  >
                    {item.label}
                  </Link>
                ))}

                <hr className='w-full border-gray-100 my-1' />
                
                {/* CATEGORIES SECTION (Mobile) */}
                <div className="w-full">
                    <h4 className="text-sm font-bold text-gray-800 mb-2">Categories</h4>
                    {categories && categories.length > 0 ? (
                        categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/products/category/${category.id}`} 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="w-full flex items-center py-2 pl-3 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-300"
                            >
                                {category.name}
                            </Link>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 pl-3">No categories available.</p>
                    )}
                    <Link
                        href="/categories"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="w-full flex items-center py-2 text-blue-600 font-semibold transition-colors duration-300"
                    >
                        <ListOrdered className="h-5 w-5 mr-3 text-blue-500" />
                        View All Categories
                    </Link>
                </div>

                <hr className='w-full border-gray-100 my-1' />

                {/* Secondary Utility Nav */}
                {secondaryUtilityItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center py-2 text-gray-600 hover:text-blue-600 transition-colors duration-300"
                    >
                      <Icon className="h-5 w-5 mr-3 text-blue-500" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              
              {/* Mobile Login/Register Buttons (If not authenticated) */}
              {!userProfile && (
                <div className="flex items-center gap-3 mt-6">
                    <Link
                        href="/auth/login"
                        className="flex-1 text-center py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors duration-300"
                    >
                        Login
                    </Link>
                    <Link
                        href="/auth/register"
                        className="flex-1 text-center py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                    >
                        Register
                    </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}