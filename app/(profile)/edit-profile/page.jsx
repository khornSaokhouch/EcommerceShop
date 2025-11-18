'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../stores/userStore';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, User, Mail, Phone, Loader2, Save } from 'lucide-react'; // Added Save icon
import toast from 'react-hot-toast';

// --- ConfirmationModal (Updated Style) ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isSubmitting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm mx-auto transform transition-all duration-300">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Changes</h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to save these changes to your profile?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            // Primary button style matching the sidebar accent
            className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-wait"
          >
            {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
                <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? 'Saving...' : 'Yes, Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- EditProfilePage (Updated Style) ---
export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading, fetchUser, updateUser } = useUserStore();

  const [formData, setFormData] = useState({ name: '', phone_number: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch logged-in user on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Populate form when user is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name ?? '',
        phone_number: user.phone_number ?? '',
        image: null,
      });
      // Clear image preview if user object changes
      setImagePreview(null); 
    }
  }, [user]);

  const getUserInitial = (name) => {
    // Return two initials if possible, e.g., 'JS'
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length > 1) {
        return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  };

  const getCleanImageUrl = (url) => {
    if (!url) return null;
    const lastHttpIndex = url.lastIndexOf('http');
    if (lastHttpIndex > 0) return url.substring(lastHttpIndex);
    return url;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      // Revoke the old object URL to prevent memory leaks
      if (imagePreview) URL.revokeObjectURL(imagePreview); 
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleConfirmUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const loadingToast = toast.loading('Updating profile...');

    const data = new FormData();
    data.append('name', formData.name);
    // Only append phone_number if it exists/is provided
    if (formData.phone_number) data.append('phone_number', formData.phone_number); 
    if (formData.image) data.append('image', formData.image);

    try {
      await updateUser(data);
      toast.success('Profile updated successfully!', { id: loadingToast });
      // Clean up the image preview URL after successful upload
      if (imagePreview) URL.revokeObjectURL(imagePreview); 
      setImagePreview(null);
    } catch (err) {
      const errorMessage = err.message || 'Failed to update profile.';
      toast.error(errorMessage, { id: loadingToast });
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-lg flex justify-center items-center h-96">
        <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
      </div>
    );
  }

  const currentImageUrl = getCleanImageUrl(user.profile_image_url);
  const userInitial = getUserInitial(user.name);

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        isSubmitting={isSubmitting}
      />
      
      {/* Main Container - New Shadow Style */}
      <div className="bg-white p-8 rounded-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Information</h1>
        <p className="text-gray-500 mb-8">Update your personal details, including your profile photo.</p>

        <form onSubmit={handleFormSubmit} className="space-y-8">
          
          {/* Profile Photo Section - Increased visual separation */}
          <div className="p-6 border border-gray-200 rounded-xl bg-gray-50/50">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-3">Profile Photo</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              
              <div className="relative w-28 h-28 flex-shrink-0">
                {/* Profile Image/Fallback */}
                {imagePreview || currentImageUrl ? (
                  <Image
                    src={imagePreview || currentImageUrl}
                    alt="Profile Preview"
                    fill
                    sizes="112px"
                    className="rounded-full object-cover bg-gray-200"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-3xl">
                    {userInitial}
                  </div>
                )}
                
                {/* Upload Button - Refined Style */}
                <label
                  htmlFor="image-upload"
                  className="absolute -bottom-1 -right-1 flex items-center justify-center w-10 h-10 bg-white border border-gray-300 rounded-full text-blue-600 shadow-md cursor-pointer hover:bg-gray-100 transition-colors"
                  title="Upload New Photo"
                >
                  <Camera className="w-5 h-5" />
                  <input
                    id="image-upload"
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <p className="text-sm text-gray-500 max-w-sm">
                  JPG or PNG only. Maximum file size 5MB. Uploading a new image will replace the current one.
                </p>
                {imagePreview && (
                    <span className="mt-2 inline-block text-xs text-green-600 font-medium">
                        New image selected. Click 'Save Changes' to apply.
                    </span>
                )}
              </div>
            </div>
          </div>

          {/* Account Details Section */}
          <div className="p-6 border border-gray-200 rounded-xl bg-gray-50/50">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 border-b border-gray-100 pb-3">Personal Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Full Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    // Clean input focus style
                    className="w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                    required
                  />
                </div>
              </div>

              {/* Email (Disabled) */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address (Cannot be changed)
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={user.email}
                    disabled
                    // Disabled input style
                    className="w-full py-2.5 pl-10 pr-3 border border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
              
              {/* Phone Number */}
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (Optional)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    placeholder="e.g., +1 555-1234"
                    // Clean input focus style
                    className="w-full py-2.5 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Link
              href="/profile"
              // Secondary button style: White/Outline
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              // Primary action button style: Solid Blue/Indigo
              className="flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}