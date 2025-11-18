// components/NotFound.jsx
"use client";

import { Frown, Home, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  const router = useRouter();

  // Framer Motion variants for subtle animation
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      transition: { 
        staggerChildren: 0.1, 
        duration: 0.5 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen text-center p-6" // Softer gradient background
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div 
        className="mb-6"
        variants={itemVariants}
      >
        {/* Large, striking 404 code with enhanced colors */}
        <p className="text-9xl font-extrabold tracking-widest relative text-indigo-700"> {/* Primary color for 404 */}
          404
          <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-red-500 opacity-70 blur-sm [text-shadow:0_0_20px_rgba(100,0,255,0.4)]"> {/* Glowing gradient overlay */}
            404
          </span>
          <span className="absolute inset-0 text-white text-opacity-20 text-shadow-lg [text-shadow:0_0_10px_rgba(255,255,255,0.8)]">404</span> {/* Original white highlight */}
        </p>
        <Frown className="w-14 h-14 mx-auto mt-4 text-purple-600 animate-bounce-slow" /> {/* Slightly larger, matching color, subtle animation */}
      </motion.div>

      <motion.h1 
        className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4"
        variants={itemVariants}
      >
        Page Not Found
      </motion.h1>

      <motion.p 
        className="text-lg text-gray-600 mb-8 max-w-md"
        variants={itemVariants}
      >
        Oops! It looks like you have wandered into uncharted territory. We can not find the page you are looking for.
      </motion.p>
      
      {/* Action Buttons */}
      <motion.div 
        className="flex space-x-4"
        variants={itemVariants}
      >
        <Link href="/" passHref>
          <motion.button
            className="flex items-center px-7 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition duration-300 transform hover:-translate-y-0.5" // Enhanced button styles
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Homepage
          </motion.button>
        </Link>
        
        <motion.button
          onClick={() => router.back()}
          className="flex items-center px-7 py-3 border border-purple-300 text-purple-700 font-semibold rounded-lg shadow-lg bg-white hover:bg-purple-50 transition duration-300 transform hover:-translate-y-0.5" // Matching secondary color
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Search className="w-5 h-5 mr-2" />
          Go Back
        </motion.button>
      </motion.div>

      {/* Suggested Links Section */}
      <motion.div 
        className="mt-12 pt-6 border-t border-gray-200 max-w-xl w-full"
        variants={itemVariants}
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-4">
          Or, explore these popular destinations:
        </h3>
        <div className="flex justify-center space-x-6 text-purple-600 font-medium"> {/* Cohesive link color */}
          <Link href="/products" className="hover:text-purple-800 transition-colors">
            Our Products
          </Link>
          <Link href="/categories" className="hover:text-purple-800 transition-colors">
            All Categories
          </Link>
          <Link href="/contact" className="hover:text-purple-800 transition-colors">
            Get in Touch
          </Link>
        </div>
      </motion.div>

      {/* Tailwind CSS for Custom Animation */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </motion.div>
  );
};

export default NotFoundPage;