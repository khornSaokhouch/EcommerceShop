"use client";

import { useState, useEffect } from "react";
import { useCategoryStore } from "../../../stores/useCategoryStore";
import { useStore } from "../../../stores/useStore";
import { motion } from "framer-motion";
import { CheckCircle, Upload, X, Package, DollarSign, Archive, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const AddEditProductForm = ({ product, onSave, onCancel, loading: formIsSaving }) => {
  // Determine initial quantity safely
  const initialQuantity =
    product?.product_items && product.product_items.length > 0
      ? product.product_items[0].quantity_in_stock
      : 0;

  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    category_id: product?.category_id || "",
    store_id: product?.store_id || "",
    product_image: null,
    quantity_in_stock: initialQuantity !== undefined ? Number(initialQuantity) : 0,
  });
  
  const { categories, fetchCategories, loading: categoriesLoading } = useCategoryStore();
  const { stores, fetchStores, loading: storesLoading } = useStore();

  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    setFormData({
      name: product?.name || "",
      description: product?.description || "",
      price: product?.price || "",
      category_id: product?.category_id || "",
      store_id: product?.store_id || "",
      product_image: null,
      quantity_in_stock: initialQuantity !== undefined ? Number(initialQuantity) : 0,
    });
    setImagePreview(product?.product_image_url || null);
  }, [product, initialQuantity]);

  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, [fetchCategories, fetchStores]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = (type === 'number' || name === 'quantity_in_stock' || name === 'price') 
                      ? (value === "" ? "" : Number(value)) 
                      : value;
    setFormData((f) => ({ ...f, [name]: newValue }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((f) => ({ ...f, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((f) => ({ ...f, product_image: file }));
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setFormData((f) => ({ ...f, product_image: null }));
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formIsSaving) return;
    
    if (!formData.name || !formData.price || !formData.category_id || !formData.store_id) {
        toast.error("Please fill in all required fields.");
        return;
    }

    onSave(formData);
  };

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: "easeIn" } },
  };

  // Helper input component for consistency
  const FormInput = ({ id, label, placeholder, type = 'text', icon: Icon, value, onChange, required = false, className = '' }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {Icon && (
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Icon className="w-5 h-5" />
                </span>
            )}
            <input
                id={id}
                name={id}
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                disabled={formIsSaving}
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm
                            focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 
                            disabled:bg-gray-50 transition-colors ${Icon ? 'pl-10' : 'pl-4'} ${className}`}
            />
        </div>
    </div>
  );

  return (
    <motion.div
      // FIX: Added max-h-[90vh] and overflow-y-auto to limit height and enable scrolling
      className="w-full max-w-xl mx-auto max-h-[90vh] overflow-y-auto" 
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100">
        
        {/* Header (Sticky if the content scrolls) */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">{product ? "Edit Product" : "Add New Product"}</h2>
          </div>
          <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
            
                {/* 1. Product Name */}
                <div className="col-span-1">
                    <FormInput
                        id="name"
                        label="Product Name"
                        placeholder="e.g., Ultra HD Monitor"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* 2. Price */}
                <div className="col-span-1">
                    <FormInput
                        id="price"
                        label="Unit Price"
                        placeholder="0.00"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        icon={DollarSign}
                        className="placeholder:font-mono"
                    />
                </div>

                {/* 3. Store Select */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Store <span className="text-red-500">*</span></label>
                    <select
                        value={formData.store_id}
                        onChange={(e) => handleSelectChange("store_id", e.target.value)}
                        required
                        disabled={formIsSaving || storesLoading}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-gray-50 transition-colors"
                    >
                        <option value="">{storesLoading ? 'Loading Stores...' : 'Select Store'}</option>
                        {stores.map((store) => (
                            <option key={store.id} value={store.id}>
                                {store.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 4. Category Select */}
                <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category <span className="text-red-500">*</span></label>
                    <select
                        value={formData.category_id}
                        onChange={(e) => handleSelectChange("category_id", e.target.value)}
                        required
                        disabled={formIsSaving || categoriesLoading}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-gray-50 transition-colors"
                    >
                        <option value="">{categoriesLoading ? 'Loading Categories...' : 'Select Category'}</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* 5. Quantity */}
                <div className="col-span-2">
                    <FormInput
                        id="quantity_in_stock"
                        label="Initial Stock Quantity"
                        placeholder="0"
                        type="number"
                        value={formData.quantity_in_stock}
                        onChange={handleChange}
                        required
                        icon={Archive}
                        className="w-full sm:w-1/2 lg:w-1/3"
                    />
                </div>

                {/* 6. Description - Span 2 columns */}
                <div className="col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Detailed product features, materials, and usage."
                        rows={3}
                        disabled={formIsSaving}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 disabled:bg-gray-50 resize-none transition-colors"
                    />
                </div>

                {/* 7. Image Upload - Span 2 columns */}
                <div className="col-span-2 pt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                    <div className="flex space-x-4">
                        
                        {/* Current/Upload Preview Area */}
                        <div className={`relative flex-shrink-0 w-32 h-32 rounded-lg border-2 overflow-hidden ${imagePreview ? 'border-gray-300' : 'border-dashed border-gray-200 bg-gray-50'}`}>
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-400">
                                    <Package className="w-8 h-8" />
                                </div>
                            )}

                            {/* Remove Button */}
                            {imagePreview && (
                                <button
                                    type="button"
                                    className="absolute top-1 right-1 bg-red-600/90 hover:bg-red-700 text-white p-1.5 rounded-full shadow-md"
                                    onClick={() => {
                                        setImagePreview(null);
                                        setFormData((f) => ({ ...f, product_image: null }));
                                        document.getElementById('image-upload').value = ''; 
                                    }}
                                    disabled={formIsSaving}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Upload Button/Instructions */}
                        <label
                            htmlFor="image-upload"
                            className={`flex-grow flex flex-col items-center justify-center p-4 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer transition-colors ${formIsSaving ? 'bg-gray-100 text-gray-500' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700'}`}
                        >
                            <Upload className="w-6 h-6 mb-1" />
                            <p className="text-sm font-medium">Click to select a file</p>
                            <p className="text-xs">PNG, JPG, or GIF (max 5MB)</p>
                            <input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={formIsSaving} />
                        </label>
                    </div>
                </div>

            </div>
          
            {/* Footer Buttons (Non-sticky, scrolls with content) */}
            <div className="mt-8 pt-5 border-t border-gray-100 flex justify-end space-x-3">
                <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors font-semibold shadow-sm"
                disabled={formIsSaving}
                >
                Cancel
                </button>
                <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-colors flex items-center justify-center font-semibold shadow-lg disabled:bg-indigo-400"
                disabled={formIsSaving}
                >
                {formIsSaving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <CheckCircle className="w-5 h-5 mr-2" />}
                {product ? "Update Product" : "Save Product"}
                </button>
            </div>
        </form>
      </div>
    </motion.div>
  );
};

export default AddEditProductForm;