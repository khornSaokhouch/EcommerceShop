'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import Link from 'next/link';
import { User, Mail, Lock, Phone, Loader2, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'; // For subtle animations

// Logo Icon with a clean, consistent gradient
const TechLogoIcon = (props) => (
  <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="registerLogoGradient" x1="12" y1="20" x2="28" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#0EA5E9" /> {/* Sky Blue 500 */}
        <stop offset="1" stopColor="#3B82F6" /> {/* Blue 500 */}
      </linearGradient>
    </defs>
    <path d="M12 10H28" stroke="url(#registerLogoGradient)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M20 10V30" stroke="url(#registerLogoGradient)" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M16 30C16 27.7909 17.7909 26 20 26C22.2091 26 24 27.7909 24 30" stroke="url(#registerLogoGradient)" strokeWidth="3.5" strokeLinecap="round" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long.');
      return;
    }
  
    try {
      await register({
        name,
        email,
        phone_number: phoneNumber,
        password,
        password_confirmation: confirmPassword,
      });
  
      toast.success('Registration successful! Redirecting to login...');
      
      setTimeout(() => {
        router.push('/auth/login');
      }, 500);
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    }
  };
  
  // Animation variants for the card
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 font-sans text-gray-800 overflow-hidden"> {/* New background gradient */}
      <motion.div 
        className="w-full max-w-sm p-7 bg-white rounded-2xl shadow-2xl space-y-5 relative z-10" // Smaller max-w, less padding, stronger shadow, no border
        initial="hidden"
        animate="visible"
        variants={cardVariants}
      >
        
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center justify-center gap-2 mb-2"> {/* Centered logo */}
            <TechLogoIcon className="h-9 w-9" />
            <span className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-sky-500 to-blue-600 text-transparent bg-clip-text">
              E-COMMERCES
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">Create your account</h2> {/* Larger, bolder title */}
          <p className="text-gray-500 text-sm mt-1">Join us to explore amazing products.</p> {/* More concise subtitle */}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4"> {/* Reduced space between form elements */}

          {/* Full Name */}
          <div>
            <label htmlFor="name" className="sr-only">Full Name</label> {/* Screen reader only label */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /> {/* Smaller icon */}
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name" // Placeholder as label
                className="w-full py-2.5 pl-9 pr-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 text-sm bg-gray-50" // Compact, lighter border, bg-gray-50
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /> {/* Smaller icon */}
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className="w-full py-2.5 pl-9 pr-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 text-sm bg-gray-50" // Compact, lighter border, bg-gray-50
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone_number" className="sr-only">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /> {/* Smaller icon */}
              <input
                id="phone_number"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
                className="w-full py-2.5 pl-9 pr-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 text-sm bg-gray-50" // Compact, lighter border, bg-gray-50
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /> {/* Smaller icon */}
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min. 8 characters)"
                className="w-full py-2.5 pl-9 pr-9 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 text-sm bg-gray-50" // Compact, lighter border, bg-gray-50
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {/* Smaller icon */}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /> {/* Smaller icon */}
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full py-2.5 pl-9 pr-9 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 text-sm bg-gray-50" // Compact, lighter border, bg-gray-50
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 text-sm cursor-pointer"
                disabled={loading}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />} {/* Smaller icon */}
              </button>
            </div>
          </div>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white py-2.5 rounded-lg hover:opacity-90 disabled:opacity-50 transition font-semibold text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mt-5" // Slightly reduced padding, text-base, gap-2 for icon
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : null} {/* Smaller loader */}
            {loading ? 'Creating Account...' : 'Create Account'}
          </motion.button>
        </form>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{' '}
          <Link href="/auth/login" className="font-medium text-blue-600 hover:text-blue-800 transition">
            Log in here
          </Link>
        </p>
      </motion.div>

      {/* Optional: Add some subtle background elements for visual interest without causing scroll */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
    </div>
  );
}