'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../../stores/userStore';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, User, Mail, Phone, Loader2, Save, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// --- Improved ConfirmationModal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isSubmitting }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 mx-auto">
            <Save className="w-7 h-7 text-blue-600" />
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Save Changes?</h2>
          <p className="text-[13px] font-medium text-slate-500 mb-8 leading-relaxed">
            Your profile details will be updated across the entire Technocore ecosystem.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onClose} 
              className="py-3.5 text-[13px] font-bold text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm} 
              disabled={isSubmitting} 
              className="py-3.5 text-[13px] font-bold text-white bg-blue-600 rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading, fetchUser, updateUser } = useUserStore();

  const [formData, setFormData] = useState({ name: '', phone_number: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name ?? '', phone_number: user.phone_number ?? '', image: null });
      setImagePreview(null); 
    }
  }, [user]);

  const getCleanImageUrl = (url) => {
    if (!url) return null;
    const lastHttpIndex = url.lastIndexOf('http');
    if (lastHttpIndex > 0) return url.substring(lastHttpIndex);
    return url;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files?.[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (imagePreview) URL.revokeObjectURL(imagePreview); 
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleConfirmUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading('Updating your profile...');

    const data = new FormData();
    data.append('name', formData.name);
    if (formData.phone_number) data.append('phone_number', formData.phone_number); 
    if (formData.image) data.append('image', formData.image);

    try {
      await updateUser(data);
      toast.success('Profile synced successfully!', { id: loadingToast });
      if (imagePreview) URL.revokeObjectURL(imagePreview); 
      setImagePreview(null);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message || 'Update failed', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
        <Loader2 className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  const currentImageUrl = getCleanImageUrl(user.profile_image_url);
  const userInitial = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        isSubmitting={isSubmitting}
      />
      
      <div className="p-4 sm:p-8">
        <div className="mb-10">
            <h1 className="text-2xl font-black text-slate-900 mb-2">Edit Profile</h1>
            <p className="text-[13px] font-medium text-slate-500">Manage your identity and public information.</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="space-y-10">
          
          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-slate-50/50 rounded-[32px] border border-slate-100">
            <div className="relative group">
              <div className="relative w-32 h-32 rounded-[40px] p-1 bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-xl shadow-blue-500/10">
                <div className="w-full h-full rounded-[36px] overflow-hidden bg-white flex items-center justify-center border-4 border-white relative">
                  {imagePreview || currentImageUrl ? (
                    <Image
                      src={imagePreview || currentImageUrl}
                      alt="Avatar"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-black text-blue-600">{userInitial}</span>
                  )}
                </div>
              </div>
              
              <label
                htmlFor="image-upload"
                className="absolute -bottom-2 -right-2 flex items-center justify-center w-12 h-12 bg-white text-blue-600 rounded-2xl shadow-xl border border-slate-100 cursor-pointer hover:bg-blue-600 hover:text-white transition-all group-active:scale-90"
              >
                <Camera className="w-6 h-6" />
                <input id="image-upload" type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
              </label>
            </div>
            
            <div className="text-center sm:text-left space-y-2">
              <h4 className="font-bold text-slate-900">Profile Picture</h4>
              <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest leading-relaxed">
                PNG, JPG or WEBP <br/> Max 5MB file size
              </p>
              {imagePreview && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase">New Photo Ready</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[13px] font-medium text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
              <div className="relative opacity-60">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full py-4 pl-12 pr-4 bg-slate-100 border border-slate-200 rounded-2xl text-[13px] font-medium text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-[13px] font-medium text-slate-500 uppercase tracking-[0.2em] ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+1 234 567 890"
                  className="w-full py-4 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium text-slate-700 focus:bg-white focus:ring-4 focus:ring-blue-500/5 focus:border-blue-200 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-8 border-t border-slate-50">
            <Link
              href="/profile"
              className="px-8 py-4 text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-[20px] font-bold text-[13px] shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Save className="w-4 h-4" />
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </>
  );
}