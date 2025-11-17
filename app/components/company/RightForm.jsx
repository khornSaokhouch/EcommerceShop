"use client";

import { useEffect, useState } from "react";
import {
  Building,
  Globe,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Save,
  Loader2,
  UploadCloud,
} from "lucide-react";
import Image from "next/image";

// Helper component for standardizing input fields
const InputField = ({
  icon: Icon,
  label,
  name,
  value,
  onChange,
  placeholder,
  disabled,
  type = "text",
}) => (
  <div className="w-full">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <Icon className="h-5 w-5 text-indigo-400" aria-hidden="true" />
      </div>
      <input
        id={name}
        name={name}
        type={type}
        value={type === "file" ? undefined : value ?? ""}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className="block w-full rounded-lg border border-gray-300 pl-10 py-2.5 shadow-sm
          focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none
          sm:text-sm disabled:bg-gray-50 disabled:cursor-not-allowed transition"
        aria-disabled={disabled}
      />
    </div>
  </div>
);

// Helper component for standardized section headers
const SectionHeader = ({ title }) => (
    <h3 className="text-xl font-bold text-gray-900 pb-2 mb-6 border-b border-gray-100">
        {title}
    </h3>
);


const RightForm = ({
  companyData,
  handleInputChange,
  loading,
  isNew,
}) => {
  const [imageSrc, setImageSrc] = useState("/default-avatar.png");

  useEffect(() => {
    let url = "/default-avatar.png";
    // Check if a new file is uploaded
    if (companyData?.company_image instanceof File) {
      url = URL.createObjectURL(companyData.company_image);
    } 
    // Check for existing URL
    else if (companyData?.company_image_url) {
      url = companyData.company_image_url;
    }
    // Fallback if image is stored as a simple path string
    else if (typeof companyData?.company_image === "string") {
      url = `/storage/${companyData.company_image}`;
    }

    setImageSrc(url);
    
    // Cleanup function for object URLs
    return () => {
        if (companyData?.company_image instanceof File) {
            URL.revokeObjectURL(url);
        }
    };
  }, [companyData?.company_image, companyData?.company_image_url]);

  const handleFileChange = (e) => {
    handleInputChange(e); 
  };

  return (
    <div className="lg:col-span-2">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-lg border border-gray-100">
        
        {/* Company Image Upload Section */}
        <section className="flex flex-col items-center mb-10 pb-6 border-b border-gray-100">
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-indigo-100 shadow-lg mb-4 group">
            <Image
              src={imageSrc}
              alt={`${companyData?.company_name ?? "Company"} Logo`}
              fill
              sizes="128px"
              className="object-cover"
              priority
            />
             <label 
                htmlFor="company_image" 
                className={`absolute inset-0 flex items-center justify-center rounded-xl transition duration-300 cursor-pointer text-white 
                            ${loading ? 'bg-gray-400 opacity-70' : 'bg-black bg-opacity-30 hover:bg-opacity-60 opacity-0 group-hover:opacity-100'}`}
            >
              <UploadCloud className="w-6 h-6" />
              <input
                id="company_image"
                name="company_image"
                type="file"
                accept="image/*"
                className="sr-only"
                disabled={loading}
                onChange={handleFileChange}
              />
            </label>
          </div>

          <h4 className="text-lg font-semibold text-gray-900 mb-1">
            {companyData?.company_name ? `${companyData.company_name} Logo` : "Upload Company Logo"}
          </h4>
          <p className="text-sm text-gray-500">
            Click logo to change. Recommended size: 512x512 px.
          </p>
        </section>

        {/* 1. Company Information */}
        <section className="mb-10">
          <SectionHeader title="Basic Information" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={Building}
              label="Company Name"
              name="company_name"
              value={companyData?.company_name ?? ""}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="e.g., Acme Corp"
            />
            <InputField
              icon={Globe}
              label="Website URL"
              name="website_url"
              type="url"
              value={companyData?.website_url ?? ""}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="https://www.acmecorp.com"
            />
          </div>
          <label
            htmlFor="description"
            className="mt-6 block text-sm font-medium text-gray-700 mb-2"
          >
            Detailed Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={companyData?.description ?? ""}
            onChange={handleInputChange}
            disabled={loading}
            placeholder="Tell us about your company, services, and mission."
            className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500
              focus:ring-2 focus:ring-indigo-200 focus:outline-none sm:text-sm disabled:bg-gray-50
              disabled:cursor-not-allowed transition p-3"
          />
        </section>

        {/* 2. Location & Hours */}
        <section className="mb-10">
          <SectionHeader title="Location & Operations" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={MapPin}
              label="Street Address"
              name="address"
              value={companyData?.address ?? ""}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="123 Main St"
            />
            <InputField
              icon={MapPin}
              label="City"
              name="city"
              value={companyData?.city ?? ""}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="New York"
            />
            <InputField
              icon={MapPin}
              label="Country"
              name="country"
              value={companyData?.country ?? ""}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="USA"
            />
             <div className="md:col-span-2">
                <label
                    htmlFor="business_hours"
                    className="mt-0 block text-sm font-medium text-gray-700 mb-2"
                >
                    <Clock className="w-4 h-4 inline mr-1 text-indigo-500" /> Business Hours
                </label>
                <textarea
                    id="business_hours"
                    name="business_hours"
                    rows={3}
                    value={companyData?.business_hours ?? ""}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="E.g., Mon-Fri: 9:00 AM - 5:00 PM, Sat: 10:00 AM - 2:00 PM"
                    className="block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500
                    focus:ring-2 focus:ring-indigo-200 focus:outline-none sm:text-sm disabled:bg-gray-50
                    disabled:cursor-not-allowed transition p-3"
                />
            </div>
          </div>
        </section>

        {/* 3. Social Media */}
        <section className="mb-8">
          <SectionHeader title="Social Media Presence" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              icon={Facebook}
              label="Facebook URL"
              name="facebook_url"
              type="url"
              value={companyData?.facebook_url ?? ""}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="https://facebook.com/acme"
            />
            <InputField
              icon={Instagram}
              label="Instagram URL"
              name="instagram_url"
              type="url"
              value={companyData?.instagram_url ?? ""}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="https://instagram.com/acmecorp"
            />
            <InputField
              icon={Twitter}
              label="Twitter/X URL"
              name="twitter_url"
              type="url"
              value={companyData?.twitter_url ?? ""}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="https://twitter.com/acmecorp"
            />
            <InputField
              icon={Linkedin}
              label="LinkedIn URL"
              name="linkedin_url"
              type="url"
              value={companyData?.linkedin_url ?? ""}
              onChange={handleInputChange}
              disabled={loading}
              placeholder="https://linkedin.com/company/acmecorp"
            />
          </div>
        </section>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={() => window.history.back()} // Simple navigation back/cancel
            disabled={loading}
            className="rounded-full border border-gray-300 bg-white px-5 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-transparent bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {loading
              ? isNew
                ? "Creating..."
                : "Saving..."
              : isNew
              ? "Create Profile"
              : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightForm;