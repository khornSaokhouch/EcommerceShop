"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Globe,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSellerStore } from "../../stores/useSellerStore";
import { useRouter } from "next/navigation"; // Import useRouter
import { motion } from "framer-motion"; // Import for animations

const cambodianProvinces = [
  "Phnom Penh",
  "Banteay Meanchey",
  "Battambang",
  "Kampong Cham",
  "Kampong Chhnang",
  "Kampong Speu",
  "Kampong Thom",
  "Kampot",
  "Kandal",
  "Kep",
  "Koh Kong",
  "Kratie",
  "Mondulkiri",
  "Oddar Meanchey",
  "Pailin",
  "Preah Sihanouk",
  "Preah Vihear",
  "Prey Veng",
  "Pursat",
  "Ratanakiri",
  "Siem Reap",
  "Stung Treng",
  "Svay Rieng",
  "Takeo",
  "Tboung Khmum",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function BecomeCompanyForm() {
  const {
    form,
    loading,
    error,
    success,
    handleChange,
    handleFileChange,
    submitForm,
    resetForm, // Helper function to reset form (to ensure form to be empty)
  } = useSellerStore();
  const router = useRouter(); // Initialize useRouter

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const filteredProvinces = form.countryRegion
    ? cambodianProvinces.filter((province) =>
        province.toLowerCase().includes(form.countryRegion.toLowerCase())
      )
    : cambodianProvinces;

  const handleProvinceSelect = (province) => {
    const syntheticEvent = {
      target: { name: "countryRegion", value: province },
    };
    handleChange(syntheticEvent);
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Toast notifications when store updates
  useEffect(() => {
    if (error) toast.error(error);
    if (success) {
      toast.success(success);
      router.push("/"); // Redirect to home page on success
    }
  }, [error, success, router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitForm();
  };

  return (
    <motion.div
      className="bg-gray-50 min-h-screen flex items-center justify-center p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="max-w-4xl w-full mx-auto p-8 bg-white rounded-xl shadow-2xl"
        variants={itemVariants}
      >
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h2 className="text-3xl font-bold text-gray-800">
            Register Your Company
          </h2>
          <p className="text-gray-500 mt-2">
            Fill out the form below to get started.
          </p>
        </motion.div>

        <motion.form onSubmit={handleSubmit} className="space-y-6" variants={itemVariants}>
          {/* Street & Province Row */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
            {/* Street */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                <MapPin className="text-gray-500 w-4 h-4" />
                Street Address
              </label>
              <input
                type="text"
                name="streetAddress"
                value={form.streetAddress}
                onChange={handleChange}
                placeholder="123 Innovation Drive"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Province Dropdown */}
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                <Globe className="text-gray-500 w-4 h-4" />
                Province / City <span className="text-red-500">*</span>
              </label>
              <div className="relative" ref={dropdownRef}>
                <input
                  type="text"
                  name="countryRegion"
                  value={form.countryRegion}
                  onChange={(e) => {
                    handleChange(e);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  required
                  placeholder="Search or select a province"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500"
                />
                {isDropdownOpen && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredProvinces.map((province) => (
                      <li
                        key={province}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer"
                        onClick={() => handleProvinceSelect(province)}
                      >
                        {province}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </motion.div>

          {/* Basic Info Grid */}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-6" variants={itemVariants}>
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700"
              >
                <User className="text-gray-500 w-4 h-4" />
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label
                htmlFor="companyName"
                className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700"
              >
                <Building2 className="text-gray-500 w-4 h-4" />
                Company Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Building2 className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Creative Inc."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700"
              >
                <Mail className="text-gray-500 w-4 h-4" />
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phoneNumber"
                className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700"
              >
                <Phone className="text-gray-500 w-4 h-4" />
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="+855 12 345 678"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </motion.div>

          {/* Document Upload */}
          <motion.div variants={itemVariants}>
            <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
              <FileText className="text-gray-500 w-4 h-4" />
              Upload Document (PDF, DOC, DOCX)
            </label>
            <input
              type="file"
              name="document"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-2 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500"
            />
            {form.document && (
              <p className="text-sm text-gray-600 mt-2">
                📄 Uploaded: <strong>{form.document.name}</strong>
              </p>
            )}
          </motion.div>

          {/* Submit */}
          <motion.div variants={itemVariants}>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-md"
              }`}
            >
              {loading ? "Submitting..." : "Submit Registration"}
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}