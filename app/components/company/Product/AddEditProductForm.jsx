"use client";

import { useState, useEffect } from "react";
import { useCategoryStore } from "../../../stores/useCategoryStore";
import { useStore } from "../../../stores/useStore";
import { motion } from "framer-motion";
import { useUserStore } from "../../../stores/userStore";

import {
  X,
  Package,
  DollarSign,
  Archive,
  Loader2,
  Save,
  UploadCloud,
  Camera,
  LayoutGrid,
} from "lucide-react";

export default function AddEditProductForm({
  product,
  onSave,
  onCancel,
  loading,
}) {
  const initialQty = product?.product_items?.[0]?.quantity_in_stock || 0;
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category_id: product?.category_id || "",
    store_id: product?.store_id || "",
    product_image: null,
    quantity_in_stock: Number(initialQty),
  });

  const { categories } = useCategoryStore();
  const [imagePreview, setImagePreview] = useState(
    product?.product_image_url || null
  );
  const { stores, fetchStoresByUserId } = useStore();
  const { user } = useUserStore();

  useEffect(() => {
    if (user?.id) fetchStoresByUserId(user.id); // fetch current user's stores
  }, [user?.id, fetchStoresByUserId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((f) => ({ ...f, product_image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-white rounded-[32px] w-full max-w-2xl relative z-10 shadow-2xl border border-slate-100 overflow-hidden font-sans max-h-[90vh] flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-8 border-b border-slate-50 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
            {product ? "Modify Unit Node" : "Initialize Unit"}
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Configure hardware specification registry
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="space-y-8"
        >
          {/* Visual Identification */}
          <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-slate-50 rounded-[28px] border border-slate-100 shadow-inner">
            <div className="relative w-32 h-32 rounded-[24px] p-1 bg-white border-2 border-slate-200">
              <div className="w-full h-full rounded-[20px] bg-slate-50 flex items-center justify-center overflow-hidden">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    className="object-contain p-2 w-full h-full"
                  />
                ) : (
                  <Camera className="text-slate-300" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <UploadCloud size={18} />
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">
                Hardware Visualization
              </p>
              <p className="text-xs font-medium text-slate-400">
                Transmit a high-resolution node identifier (JPG/PNG max 5MB).
                Existing media will be overwritten.
              </p>
            </div>
          </div>

          {/* General Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SpecInput
              label="Unit Name"
              value={formData.name}
              onChange={(v) => setFormData((f) => ({ ...f, name: v }))}
              placeholder="e.g. CORE_i9_V2"
            />
            <SpecInput
              label="Unit Valuation ($)"
              type="number"
              value={formData.price}
              onChange={(v) => setFormData((f) => ({ ...f, price: v }))}
              placeholder="0.00"
            />

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Classification Registry
              </label>
              <select
                value={formData.category_id}
                onChange={(e) =>
                  setFormData((f) => ({ ...f, category_id: e.target.value }))
                }
                className="w-full appearance-none bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
              >
                <option value="">Select Category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Operational Hub
              </label>
              <select
  value={formData.store_id || ""}
  onChange={e => setFormData(f => ({ ...f, store_id: Number(e.target.value) }))}
  className="w-full appearance-none bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
>
  <option value="">Select Hub...</option>
  {stores.map(s => (
    <option key={s.id} value={s.id}>
      {s.name}
    </option>
  ))}
</select>

            </div>
          </div>

          <SpecInput
            label="Registry Stock Quantity"
            type="number"
            value={formData.quantity_in_stock}
            onChange={(v) =>
              setFormData((f) => ({ ...f, quantity_in_stock: v }))
            }
          />

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Technical Intelligence (Description)
            </label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none resize-none"
            />
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-4 pt-4 sticky bottom-0 bg-white">
            <button
              type="button"
              onClick={onCancel}
              className="py-4 bg-slate-50 text-slate-400 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-100"
            >
              Abort
            </button>
            <button
              type="submit"
              disabled={loading}
              className="py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                <Save size={16} />
              )}
              {product ? "Update Registry" : "Execute Deployment"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

function SpecInput({ label, value, onChange, type = "text", placeholder }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-50 border-none rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none"
      />
    </div>
  );
}
