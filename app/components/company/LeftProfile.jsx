"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Edit, UploadCloud, Save, X, Loader2 } from "lucide-react";

const LeftProfile = ({ user, onSaveProfile, updating }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imagePreview, setImagePreview] = useState("/default-avatar.png");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setImagePreview(user?.profile_image_url || "/default-avatar.png");
    setImageFile(null);
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    if (!name.trim() || updating) return;
    onSaveProfile?.({ name, imageFile });
  };

  const handleCancel = () => {
    if (updating) return;
    setIsEditing(false);
    setName(user?.name || "");
    setImagePreview(user?.profile_image_url || "/default-avatar.png");
    setImageFile(null);
  };

  return (
    <div className="lg:col-span-1 space-y-6">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center sticky top-8">
        
        {/* Profile Image Area */}
        <div className="relative w-36 h-36 mx-auto mb-6 group">
          <Image
            src={imagePreview}
            alt="Profile"
            fill
            sizes="144px"
            className="rounded-full object-cover border-4 border-indigo-100 shadow-md transition duration-300"
            priority
          />
          
          {/* Hidden Image Upload Overlay */}
          {isEditing && (
            <label 
                htmlFor="profile_photo_upload" 
                className={`absolute inset-0 flex items-center justify-center rounded-full transition duration-300 cursor-pointer text-white 
                           ${updating ? 'bg-gray-400 opacity-70' : 'bg-black bg-opacity-40 hover:bg-opacity-60'} 
                           ${imageFile || imagePreview === "/default-avatar.png" ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            >
              <UploadCloud className="w-6 h-6" />
              <input
                  id="profile_photo_upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={updating}
              />
            </label>
          )}
        </div>


        <div className="space-y-1">
          {isEditing ? (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-lg font-bold text-center focus:outline-none focus:ring-2 focus:ring-indigo-500 transition disabled:bg-gray-50"
                placeholder="Enter Full Name"
                disabled={updating}
              />
              <p className="text-sm text-gray-500 pt-1">{email}</p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
              <p className="text-md text-gray-500">{email}</p>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 pt-4 border-t border-gray-100">
          {isEditing ? (
            <div className="flex justify-center gap-3">
              <button
                onClick={handleSave}
                type="button"
                disabled={updating}
                className="bg-indigo-600 text-white flex items-center gap-2 px-5 py-2 text-sm rounded-full shadow-md hover:bg-indigo-700 transition disabled:bg-indigo-400 disabled:cursor-not-allowed"
              >
                {updating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Save className="w-4 h-4" />
                )}
                {updating ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                onClick={handleCancel}
                type="button"
                disabled={updating}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-2 px-5 py-2 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition disabled:opacity-50"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              type="button"
              className="flex justify-center items-center gap-2 w-full px-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-300 rounded-full hover:bg-indigo-50 transition"
            >
              <Edit className="w-4 h-4" /> Edit Profile Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftProfile;