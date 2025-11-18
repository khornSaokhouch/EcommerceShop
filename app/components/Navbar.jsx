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
  MessageCircle ,
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


const slugify = (text) => {
  if (!text) return "untitled";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};


// --- UPDATED Category Dropdown Component for Desktop (Cleaner look) ---
const CategoryDropdown = ({ categories }) => {
  return (
    <div className="relative group">
      {/* The main trigger (header) */}
      <div 
        className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-300 font-semibold cursor-default bg-gray-100 p-2 rounded-lg"
      >
        <ListOrdered className="h-5 w-5 mr-2 text-blue-500" />
        <span className="whitespace-nowrap">Shop Categories</span>
        <ChevronDown className="h-3 w-3 ml-2 transition-transform duration-200 group-hover:rotate-180" />
      </div>
      
      {/* Dropdown Content */}
      <div 
        className="absolute z-30 left-0 -mt-1 w-64 p-3 bg-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-300 ease-in-out transform origin-top-left border border-gray-100"
      >
        <div className="pt-2 pb-1">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <Link
                key={category.name}
                href={`/category/${slugify(category?.name)}`} 
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
          <hr className="my-2 border-gray-100" />
          <Link
            href="/products"
            className="flex items-center px-4 py-2 text-sm font-bold text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
          >
            View All
          </Link>
        </div>
      </div>
    </div>
  );
};
// -----------------------------------------------------------------


export default function Navbar() {
  const router = useRouter();
  const { user: authUser } = useAuthStore();
  const { user: userProfile, fetchUserById } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState("Fetching location...");
  // Use the Category Store
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    if (authUser?.id) {
      fetchUserById(authUser.id);
    }
    fetchCategories(); 
  }, [authUser, fetchUserById, fetchCategories]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Optional: Convert lat/lng to human-readable address using a reverse geocoding API
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          setLocation(data.address.city || data.address.town || data.display_name);
        },
        (error) => {
          console.error(error);
          setLocation("Location permission denied");
        }
      );
    } else {
      setLocation("Geolocation not supported");
    }
  }, []);

  // Helper functions (kept the same)
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

  const displayImageUrl = userProfile ? getCleanImageUrl(userProfile.profile_image_url) : null;
  const userInitial = userProfile ? getUserInitial(userProfile.username) : 'U';

  const primaryNavItems = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about-us' },
    { label: 'Contact Us', href: '/contact-us' },
  ];

  const secondaryUtilityItems = [
    { label: 'Products', href: '/products', icon: ShoppingBag },
    { label: 'FAQ', href: '/faq', icon: HelpCircle },
    {
      label: 'Become A Seller', // Corrected typo in label
      href: authUser?.id ? `/become-to-seller` : '/auth/login',
      icon: StoreIcon,
    },
  ];

  return (
    // Outer wrapper for max-width and background
    <div className="w-full bg-gray-50 p-2 font-sans">
      {/* Header Container: Two Rows on Desktop */}
      <header className="bg-white w-full max-w-screen-2xl mx-auto rounded-xl shadow-2xl transition-all duration-300">
        
        {/* ROW 1: Logo, Search, & User Actions (Primary) */}
        <div className="flex items-center justify-between h-20 px-4 sm:px-6 lg:px-8">
          
          {/* Logo & Primary Nav Links */}
          <div className="flex items-center space-x-6">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-600 hover:text-blue-600 focus:outline-none transition-colors duration-300 p-2 rounded-full hover:bg-gray-100"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <TechLogoIcon className="h-8 w-8" />
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-500 to-blue-500 text-transparent bg-clip-text whitespace-nowrap">
                E-COMMERCES
              </span>
            </Link>

            {/* Primary Nav Items (Desktop - Shifted emphasis to a cleaner look) */}
            <div className="hidden lg:flex items-center gap-8">
              {primaryNavItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium relative group"
                >
                  {item.label}
                  {/* Subtle hover underline effect */}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar (Desktop/Tablet - Modern, rounded design) */}
          <div className="relative hidden md:flex flex-grow max-w-xl mx-8">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products, brands, and more..."
              className="w-full h-12 py-2 pl-5 pr-12 text-gray-800 bg-gray-100 border-2 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-500 shadow-inner text-sm"
              autoComplete="off"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-blue-600 transition"
              onClick={() => {
                /* Handle Search Submission */
              }}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile/Actions (Right Side - Cleaner, more prominent icons) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {userProfile ? (
              <>
                {/* ICONS (Favorites & Cart) - Now slightly larger and cleaner */}
                <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                    href={`/chat`}
                    title="Favorites"
                    className="flex items-center justify-center w-10 h-10 p-2 rounded-full text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors duration-300 relative"
                  >
                    <MessageCircle  className="h-6 w-6" />
                  </Link>
                  <Link
                    href={`/favorites`}
                    title="Favorites"
                    className="flex items-center justify-center w-10 h-10 p-2 rounded-full text-gray-600 hover:text-red-500 hover:bg-red-50 transition-colors duration-300 relative"
                  >
                    <Heart className="h-6 w-6" />
                  </Link>
                  <Link
                    href={`/shopping-cart`}
                    title="Cart"
                    className="flex items-center justify-center w-10 h-10 p-2 rounded-full text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-300 relative"
                  >
                    <ShoppingCart className="h-6 w-6" />
                  </Link>
                </div>

                {/* Profile Image/Initial */}
                <Link
                  href={`/profile`}
                  className="block group ml-2" 
                >
                  <div className="w-10 h-10 relative rounded-full overflow-hidden ring-2 ring-blue-400 group-hover:ring-blue-600 transition-all duration-200 flex items-center justify-center bg-blue-500 text-white font-semibold text-lg">
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
              // Login/Register Buttons (Desktop - Kept original button structure)
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 hover:border-blue-400 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-md transition-colors duration-300 whitespace-nowrap"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ROW 2: Location and Secondary Navigation (Desktop Only) */}
        <div className="hidden md:flex items-center justify-between h-14 px-4 sm:px-6 lg:px-8 bg-gray-50 border-t border-gray-100 rounded-b-xl">
          
          {/* Secondary Nav Items */}
          <div className="flex items-center space-x-8 text-sm">
            
            {/* 1. CATEGORY DROPDOWN (Hover Trigger Only) - Uses new clean component */}
            <CategoryDropdown categories={categories} />

            {/* 2. OTHER UTILITY LINKS */}
            {secondaryUtilityItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-300 font-medium group relative"
                >
                  <Icon className="h-4 w-4 mr-1.5" />
                  <span className="whitespace-nowrap">{item.label}</span>
                  {/* Subtle underline for secondary links */}
                  <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></span>
                </Link>
              );
            })}
          </div>
          
          {/* Location/Delivery Information (Visual emphasis added) */}
          <div className="flex items-center text-sm font-medium text-gray-700 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
            <MapPin className="h-5 w-5 mr-1.5 text-red-500" />
            Deliver to: 
            <span className="font-semibold text-blue-600 ml-1.5 cursor-pointer hover:underline">
              {location}
            </span>
          </div>
        </div>
        
        {/* Mobile Menu (Animate Presence) - Retains original structure and links */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden p-4 border-t border-gray-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              
              {/* Mobile Search Bar (Cleaner look) */}
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
              <nav className="flex flex-col items-start gap-1 text-gray-700">
                
                {/* USER ACTION LINKS (Favorites & Cart) - Now visible in the mobile menu */}
                {userProfile && (
                    <>
                        <Link
                            href={`/profile/${authUser?.id}/favorites`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full flex items-center py-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 border-b border-gray-100"
                        >
                            <Heart className="h-5 w-5 mr-3 text-red-500" />
                            My Favorites
                        </Link>
                        <Link
                            href={`/user/${authUser?.id}/shopping-cart`}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full flex items-center py-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 border-b border-gray-100"
                        >
                            <ShoppingCart className="h-5 w-5 mr-3 text-blue-500" />
                            Shopping Cart
                        </Link>
                    </>
                )}


                {/* Primary Nav */}
                {primaryNavItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center py-2 hover:text-blue-600 transition-colors duration-300 font-semibold border-b border-gray-100"
                  >
                    <span className="w-5 h-5 mr-3"></span> {/* Placeholder for alignment */}
                    {item.label}
                  </Link>
                ))}

                <hr className='w-full border-gray-200 my-1' />
                
                {/* CATEGORIES SECTION (Mobile) */}
                <div className="w-full mt-2">
                    <h4 className="text-sm font-bold text-gray-800 mb-2 px-1">Categories</h4>
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
                        className="w-full flex items-center py-2 text-blue-600 font-bold transition-colors duration-300 mt-2 border-t border-gray-100"
                    >
                        <ListOrdered className="h-5 w-5 mr-3 text-blue-500" />
                        View All Categories
                    </Link>
                </div>

                <hr className='w-full border-gray-200 my-1' />

                {/* Secondary Utility Nav */}
                {secondaryUtilityItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full flex items-center py-2 text-gray-600 hover:text-blue-600 transition-colors duration-300 border-b border-gray-100"
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