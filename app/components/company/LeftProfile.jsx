"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Edit, UploadCloud, Save, X, Loader2, User } from "lucide-react";

export default function LeftProfile({ user, onSaveProfile, updating }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    setName(user?.name || "");
    setImagePreview(user?.profile_image_url || "");
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm text-center sticky top-28">
      <div className="relative group mb-8">
        <div className="relative w-36 h-36 mx-auto rounded-[40px] p-1 bg-gradient-to-tr from-blue-600 to-cyan-400 shadow-xl">
          <div className="w-full h-full rounded-[36px] overflow-hidden bg-white flex items-center justify-center border-4 border-white relative">
            {imagePreview ? (
              <Image src={imagePreview} alt="Avatar" fill className="object-cover" />
            ) : (
              <span className="text-4xl font-black text-blue-600">{user?.name?.[0]}</span>
            )}
          </div>
        </div>

        {isEditing && (
          <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-white text-blue-600 rounded-2xl shadow-xl flex items-center justify-center cursor-pointer hover:bg-blue-600 hover:text-white transition-all">
            <UploadCloud size={20} />
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={updating} />
          </label>
        )}
      </div>

      <div className="space-y-4">
        {isEditing ? (
          <div className="space-y-4">
             <input
               type="text" value={name} onChange={(e) => setName(e.target.value)}
               className="w-full bg-slate-50 border-none rounded-2xl py-3 px-4 text-sm font-bold text-center text-slate-800 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
               placeholder="Admin Name"
             />
             <div className="flex gap-2">
                <button 
                   onClick={() => onSaveProfile({ name, imageFile })}
                   className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-200"
                >
                   {updating ? <Loader2 className="animate-spin mx-auto w-4 h-4" /> : "Sync Node"}
                </button>
                <button onClick={() => setIsEditing(false)} className="px-4 py-3 bg-slate-50 text-slate-400 rounded-xl"><X size={16}/></button>
             </div>
          </div>
        ) : (
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Identity Lead</p>
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{user?.name}</h2>
            <p className="text-xs font-bold text-blue-500 uppercase mt-1">{user?.email}</p>
            <button onClick={() => setIsEditing(true)} className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-slate-50 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100">
               <Edit size={14} /> Modify Identity
            </button>
          </div>
        )}
      </div>
    </div>
  );
}