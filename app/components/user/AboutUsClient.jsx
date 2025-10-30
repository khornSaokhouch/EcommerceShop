"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebookF, FaLinkedinIn, FaGithub, FaRocket, FaShieldAlt, FaUsers } from 'react-icons/fa'; // Added new icons

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Faster stagger for a snappier feel
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 }, // Slightly less vertical movement
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const teamMembers = [
  {
    name: "Khorn Saokhouch",
    title: "CEO & Founder",
    image: "/me.png",
    description: "Passionate about innovation, creating seamless e-commerce experiences, and driving our platform's vision forward.",
    social: {
      facebook: "https://www.facebook.com/khorn.saokhouch.2025",
      linkedin: "https://www.linkedin.com/in/khorn-saokhouch-702026326",
      github: "https://github.com/khornSaokhouch",
    },
  },
];

const features = [
  {
    icon: FaRocket,
    title: "Blazing Fast Performance",
    description: "Leverage cutting-edge architecture for lightning-fast load times and a frictionless user experience.",
  },
  {
    icon: FaShieldAlt,
    title: "Advanced Security",
    description: "Your data and transactions are protected by industry-leading encryption and robust security protocols.",
  },
  {
    icon: FaUsers,
    title: "Intuitive Interface",
    description: "A user-first design ensures easy navigation and management for both sellers and buyers.",
  },
];


const AboutUsClient = () => {
  return (
    <motion.main
      className="min-h-screen" // Changed background to a very light gray
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >

      {/* Hero Section */}
      <motion.section
        className="relative bg-white pt-24 pb-16 shadow-lg overflow-hidden" // Added shadow and padding
        variants={itemVariants}
      >
        {/* Background Subtle Shape/Blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>

        <div className="max-w-6xl mx-auto px-6 md:px-12 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-4 tracking-tight">
            Our Story: Building the <span className="text-indigo-600">Future of E-Commerce</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Welcome to <span className="font-semibold text-indigo-700">E-Commerces</span>, 
            a platform born from the belief that online selling should be simple, powerful, and accessible to everyone.
          </p>
        </div>
      </motion.section>

      {/* Mission & Values (Split Layout) */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <motion.section
            className="p-8 bg-white rounded-xl shadow-lg border-t-4 border-indigo-600"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-indigo-600 mr-3">
                <FaRocket size={28} />
              </span>
              Our Core Mission
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              To empower businesses of all sizes with **seamless, secure, and scalable** tools they need to thrive and
              succeed in today’s dynamic digital marketplace. We focus on innovation so you can focus on growth.
            </p>
          </motion.section>

          <motion.section
            className="p-8 bg-white rounded-xl shadow-lg border-t-4 border-pink-500"
            variants={itemVariants}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="text-pink-500 mr-3">
                <FaUsers size={28} />
              </span>
              Our Guiding Values
            </h2>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed text-lg space-y-2">
              <li>**Innovation:** Always seeking better solutions.</li>
              <li>**Integrity:** Building trust with transparency.</li>
              <li>**Scalability:** Designing for tomorrow's growth.</li>
            </ul>
          </motion.section>

        </div>
      </div>

      {/* Features and Benefits (Grid with Icons) */}
      <div className="bg-white py-16">
        <motion.section
          className="max-w-6xl mx-auto px-6 md:px-12"
          variants={itemVariants}
        >
          <h2 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
            Powerful Features Engineered for Success
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="p-8 border border-gray-100 rounded-lg shadow-xl bg-white text-center transition-transform duration-500 hover:scale-[1.02]" // Elevated card style
                variants={itemVariants}
              >
                <feature.icon className="text-indigo-600 mx-auto mb-4" size={36} />
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>


     {/* Team Introduction (Focus on a single key member) */}
<div className="bg-gray-50 py-16">
  <motion.section
    className="max-w-4xl mx-auto px-6 md:px-12"
    variants={containerVariants}
  >
    <h2 className="text-4xl font-extrabold text-gray-900 mb-12 text-center">
      Meet Our Visionary Founder
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 bg-white rounded-2xl shadow-2xl border-b-4 border-indigo-600">
      {teamMembers.map((member, index) => (
        <motion.div
          key={index}
          className="lg:col-span-1 flex flex-col items-center p-4"
          variants={itemVariants}
        >
          {/* Controlled size image */}
          <div className="relative mb-4 rounded-full overflow-hidden ring-4 ring-indigo-300 ring-offset-4"
               style={{ width: '180px', height: '180px' }}> {/* Adjust size here */}
            <Image
              src={member.image}
              alt={member.name}
              width={180}  // Explicit width
              height={180} // Explicit height
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        </motion.div>
      ))}

      <div className="lg:col-span-2 flex flex-col justify-center p-4">
        <h3 className="text-3xl font-bold text-gray-900 mb-1">
          {teamMembers[0].name}
        </h3>
        <p className="text-indigo-600 font-semibold text-lg mb-4">{teamMembers[0].title}</p>
        <p className="text-gray-700 leading-relaxed mb-6 border-l-4 border-indigo-200 pl-4 italic">
          {teamMembers[0].description}
        </p>

        {/* Social Icons */}
        <div className="flex space-x-5 mt-4">
          {teamMembers[0].social.facebook && (
            <Link
              href={teamMembers[0].social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <FaFacebookF size={24} />
            </Link>
          )}
          {teamMembers[0].social.linkedin && (
            <Link
              href={teamMembers[0].social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              <FaLinkedinIn size={24} />
            </Link>
          )}
          {teamMembers[0].social.github && (
            <Link
              href={teamMembers[0].social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-800 hover:text-black transition-colors"
            >
              <FaGithub size={24} />
            </Link>
          )}
        </div>
      </div>
    </div>
  </motion.section>
</div>



      {/* Call to Action (Big and Bold) */}
      <motion.section
        className="bg-indigo-600 py-20 mt-0" // Full width colored section
        variants={itemVariants}
      >
        <div className="max-w-5xl mx-auto text-center px-6 md:px-12">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Ready to Elevate Your E-Commerce?
          </h2>
          <p className="text-xl text-indigo-100 leading-relaxed mb-10">
            Join the growing number of businesses succeeding online with **E-Commerces**.
            Start your journey today!
          </p>
          <Link
            href="/products"
            className="bg-white text-indigo-600 hover:bg-indigo-50 font-extrabold py-4 px-12 rounded-lg text-lg uppercase tracking-wider transition-all duration-300 inline-block shadow-2xl"
          >
            Explore Our Products
          </Link>
        </div>
      </motion.section>
    </motion.main>
  );
};

export default AboutUsClient;