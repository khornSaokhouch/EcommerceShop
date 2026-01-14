"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useCategoryStore } from "../../stores/useCategoryStore";
import { useProductStore } from "../../stores/useProductStore";
import { useStore } from "../../stores/useStore";
import { useUserStore } from "../../stores/userStore";
import { useFavouritesStore } from "../../stores/useFavouritesStore";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { 
  LayoutGrid, 
  Store, 
  Search, 
  Loader2, 
  ChevronRight, 
  Check, 
  FilterX 
} from "lucide-react";

// --- 1. REFINED SIDEBAR CHECKBOX (Indicator on the Right) ---
const SidebarCheckbox = ({ item, isChecked, onToggle }) => {
  const iconFallback = item.name ? item.name.charAt(0).toUpperCase() : '?';

  return (
    <motion.li layout>
      <button
        onClick={() => onToggle(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group border
          ${isChecked 
            ? "bg-blue-50/40 border-blue-100 shadow-sm" 
            : "bg-transparent border-transparent hover:bg-slate-50"}`}
      >
        {/* LEFT SIDE: Original Icon (Always Visible) */}
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black shrink-0 transition-all duration-500
          ${isChecked ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600"}`}
        >
          {item.image_url ? (
            <img src={item.image_url} alt="" className="w-full h-full object-cover rounded-xl" />
          ) : (
            <span>{iconFallback}</span>
          )}
        </div>

        {/* CENTER: Label */}
        <span className={`truncate flex-1 text-left text-[11px] font-black uppercase tracking-tight transition-colors
          ${isChecked ? "text-blue-700" : "text-slate-500 group-hover:text-slate-900"}`}>
          {item.name}
        </span>

        {/* RIGHT SIDE: Selection Indicator */}
        <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-all duration-300
          ${isChecked 
            ? "bg-blue-600 border-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.3)]" 
            : "border-slate-200 group-hover:border-slate-300 bg-white"}`}
        >
          {isChecked && <Check className="w-3.5 h-3.5 text-white stroke-[4px]" />}
        </div>
      </button>
    </motion.li>
  );
};

const CategoryFilterProducts = () => {
  const { categories, fetchCategories } = useCategoryStore();
  const { stores, fetchStores } = useStore();
  const { products, fetchProductsByCategoryAndStore, loading, error } = useProductStore();
  const userId = useUserStore((state) => state.user?.id);
  const { favourites, addFavourite, removeFavourite } = useFavouritesStore();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStores, setSelectedStores] = useState([]);

  useEffect(() => {
    fetchCategories();
    fetchStores();
  }, [fetchCategories, fetchStores]);

  // Initial Auto-select
  useEffect(() => {
    if (categories.length > 0 && selectedCategories.length === 0) {
      setSelectedCategories([categories[0].id]);
    }
  }, [categories, selectedCategories]);

  // Fetch Logic (Supports multi-state, but usually API takes one ID or "all")
  useEffect(() => {
    if (selectedCategories.length > 0) {
        fetchProductsByCategoryAndStore(
            selectedCategories[selectedCategories.length - 1], // Most recent selection
            selectedStores.length > 0 ? selectedStores[selectedStores.length - 1] : 'all'
        );
    }
  }, [selectedCategories, selectedStores, fetchProductsByCategoryAndStore]);

  const toggleCategory = (id) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleStore = (id) => {
    if (id === 'all') { setSelectedStores([]); return; }
    setSelectedStores(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleToggleFavourite = async (productId) => {
    if (!userId) return toast.error("Log in to manage favourites.");
    const favRecord = favourites?.find((f) => f.product_id === productId);
    try {
      if (favRecord) { await removeFavourite(favRecord.id); toast.success("Removed"); }
      else { await addFavourite({ user_id: userId, product_id: productId }); toast.success("Added"); }
    } catch (err) { toast.error("Failed"); }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen gap-10 pt-6 pb-20 px-4 lg:px-8 ">
      
      {/* Sidebar */}
      <aside className="w-full lg:w-72 shrink-0">
        <div className="lg:sticky lg:top-28 space-y-6">
          
          {/* Category Filter */}
          <div className="bg-white rounded-[32px] p-5 border border-slate-100 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2 px-2">
              <LayoutGrid className="w-3.5 h-3.5 text-blue-600" /> System Registry
            </h2>
            <ul className="space-y-1">
              {categories.map((cat) => (
                <SidebarCheckbox
                  key={cat.id}
                  item={cat}
                  isChecked={selectedCategories.includes(cat.id)}
                  onToggle={toggleCategory}
                />
              ))}
            </ul>
          </div>

          {/* Partner Filter */}
          <div className="bg-white rounded-[32px] p-5 border border-slate-100 shadow-sm">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2 px-2">
              <Store className="w-3.5 h-3.5 text-cyan-500" /> Partner Nodes
            </h2>
            <ul className="space-y-1 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              <SidebarCheckbox
                item={{ id: 'all', name: 'Global Network' }}
                isChecked={selectedStores.length === 0}
                onToggle={toggleStore}
              />
              <div className="h-px bg-slate-50 my-2 mx-4" />
              {stores.map((store) => (
                <SidebarCheckbox
                  key={store.id}
                  item={store}
                  isChecked={selectedStores.includes(store.id)}
                  onToggle={toggleStore}
                />
              ))}
            </ul>
          </div>

        </div>
      </aside>

      {/* Main Feed */}
      <main className="flex-1 min-w-0">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-100 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{selectedCategories.length} Categories</span>
                <ChevronRight className="w-3 h-3 text-slate-300" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {selectedStores.length === 0 ? "Global Network" : `${selectedStores.length} Nodes`}
                </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                Hardware <span className="text-blue-600">Inventory</span>
            </h1>
          </div>
          <div className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
            Units Found: {products.length}
          </div>
        </div>

        {error ? (
          <div className="p-12 bg-red-50 rounded-[32px] border border-red-100 text-center text-red-600 font-bold uppercase tracking-widest text-xs">Registry Error</div>
        ) : loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {[...Array(6)].map((_, i) => <ProductSkeleton key={i} />)}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {products.length > 0 ? (
              <motion.div
                key={selectedCategories.join('')}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6"
              >
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavourite={favourites?.some((f) => f?.product_id === product.id)}
                    onAddFavourite={() => handleToggleFavourite(product.id)}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="py-32 text-center bg-white rounded-[40px] border border-dashed border-slate-200">
                <FilterX className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No matching registry nodes</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </main>
    </div>
  );
};

// --- SKELETON ---
const ProductSkeleton = () => (
  <div className="bg-white rounded-[24px] p-4 border border-slate-100 animate-pulse">
    <div className="aspect-[1.1/1] bg-slate-100 rounded-2xl mb-4"></div>
    <div className="h-3 bg-slate-100 rounded-full w-1/4 mb-3"></div>
    <div className="h-4 bg-slate-100 rounded-full w-3/4 mb-2"></div>
  </div>
);

export default CategoryFilterProducts;