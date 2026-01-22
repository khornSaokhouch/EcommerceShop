"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Heart, ShoppingCart } from "lucide-react";
import { useShoppingCartStore } from "../../stores/useShoppingCart";
import { useUserStore } from "../../stores/userStore";
import { usePromotionsCategoryStore } from "../../stores/usePromotionsCategoryStore";
import { motion } from "framer-motion";

// Helper to slugify product names
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
    .replace(/\-\-+/g, '-');    // Replace multiple - with single -
};

export default function ProductCard({ product, isFavourite, onAddFavourite }) {
  const userId = useUserStore((state) => state.user?.id);
  const { createCart } = useShoppingCartStore();
  const { fetchCategoriesByPromotion } = usePromotionsCategoryStore();

  const [favourited, setFavourited] = useState(isFavourite || false);

  useEffect(() => {
    setFavourited(isFavourite);
  }, [isFavourite]);

  useEffect(() => {
    if (product.promotion?.id) {
      fetchCategoriesByPromotion(product.promotion.id);
    }
  }, [product.promotion?.id, fetchCategoriesByPromotion]);

  const hasPromotion = product.promotion && product.promotion.discount_percentage > 0;
  const discount = hasPromotion ? product.promotion.discount_percentage : 0;
  const discountedPrice = hasPromotion
    ? product.price - (product.price * discount) / 100
    : product.price;

  const handleFavouriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return toast.error("Please login to manage favourites.");

    try {
      setFavourited(!favourited);
      await onAddFavourite(product.id);
    } catch (err) {
      setFavourited(isFavourite);
      toast.error("Update failed");
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!userId) return toast.error("Please log in to add to cart.");

    await toast.promise(
      createCart({ user_id: userId, items: [{ product_item_id: product.id, qty: 1 }] }),
      { 
        loading: "Adding unit...", 
        success: "Unit added to cart", 
        error: (err) => err.message || "Failed to add." 
      }
    );
  };

  // Slugified product name for URLs
  const productSlug = slugify(product.name);

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative bg-white rounded-[24px] border border-slate-100 overflow-hidden hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full"
    >
      {/* 1. Image Area */}
      <Link href={`/details/${productSlug}`} className="relative aspect-[1.1/1] overflow-hidden bg-slate-50 p-3">
        <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white">
          <img
            src={product.product_image_url || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-700 group-hover:scale-110 p-2"
          />
        </div>
        
        {/* Promotion Badge */}
        {hasPromotion && (
          <div className="absolute top-5 left-5 bg-blue-600 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow-lg z-10 uppercase tracking-widest">
            -{discount}% OFF
          </div>
        )}

        {/* Favorite Toggle */}
        <button
          onClick={handleFavouriteClick}
          className={`absolute top-5 right-5 p-2 rounded-xl backdrop-blur-md transition-all z-10 border ${
            favourited 
              ? "bg-red-50 text-red-500 border-red-100" 
              : "bg-white/80 text-slate-400 border-slate-100 hover:text-red-500"
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${favourited ? "fill-current" : ""}`} />
        </button>
      </Link>

      {/* 2. Content Area */}
      <div className="px-5 pb-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
            <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-md">
                {product.category || "Hardware"}
            </span>
            <div className="flex-1 h-px bg-slate-50" />
        </div>

        <Link href={`/details/${productSlug}`}>
          <h2 className="text-[14px] font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1 uppercase tracking-tight">
            {product.name}
          </h2>
        </Link>
        
        <p className="text-[11px] text-slate-500 line-clamp-2 mb-4 leading-relaxed h-8 font-medium italic">
          {product.description || "Official high-performance gear."}
        </p>

        {/* 3. Price & Action */}
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
               <span className="text-base font-black text-slate-900 tracking-tighter">
                 ${discountedPrice.toFixed(0)}
               </span>
               {hasPromotion && (
                 <span className="text-[10px] text-slate-300 line-through font-bold">
                   ${product.price.toFixed(0)}
                 </span>
               )}
            </div>
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Unit Price</span>
          </div>

          <button
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-95 group/cart shadow-lg shadow-slate-100"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:inline">Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
