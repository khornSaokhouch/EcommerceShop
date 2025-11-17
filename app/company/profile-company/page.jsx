"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "../../stores/userStore";
import { useCompanyInfoStore } from "../../stores/useCompanyInfoStore";
import Image from "next/image";
import { Mail, MapPin, Clock, Globe, Facebook, Instagram, Twitter, Linkedin, Edit3, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CompanyProfilePage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { company, fetchCompanyByUserId } = useCompanyInfoStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (user?.id) {
        await fetchCompanyByUserId(user.id);
      }
      setLoading(false);
    };
    fetchData();
  }, [user?.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center text-xl text-indigo-600">Loading company profile...</div>;

  const displayCompany = company || {};

  // Helper component for section titles
  const SectionTitle = ({ children }) => (
    <h2 className="text-2xl font-bold text-gray-800 border-b border-indigo-200 pb-2 mb-4">
      {children}
    </h2>
  );

  return (
    <div className="min-h-screen  p-6 sm:p-10">
      <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-xl max-w-full mx-auto border border-gray-100">

        {/* --- Action Buttons --- */}
        <div className="flex justify-end gap-3 mb-8">
          <button
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-full text-sm font-medium hover:bg-indigo-700 transition duration-150 shadow-md"
            onClick={() => router.push("/company/edit-profile")}
          >
            <Edit3 className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
          <button
            className="flex items-center space-x-2 px-4 py-2 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-100 transition duration-150 border border-gray-200"
            onClick={() => router.push("/company/settings")}
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
        </div>

        {/* --- Header / Company Identity --- */}
        <div className="flex flex-col md:flex-row md:items-start pb-8 mb-8 border-b border-gray-200">
          <div className="relative w-32 h-32 mb-6 md:mb-0 mr-8 rounded-xl overflow-hidden border-3 border-white shadow-lg flex-shrink-0">
            <Image
              src={displayCompany.company_image_url || user?.profile_image_url || "/default-avatar.png"}
              alt={displayCompany.company_name || user?.name || "Profile"}
              fill
              className="object-cover"
              sizes="128px"
            />
          </div>
          <div className="flex-grow pt-2">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-1 leading-tight">
              {displayCompany.company_name || user?.name || "Company Name"}
            </h1>
            {/* Displaying the owner's name subtly below the company name */}
            {displayCompany.company_name && (
              <p className="text-lg text-indigo-500 font-medium mb-4">Owner: {user?.name}</p>
            )}

            {/* Contact Info */}
            <div className="space-y-2 text-gray-600 mt-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span className="text-sm">{user?.email}</span>
              </div>
              {displayCompany.website_url && (
                <div className="flex items-center space-x-3">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <a href={displayCompany.website_url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-sm hover:text-indigo-800 transition">
                    {displayCompany.website_url}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* --- Description / About Us --- */}
        {displayCompany.description && (
          <section className="mb-10 p-6 bg-gray-50 rounded-xl border border-gray-100">
            <SectionTitle>About Us</SectionTitle>
            <p className="text-gray-700 leading-relaxed text-base indent-6">{displayCompany.description}</p>
          </section>
        )}

        {/* --- Operational Info --- */}
        {(displayCompany.business_hours || displayCompany.address || displayCompany.city || displayCompany.country) && (
          <section className="mb-10">
            <SectionTitle>Operational Details</SectionTitle>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Business Hours Card */}
              {displayCompany.business_hours && (
                <div className="flex items-start space-x-4 p-5 border border-indigo-100 rounded-xl bg-white shadow-sm transition hover:shadow-md">
                  <div className="p-3 bg-indigo-50 text-indigo-700 rounded-full flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Operating Hours</h4>
                    <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">{displayCompany.business_hours}</p>
                  </div>
                </div>
              )}
              
              {/* Address Card */}
              {(displayCompany.address || displayCompany.city || displayCompany.country) && (
                <div className="flex items-start space-x-4 p-5 border border-indigo-100 rounded-xl bg-white shadow-sm transition hover:shadow-md">
                  <div className="p-3 bg-indigo-50 text-indigo-700 rounded-full flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Location</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {[displayCompany.address, displayCompany.city, displayCompany.country].filter(Boolean).join(", ")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* --- Social Media --- */}
        {displayCompany.facebook_url || displayCompany.instagram_url || displayCompany.twitter_url || displayCompany.linkedin_url ? (
          <section>
            <SectionTitle>Connect With Us</SectionTitle>
            <div className="flex space-x-6">
              {displayCompany.facebook_url && (
                <a href={displayCompany.facebook_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:scale-110 transition duration-200">
                  <Facebook className="w-7 h-7" />
                </a>
              )}
              {displayCompany.instagram_url && (
                <a href={displayCompany.instagram_url} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:scale-110 transition duration-200">
                  <Instagram className="w-7 h-7" />
                </a>
              )}
              {displayCompany.twitter_url && (
                <a href={displayCompany.twitter_url} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:scale-110 transition duration-200">
                  <Twitter className="w-7 h-7" />
                </a>
              )}
              {displayCompany.linkedin_url && (
                <a href={displayCompany.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:scale-110 transition duration-200">
                  <Linkedin className="w-7 h-7" />
                </a>
              )}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}