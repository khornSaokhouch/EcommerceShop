"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Heart, ShoppingCart, Zap, ShieldCheck } from "lucide-react";
import { useShoppingCartStore } from "../../stores/useShoppingCart";
import { useUserStore } from "../../stores/userStore";
import { usePromotionsCategoryStore } from "../../stores/usePromotionsCategoryStore";

export default function ProductCard({ product, isFavourite, onAddFavourite }) {
  const userId = useUserStore((state) => state.user?.id);
  const { createCart } = useShoppingCartStore();
  const { categoriesByPromotion, loading, fetchCategoriesByPromotion } = usePromotionsCategoryStore();

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
        loading: "Initializing cart...", 
        success: "Unit added to cart", 
        error: (err) => err.message || "Failed to add." 
      }
    );
  };

// inside ProductCard.js component...

return (
  <div className="group relative bg-white rounded-[1.5rem] border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col h-full">
    {/* 1. Image Area - Made slightly shorter for better balance */}
    <Link href={`/details/${product.id}`} className="relative aspect-[1/1] overflow-hidden bg-slate-50">
      <img
        src={product.product_image_url || "/placeholder.svg"}
        alt={product.name}
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Badge Styling */}
      {hasPromotion && (
        <div className="absolute top-3 left-3 bg-blue-600 text-white text-[9px] font-black px-2 py-1 rounded-md shadow-sm uppercase tracking-widest z-10">
          -{discount}%
        </div>
      )}

      {/* Simplified Heart Button */}
      <button
        onClick={handleFavouriteClick}
        className="absolute top-3 right-3 p-2 rounded-lg bg-white/80 backdrop-blur-sm text-slate-400 hover:text-red-500 transition-colors z-10"
      >
        <Heart className={`w-4 h-4 ${favourited ? "fill-red-500 text-red-500" : ""}`} />
      </button>
    </Link>

    {/* 2. Content Area - Tightened text spacing */}
    <div className="p-4 flex flex-col flex-1">
      <p className="text-[9px] font-bold text-blue-500 uppercase tracking-tighter mb-1">
        {product.category || "General Tech"}
      </p>

      <Link href={`/details/${product.id}`}>
        <h2 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
          {product.name}
        </h2>
      </Link>
      
      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed h-8">
        {product.description || "Premium technical hardware gear."}
      </p>

      {/* 3. Price & Action - Clean and compact */}
      <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
        <div>
          <span className="text-lg font-black text-slate-900">${discountedPrice.toFixed(0)}</span>
          {hasPromotion && (
            <span className="text-[10px] text-slate-400 line-through ml-2">${product.price.toFixed(0)}</span>
          )}
        </div>

        <button
          onClick={handleAddToCart}
          className="flex items-center justify-center w-9 h-9 bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-all active:scale-90"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
);
}